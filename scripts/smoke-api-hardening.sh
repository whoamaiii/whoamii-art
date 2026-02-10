#!/usr/bin/env bash
set -euo pipefail

PORT="${PORT:-3100}"
BASE_URL="${BASE_URL:-http://localhost:${PORT}}"
RATE_LIMIT_MAX="${SUBMISSION_RATE_LIMIT_MAX:-8}"
AUTO_START_DEV="${SMOKE_AUTO_START_DEV:-1}"
TMP_DIR="${TMPDIR:-/tmp}/portfolio-smoke-api-$$"

mkdir -p "${TMP_DIR}"

PASS_COUNT=0
FAIL_COUNT=0
DEV_PID=""

cleanup() {
  if [[ -n "${DEV_PID}" ]] && kill -0 "${DEV_PID}" 2>/dev/null; then
    kill "${DEV_PID}" >/dev/null 2>&1 || true
    wait "${DEV_PID}" 2>/dev/null || true
  fi
  rm -rf "${TMP_DIR}"
}
trap cleanup EXIT

pass() {
  PASS_COUNT=$((PASS_COUNT + 1))
  printf 'PASS: %s\n' "$1"
}

fail() {
  FAIL_COUNT=$((FAIL_COUNT + 1))
  printf 'FAIL: %s\n' "$1"
}

random_ip() {
  printf '198.51.100.%s' "$(( (RANDOM % 200) + 20 ))"
}

header_value() {
  local headers_file="$1"
  local key_lower
  key_lower="$(printf '%s' "$2" | tr '[:upper:]' '[:lower:]')"
  awk -v key="${key_lower}" '
    BEGIN { IGNORECASE = 1 }
    /^[A-Za-z0-9-]+:/ {
      split($0, parts, ":")
      current = tolower(parts[1])
      if (current == key) {
        line = $0
        sub(/^[^:]+:[[:space:]]*/, "", line)
        gsub(/\r/, "", line)
        print line
        exit
      }
    }
  ' "${headers_file}"
}

assert_status() {
  local name="$1"
  local got="$2"
  local expected="$3"
  if [[ "${got}" == "${expected}" ]]; then
    pass "${name} status ${expected}"
  else
    fail "${name} expected ${expected}, got ${got}"
  fi
}

assert_header_present() {
  local name="$1"
  local headers_file="$2"
  local key="$3"
  local value
  value="$(header_value "${headers_file}" "${key}")"
  if [[ -n "${value}" ]]; then
    pass "${name} header ${key} present (${value})"
  else
    fail "${name} missing header ${key}"
  fi
}

ensure_server() {
  if curl -fsS "${BASE_URL}/robots.txt" >/dev/null 2>&1; then
    pass "Server already reachable at ${BASE_URL}"
    return
  fi

  if [[ "${AUTO_START_DEV}" != "1" ]]; then
    fail "Server not reachable at ${BASE_URL} and SMOKE_AUTO_START_DEV=0"
    return
  fi

  printf 'Starting dev server on %s...\n' "${BASE_URL}"
  npm run dev -- --port "${PORT}" >"${TMP_DIR}/dev.log" 2>&1 &
  DEV_PID=$!

  for _ in $(seq 1 60); do
    if curl -fsS "${BASE_URL}/robots.txt" >/dev/null 2>&1; then
      pass "Dev server started"
      return
    fi
    sleep 1
  done

  fail "Dev server did not become ready"
  printf '--- dev log ---\n'
  tail -n 200 "${TMP_DIR}/dev.log" || true
}

check_415() {
  local endpoint="$1"
  local label="$2"
  local headers_file="${TMP_DIR}/${label}-415.headers"
  local body_file="${TMP_DIR}/${label}-415.body"
  local ip
  ip="$(random_ip)"

  local code
  code="$(curl -sS -o "${body_file}" -D "${headers_file}" -w '%{http_code}' \
    -X POST "${BASE_URL}${endpoint}" \
    -H "x-forwarded-for: ${ip}" \
    --data 'x=1')"

  assert_status "${label} 415" "${code}" "415"
}

write_large_payload() {
  local file="$1"
  local shape="$2"
  node -e "
    const fs = require('fs');
    const type = process.argv[1];
    const path = process.argv[2];
    const big = 'a'.repeat(13000);
    const data = type === 'contact'
      ? { name: 'n', email: 'e@e.com', subject: 's', message: big }
      : { name: 'n', email: 'e@e.com', budget: '\$1000', timeline: 'soon', idea: big, references: '' };
    fs.writeFileSync(path, JSON.stringify(data));
  " "${shape}" "${file}"
}

check_413_with_content_length() {
  local endpoint="$1"
  local label="$2"
  local payload_shape="$3"
  local headers_file="${TMP_DIR}/${label}-413.headers"
  local body_file="${TMP_DIR}/${label}-413.body"
  local payload_file="${TMP_DIR}/${label}-413.json"
  local ip
  ip="$(random_ip)"

  write_large_payload "${payload_file}" "${payload_shape}"

  local code
  code="$(curl -sS -o "${body_file}" -D "${headers_file}" -w '%{http_code}' \
    -X POST "${BASE_URL}${endpoint}" \
    -H 'Content-Type: application/json' \
    -H "x-forwarded-for: ${ip}" \
    --data-binary @"${payload_file}")"

  assert_status "${label} 413 content-length" "${code}" "413"
  assert_header_present "${label} 413 content-length" "${headers_file}" "x-ratelimit-limit"
  assert_header_present "${label} 413 content-length" "${headers_file}" "x-ratelimit-remaining"
  assert_header_present "${label} 413 content-length" "${headers_file}" "x-ratelimit-reset"
}

check_413_chunked() {
  local endpoint="$1"
  local label="$2"
  local chunk_shape="$3"
  local ip
  ip="$(random_ip)"
  local output_file="${TMP_DIR}/${label}-chunked.out"

  ENDPOINT="${endpoint}" BASE_URL="${BASE_URL}" CLIENT_IP="${ip}" CHUNK_SHAPE="${chunk_shape}" node <<'NODE' >"${output_file}"
const http = require("http");

const endpoint = process.env.ENDPOINT;
const clientIp = process.env.CLIENT_IP;
const base = new URL(process.env.BASE_URL);
const chunkShape = process.env.CHUNK_SHAPE;

const req = http.request(
  {
    hostname: base.hostname,
    port: base.port,
    path: endpoint,
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      "Transfer-Encoding": "chunked",
      "x-forwarded-for": clientIp
    }
  },
  (res) => {
    let body = "";
    res.setEncoding("utf8");
    res.on("data", (chunk) => (body += chunk));
    res.on("end", () => {
      console.log(`status:${res.statusCode}`);
      console.log(`x-ratelimit-limit:${res.headers["x-ratelimit-limit"] || ""}`);
      console.log(`x-ratelimit-remaining:${res.headers["x-ratelimit-remaining"] || ""}`);
      console.log(`x-ratelimit-reset:${res.headers["x-ratelimit-reset"] || ""}`);
      console.log(`body:${body}`);
    });
  }
);

req.on("error", (error) => {
  console.error(error);
  process.exitCode = 1;
});

if (chunkShape === "contact") {
  req.write('{"name":"n","email":"e@e.com","subject":"s","message":"');
} else {
  req.write('{"name":"n","email":"e@e.com","budget":"$1000","timeline":"soon","idea":"');
}
req.write("a".repeat(13000));
if (chunkShape === "contact") {
  req.write('"}');
} else {
  req.write('","references":""}');
}
req.end();
NODE

  local status
  status="$(sed -n 's/^status://p' "${output_file}" | tail -n 1)"
  assert_status "${label} 413 chunked" "${status}" "413"
}

check_429() {
  local endpoint="$1"
  local label="$2"
  local ip
  ip="$(random_ip)"
  local first_429=0

  for i in $(seq 1 $((RATE_LIMIT_MAX + 4))); do
    local headers_file="${TMP_DIR}/${label}-429-${i}.headers"
    local body_file="${TMP_DIR}/${label}-429-${i}.body"
    local code
    code="$(curl -sS -o "${body_file}" -D "${headers_file}" -w '%{http_code}' \
      -X POST "${BASE_URL}${endpoint}" \
      -H 'Content-Type: application/json' \
      -H "x-forwarded-for: ${ip}" \
      --data '{"foo":"bar"}')"

    if [[ "${code}" == "429" ]]; then
      first_429="${i}"
      assert_header_present "${label} 429" "${headers_file}" "retry-after"
      assert_header_present "${label} 429" "${headers_file}" "x-ratelimit-limit"
      assert_header_present "${label} 429" "${headers_file}" "x-ratelimit-remaining"
      assert_header_present "${label} 429" "${headers_file}" "x-ratelimit-reset"
      break
    fi
  done

  if [[ "${first_429}" -eq 0 ]]; then
    fail "${label} did not reach 429 within expected burst"
    return
  fi

  if [[ "${first_429}" -le $((RATE_LIMIT_MAX + 1)) ]]; then
    pass "${label} reached 429 by request ${first_429}"
  else
    fail "${label} reached 429 too late at request ${first_429}"
  fi
}

main() {
  ensure_server

  check_415 "/api/contact" "contact"
  check_413_with_content_length "/api/contact" "contact" "contact"
  check_413_chunked "/api/contact" "contact" "contact"
  check_429 "/api/contact" "contact"

  check_415 "/api/commissions" "commissions"
  check_413_with_content_length "/api/commissions" "commissions" "commissions"
  check_413_chunked "/api/commissions" "commissions" "commissions"
  check_429 "/api/commissions" "commissions"

  printf '\nSummary: %s passed, %s failed\n' "${PASS_COUNT}" "${FAIL_COUNT}"
  if [[ "${FAIL_COUNT}" -ne 0 ]]; then
    exit 1
  fi
}

main "$@"
