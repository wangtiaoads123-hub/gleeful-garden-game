import { AbsoluteFill, useCurrentFrame, useVideoConfig, interpolate, spring } from "remotion";
import { display, body, C } from "../theme";

export const Hook: React.FC = () => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();

  const titleY = spring({ frame, fps, config: { damping: 16 } });
  const sub = spring({ frame: frame - 18, fps, config: { damping: 20 } });
  const flicker = 0.85 + Math.sin(frame * 0.6) * 0.15;
  const exit = interpolate(frame, [70, 90], [1, 0], { extrapolateLeft: "clamp", extrapolateRight: "clamp" });

  return (
    <AbsoluteFill style={{ alignItems: "center", justifyContent: "center", padding: 80, opacity: exit }}>
      <div
        style={{
          fontFamily: body,
          color: C.cyan,
          letterSpacing: 8,
          fontSize: 28,
          marginBottom: 24,
          opacity: sub,
          textTransform: "uppercase",
        }}
      >
        // System.Boot
      </div>
      <h1
        style={{
          fontFamily: display,
          fontWeight: 900,
          fontSize: 180,
          margin: 0,
          lineHeight: 0.95,
          textAlign: "center",
          color: C.white,
          transform: `translateY(${interpolate(titleY, [0, 1], [80, 0])}px)`,
          opacity: titleY * flicker,
          background: "linear-gradient(135deg,#00ffd1 0%,#ff2e88 100%)",
          WebkitBackgroundClip: "text",
          WebkitTextFillColor: "transparent",
          filter: "drop-shadow(0 0 40px rgba(0,255,209,0.6))",
        }}
      >
        NEON
        <br />
        SNAKE
      </h1>
      <div
        style={{
          marginTop: 40,
          fontFamily: body,
          fontSize: 32,
          color: C.dim,
          opacity: sub,
        }}
      >
        The classic. Reborn in light.
      </div>
    </AbsoluteFill>
  );
};
