import { AbsoluteFill, useCurrentFrame, useVideoConfig, interpolate, spring } from "remotion";
import { display, body, C } from "../theme";

export const CTA: React.FC = () => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();

  const a = spring({ frame, fps, config: { damping: 18 } });
  const b = spring({ frame: frame - 15, fps, config: { damping: 20 } });
  const c = spring({ frame: frame - 32, fps, config: { damping: 14 } });
  const pulse = 1 + Math.sin(frame * 0.25) * 0.04;

  return (
    <AbsoluteFill style={{ alignItems: "center", justifyContent: "center", padding: 80 }}>
      <div
        style={{
          fontFamily: body,
          fontSize: 28,
          letterSpacing: 6,
          color: C.pink,
          textTransform: "uppercase",
          opacity: a,
          marginBottom: 30,
        }}
      >
        ▶ Play now — free
      </div>

      <h2
        style={{
          fontFamily: display,
          fontWeight: 900,
          fontSize: 130,
          color: C.white,
          textAlign: "center",
          margin: 0,
          lineHeight: 1,
          opacity: a,
          transform: `translateY(${interpolate(a, [0, 1], [40, 0])}px)`,
          background: "linear-gradient(135deg,#00ffd1,#ff2e88)",
          WebkitBackgroundClip: "text",
          WebkitTextFillColor: "transparent",
          filter: "drop-shadow(0 0 30px rgba(0,255,209,0.5))",
        }}
      >
        Beat your<br />high score.
      </h2>

      <div
        style={{
          marginTop: 48,
          padding: "26px 56px",
          borderRadius: 999,
          background: "linear-gradient(90deg,#00ffd1,#22d3ee)",
          color: "#05010f",
          fontFamily: display,
          fontWeight: 900,
          fontSize: 38,
          letterSpacing: 2,
          opacity: b,
          transform: `scale(${b * pulse})`,
          boxShadow: "0 0 60px rgba(0,255,209,0.7)",
        }}
      >
        gleeful-garden-game.lovable.app
      </div>

      <div
        style={{
          marginTop: 36,
          fontFamily: body,
          fontSize: 24,
          color: C.dim,
          opacity: c,
          letterSpacing: 2,
        }}
      >
        No download · No signup · Just play.
      </div>
    </AbsoluteFill>
  );
};
