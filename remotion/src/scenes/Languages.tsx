import { AbsoluteFill, useCurrentFrame, useVideoConfig, interpolate, spring } from "remotion";
import { display, body, C } from "../theme";

const LANGS = [
  "English", "中文", "日本語", "한국어", "Deutsch",
  "Italiano", "Français", "Español", "Bahasa", "Polski",
];

export const Languages: React.FC = () => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();

  const headIn = spring({ frame, fps, config: { damping: 18 } });

  return (
    <AbsoluteFill style={{ alignItems: "center", justifyContent: "center", padding: 80 }}>
      <div
        style={{
          fontFamily: body,
          fontSize: 26,
          color: C.cyan,
          letterSpacing: 6,
          textTransform: "uppercase",
          opacity: headIn,
          marginBottom: 24,
        }}
      >
        Play in your language
      </div>
      <div
        style={{
          fontFamily: display,
          fontWeight: 900,
          fontSize: 200,
          color: C.white,
          opacity: headIn,
          transform: `scale(${interpolate(headIn, [0, 1], [0.7, 1])})`,
          background: "linear-gradient(135deg,#ff2e88,#00ffd1)",
          WebkitBackgroundClip: "text",
          WebkitTextFillColor: "transparent",
          lineHeight: 1,
        }}
      >
        10
      </div>
      <div
        style={{
          fontFamily: body,
          fontSize: 36,
          color: C.dim,
          marginTop: 12,
          marginBottom: 56,
          opacity: headIn,
        }}
      >
        languages, one snake.
      </div>

      <div
        style={{
          display: "flex",
          flexWrap: "wrap",
          justifyContent: "center",
          gap: 16,
          maxWidth: 880,
        }}
      >
        {LANGS.map((l, i) => {
          const t = spring({ frame: frame - 20 - i * 4, fps, config: { damping: 20 } });
          return (
            <div
              key={l}
              style={{
                fontFamily: body,
                fontWeight: 600,
                fontSize: 28,
                color: C.white,
                padding: "14px 28px",
                border: `1.5px solid ${i % 2 === 0 ? "rgba(0,255,209,0.6)" : "rgba(255,46,136,0.6)"}`,
                borderRadius: 999,
                background: "rgba(255,255,255,0.04)",
                opacity: t,
                transform: `translateY(${interpolate(t, [0, 1], [30, 0])}px)`,
                boxShadow: `0 0 20px ${i % 2 === 0 ? "rgba(0,255,209,0.2)" : "rgba(255,46,136,0.2)"}`,
              }}
            >
              {l}
            </div>
          );
        })}
      </div>
    </AbsoluteFill>
  );
};
