import { ImageResponse } from "next/og";

export const runtime = "edge";
export const contentType = "image/png";
export const size = {
  width: 1200,
  height: 630
};

export default function OpenGraphImage() {
  return new ImageResponse(
    (
      <div
        style={{
          width: "100%",
          height: "100%",
          display: "flex",
          flexDirection: "column",
          justifyContent: "center",
          background:
            "radial-gradient(circle at 15% 20%, #9D4EDD 0%, #0A0A0A 48%, #00D4D4 100%)",
          color: "#F5F5F5",
          padding: "72px"
        }}
      >
        <p
          style={{
            fontSize: 28,
            letterSpacing: 6,
            margin: 0,
            opacity: 0.88
          }}
        >
          QUENTIN QMANN
        </p>
        <h1
          style={{
            margin: "14px 0 0",
            fontSize: 78,
            lineHeight: 1.02
          }}
        >
          Motion Portfolio
        </h1>
        <p
          style={{
            margin: "18px 0 0",
            fontSize: 33,
            opacity: 0.9
          }}
        >
          Psychedelic replication and cinematic visual loops.
        </p>
      </div>
    ),
    {
      ...size
    }
  );
}
