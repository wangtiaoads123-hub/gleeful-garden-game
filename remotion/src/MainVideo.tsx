import { AbsoluteFill, useCurrentFrame } from "remotion";
import {
  TransitionSeries,
  springTiming,
  linearTiming,
} from "@remotion/transitions";
import { fade } from "@remotion/transitions/fade";
import { slide } from "@remotion/transitions/slide";
import { Hook } from "./scenes/Hook";
import { Gameplay } from "./scenes/Gameplay";
import { Languages } from "./scenes/Languages";
import { CTA } from "./scenes/CTA";

export const MainVideo: React.FC = () => {
  const frame = useCurrentFrame();
  return (
    <AbsoluteFill style={{ background: "#05010f", overflow: "hidden" }}>
      {/* Persistent grid + glow background */}
      <AbsoluteFill
        style={{
          background:
            "radial-gradient(ellipse at 30% 20%, rgba(0,255,209,0.18), transparent 55%), radial-gradient(ellipse at 80% 90%, rgba(255,46,136,0.22), transparent 55%), #05010f",
        }}
      />
      <AbsoluteFill
        style={{
          backgroundImage:
            "linear-gradient(rgba(255,255,255,0.04) 1px, transparent 1px), linear-gradient(90deg, rgba(255,255,255,0.04) 1px, transparent 1px)",
          backgroundSize: "48px 48px",
          transform: `translate(${(frame * 0.4) % 48}px, ${(frame * 0.4) % 48}px)`,
        }}
      />

      <TransitionSeries>
        <TransitionSeries.Sequence durationInFrames={90}>
          <Hook />
        </TransitionSeries.Sequence>
        <TransitionSeries.Transition
          presentation={slide({ direction: "from-right" })}
          timing={springTiming({ config: { damping: 200 }, durationInFrames: 18 })}
        />
        <TransitionSeries.Sequence durationInFrames={120}>
          <Gameplay />
        </TransitionSeries.Sequence>
        <TransitionSeries.Transition
          presentation={fade()}
          timing={linearTiming({ durationInFrames: 15 })}
        />
        <TransitionSeries.Sequence durationInFrames={90}>
          <Languages />
        </TransitionSeries.Sequence>
        <TransitionSeries.Transition
          presentation={slide({ direction: "from-bottom" })}
          timing={springTiming({ config: { damping: 200 }, durationInFrames: 18 })}
        />
        <TransitionSeries.Sequence durationInFrames={90}>
          <CTA />
        </TransitionSeries.Sequence>
      </TransitionSeries>
    </AbsoluteFill>
  );
};
