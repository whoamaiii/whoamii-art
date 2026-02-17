import { ImageResponse } from "next/og";

export const runtime = "edge";

export const alt = "WHOAMIII Portfolio";
export const size = {
  width: 1200,
  height: 630
};

export const contentType = "image/png";

export default function OpenGraphImage() {
  return new ImageResponse(
    (
      <div
        style={{
          width: "100%",
          height: "100%",
          display: "flex",
          flexDirection: "column",
          justifyContent: "space-between",
          padding: "56px 72px",
          background:
            "radial-gradient(circle at 14% 15%, rgba(226,77,47,0.45), transparent 50%), radial-gradient(circle at 84% 78%, rgba(46,107,104,0.5), transparent 45%), #12100f",
          color: "#f3ece2"
        }}
      >
        <p
          style={{
            fontSize: 24,
            textTransform: "uppercase",
            letterSpacing: "0.15em",
            opacity: 0.85
          }}
        >
          WHOAMIII
        </p>

        <h1
          style={{
            margin: 0,
            fontSize: 82,
            lineHeight: 1.03,
            width: "90%"
          }}
        >
          Structured Maximalist Portfolio
        </h1>

        <p style={{ margin: 0, fontSize: 30, opacity: 0.9 }}>
          Commissions · Artwork · Process Stories
        </p>
      </div>
    ),
    {
      ...size
    }
  );
}
