import {
  AbsoluteFill,
  Artifact,
  useCurrentFrame,
  useVideoConfig,
  interpolate,
  spring,
} from "remotion";
import { TextAnimation } from "../library/components/text/TextAnimation";
import { loadFont } from "@remotion/google-fonts/Inter";

// This re-runs on every HMR update of this file
const hmrKey = Date.now();

// Floating shape component
const FloatingShape: React.FC<{
  size: number;
  color: string;
  initialX: number;
  initialY: number;
  delay: number;
}> = ({ size, color, initialX, initialY, delay }) => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();

  const progress = spring({
    frame: frame - delay,
    fps,
    config: { damping: 100, stiffness: 50, mass: 1 },
  });

  const floatY = interpolate(frame, [0, 60, 120], [0, -15, 0], {
    extrapolateRight: "extend",
  });

  const rotation = interpolate(frame, [0, 240], [0, 360], {
    extrapolateRight: "extend",
  });

  const scale = interpolate(progress, [0, 1], [0, 1]);
  const opacity = interpolate(progress, [0, 1], [0, 0.6]);

  return (
    <div
      style={{
        position: "absolute",
        left: initialX,
        top: initialY + floatY,
        width: size,
        height: size,
        borderRadius: size * 0.3,
        backgroundColor: color,
        transform: `scale(${scale}) rotate(${rotation}deg)`,
        opacity,
      }}
    />
  );
};

export const Main: React.FC = () => {
  const { fontFamily } = loadFont();
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();

  // Tagline fade in
  const taglineOpacity = interpolate(frame, [50, 70], [0, 1], {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
  });

  const taglineY = spring({
    frame: frame - 50,
    fps,
    config: { damping: 15, stiffness: 100 },
  });

  return (
    <>
      {/* Leave this here to generate a thumbnail */}
      {frame === 0 && (
        <Artifact content={Artifact.Thumbnail} filename="thumbnail.jpeg" />
      )}
      <AbsoluteFill
        style={{
          background:
            "linear-gradient(135deg, #0f0f0f 0%, #1a1a2e 50%, #16213e 100%)",
        }}
      >
        {/* Floating shapes */}
        <FloatingShape
          size={80}
          color="#22c55e"
          initialX={100}
          initialY={150}
          delay={0}
        />
        <FloatingShape
          size={50}
          color="#3b82f6"
          initialX={1100}
          initialY={100}
          delay={5}
        />
        <FloatingShape
          size={60}
          color="#8b5cf6"
          initialX={200}
          initialY={500}
          delay={10}
        />
        <FloatingShape
          size={40}
          color="#f59e0b"
          initialX={1050}
          initialY={550}
          delay={15}
        />
        <FloatingShape
          size={35}
          color="#ec4899"
          initialX={600}
          initialY={80}
          delay={8}
        />
        <FloatingShape
          size={45}
          color="#06b6d4"
          initialX={150}
          initialY={350}
          delay={12}
        />

        {/* Main content */}
        <AbsoluteFill className="flex flex-col items-center justify-center">
          <TextAnimation
            key={hmrKey}
            className="text-6xl font-bold text-center text-white"
            style={{ fontFamily }}
            createTimeline={({ textRef, tl, SplitText }) => {
              const splitText = new SplitText(textRef.current, {
                type: "chars",
                charsClass: "char",
              });

              tl.fromTo(
                splitText.chars,
                {
                  opacity: 0,
                  y: 50,
                  rotationX: 90,
                },
                {
                  opacity: 1,
                  y: 0,
                  rotationX: 0,
                  duration: 0.8,
                  stagger: 0.05,
                  ease: "back.out(1.7)",
                },
              );

              tl.to(
                splitText.chars,
                {
                  scale: 1.05,
                  duration: 0.3,
                  stagger: 0.02,
                  yoyo: true,
                  repeat: 1,
                  ease: "power2.inOut",
                },
                "+=0.5",
              );

              return tl;
            }}
          >
            welcome to{" "}
            <span className="text-green-400 font-light">Typeframes</span>
          </TextAnimation>

          {/* Tagline */}
          <div
            style={{
              opacity: taglineOpacity,
              transform: `translateY(${interpolate(taglineY, [0, 1], [20, 0])}px)`,
              marginTop: 24,
              fontFamily,
            }}
            className="text-xl text-gray-400 tracking-wide"
          >
            Create stunning videos with AI
          </div>
        </AbsoluteFill>
      </AbsoluteFill>
    </>
  );
};
