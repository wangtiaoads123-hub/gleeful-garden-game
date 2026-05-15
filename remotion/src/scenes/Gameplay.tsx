import { AbsoluteFill, useCurrentFrame, useVideoConfig, interpolate, spring, staticFile, Img } from "remotion";
import { display, body, C } from "../theme";

export const Gameplay: React.FC = () => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();

  const phoneIn = spring({ frame, fps, config: { damping: 18, stiffness: 120 } });
  const labelIn = spring({ frame: frame - 25, fps, config: { damping: 20 } });
  const score = Math.floor(interpolate(frame, [20, 110], [0, 480], { extrapolateLeft: "clamp", extrapolateRight: "clamp" }));
  const tilt = Math.sin(frame * 0.04) * 3;

  return (
    <AbsoluteFill style={{ alignItems: "center", justifyContent: "center" }}>
      {/* Score badge — top */}
      <div
        style={{
          position: "absolute",
          top: 80,
          left: 80,
          fontFamily: display,
          fontWeight: 700,
          fontSize: 28,
          color: C.cyan,
          letterSpacing: 4,
          opacity: labelIn,
          padding: "16px 28px",
          border: `2px solid ${C.cyan}`,
          borderRadius: 999,
          boxShadow: "0 0 30px rgba(0,255,209,0.4)",
        }}
      >
        SCORE {score}
      </div>

      {/* Tag — top right */}
      <div
        style={{
          position: "absolute",
          top: 80,
          right: 80,
          fontFamily: body,
          fontSize: 22,
          color: C.pink,
          letterSpacing: 3,
          opacity: labelIn,
          textTransform: "uppercase",
        }}
      >
        ◆ Live in browser
      </div>

      {/* Phone frame */}
      <div
        style={{
          width: 460,
          height: 920,
          borderRadius: 56,
          padding: 14,
          background: "linear-gradient(135deg,#1a0a3a,#05010f)",
          border: "2px solid rgba(0,255,209,0.4)",
          boxShadow: "0 0 80px rgba(0,255,209,0.35), 0 0 120px rgba(255,46,136,0.25)",
          transform: `translateY(${interpolate(phoneIn, [0, 1], [200, 0])}px) rotate(${tilt}deg)`,
          opacity: phoneIn,
          overflow: "hidden",
        }}
      >
        <Img
          src={staticFile("images/game.png")}
          style={{
            width: "100%",
            height: "100%",
            objectFit: "cover",
            borderRadius: 44,
          }}
        />
      </div>

      {/* Bottom caption */}
      <div
        style={{
          position: "absolute",
          bottom: 80,
          fontFamily: display,
          fontSize: 44,
          fontWeight: 700,
          color: C.white,
          opacity: labelIn,
          letterSpacing: 2,
        }}
      >
        Tap. Swipe. <span style={{ color: C.pink }}>Glow.</span>
      </div>
    </AbsoluteFill>
  );
};
