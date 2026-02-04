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

// Orbiting ring component
const OrbitRing: React.FC<{
  radius: number;
  strokeWidth: number;
  color: string;
  delay: number;
}> = ({ radius, strokeWidth, color, delay }) => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();

  const progress = spring({
    frame: frame - delay,
    fps,
    config: { damping: 20, stiffness: 80 },
  });

  const rotation = interpolate(frame, [0, 360], [0, 360], {
    extrapolateRight: "extend",
  });

  const dashOffset = interpolate(frame, [0, 120], [0, -100], {
    extrapolateRight: "extend",
  });

  return (
    <svg
      width={radius * 2 + strokeWidth}
      height={radius * 2 + strokeWidth}
      style={{
        position: "absolute",
        left: "50%",
        top: "50%",
        transform: `translate(-50%, -50%) rotate(${rotation}deg) scale(${progress})`,
        opacity: progress * 0.3,
      }}
    >
      <circle
        cx={radius + strokeWidth / 2}
        cy={radius + strokeWidth / 2}
        r={radius}
        fill="none"
        stroke={color}
        strokeWidth={strokeWidth}
        strokeDasharray="20 40"
        strokeDashoffset={dashOffset}
        strokeLinecap="round"
      />
    </svg>
  );
};

// Particle dot component
const ParticleDot: React.FC<{
  x: number;
  y: number;
  size: number;
  delay: number;
  speed: number;
}> = ({ x, y, size, delay, speed }) => {
  const frame = useCurrentFrame();

  const pulse = interpolate(
    (frame + delay) % (60 / speed),
    [0, 30 / speed, 60 / speed],
    [0.3, 1, 0.3],
    { extrapolateRight: "clamp" },
  );

  const drift = interpolate(frame, [0, 120], [0, -20], {
    extrapolateRight: "extend",
  });

  return (
    <div
      style={{
        position: "absolute",
        left: x,
        top: y + drift,
        width: size,
        height: size,
        borderRadius: "50%",
        backgroundColor: "white",
        opacity: pulse * 0.4,
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

  // Glow pulse
  const glowPulse = interpolate(frame % 90, [0, 45, 90], [0.4, 0.8, 0.4], {
    extrapolateRight: "clamp",
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
        {/* Particle dots - filling entire frame */}
        {/* Top area */}
        <ParticleDot x={200} y={80} size={4} delay={0} speed={1} />
        <ParticleDot x={500} y={100} size={3} delay={15} speed={1.2} />
        <ParticleDot x={800} y={70} size={4} delay={30} speed={0.8} />
        <ParticleDot x={1100} y={90} size={3} delay={45} speed={1.1} />
        {/* Middle left/right */}
        <ParticleDot x={120} y={300} size={3} delay={20} speed={0.9} />
        <ParticleDot x={130} y={450} size={4} delay={10} speed={1.3} />
        <ParticleDot x={1150} y={280} size={4} delay={35} speed={1} />
        <ParticleDot x={1140} y={480} size={3} delay={25} speed={1.2} />
        {/* Bottom area */}
        <ParticleDot x={180} y={620} size={3} delay={40} speed={0.9} />
        <ParticleDot x={480} y={650} size={4} delay={5} speed={1.1} />
        <ParticleDot x={800} y={640} size={3} delay={12} speed={1} />
        <ParticleDot x={1100} y={630} size={4} delay={22} speed={0.9} />

        {/* Floating shapes - filling entire 1280x720 frame */}
        {/* Top edge - 5 shapes */}
        <FloatingShape size={50} color="#22c55e" initialX={50} initialY={30} delay={0} />
        <FloatingShape size={35} color="#3b82f6" initialX={320} initialY={50} delay={3} />
        <FloatingShape size={40} color="#ec4899" initialX={600} initialY={35} delay={6} />
        <FloatingShape size={35} color="#8b5cf6" initialX={880} initialY={45} delay={9} />
        <FloatingShape size={45} color="#f59e0b" initialX={1150} initialY={30} delay={2} />
        
        {/* Left edge - 3 shapes */}
        <FloatingShape size={38} color="#06b6d4" initialX={40} initialY={180} delay={4} />
        <FloatingShape size={32} color="#f59e0b" initialX={50} initialY={360} delay={7} />
        <FloatingShape size={40} color="#3b82f6" initialX={45} initialY={540} delay={10} />
        
        {/* Right edge - 3 shapes (moved further left to be visible) */}
        <FloatingShape size={36} color="#ec4899" initialX={1190} initialY={160} delay={5} />
        <FloatingShape size={42} color="#22c55e" initialX={1200} initialY={340} delay={8} />
        <FloatingShape size={38} color="#8b5cf6" initialX={1195} initialY={520} delay={11} />
        
        {/* Bottom edge - 5 shapes */}
        <FloatingShape size={45} color="#8b5cf6" initialX={50} initialY={630} delay={1} />
        <FloatingShape size={32} color="#22c55e" initialX={320} initialY={645} delay={4} />
        <FloatingShape size={38} color="#06b6d4" initialX={600} initialY={640} delay={7} />
        <FloatingShape size={35} color="#ec4899" initialX={880} initialY={645} delay={10} />
        <FloatingShape size={48} color="#3b82f6" initialX={1150} initialY={625} delay={3} />
        
        {/* Corner accents for full coverage */}
        <FloatingShape size={28} color="#f59e0b" initialX={1210} initialY={80} delay={12} />
        <FloatingShape size={30} color="#06b6d4" initialX={1205} initialY={600} delay={6} />
        <FloatingShape size={42} color="#22c55e" initialX={1200} initialY={650} delay={9} />

        {/* Orbiting rings */}
        <OrbitRing radius={280} strokeWidth={2} color="#22c55e" delay={0} />
        <OrbitRing radius={320} strokeWidth={1.5} color="#3b82f6" delay={10} />
        <OrbitRing radius={360} strokeWidth={1} color="#8b5cf6" delay={20} />

        {/* Center glow */}
        <div
          style={{
            position: "absolute",
            left: "50%",
            top: "50%",
            transform: "translate(-50%, -50%)",
            width: 600,
            height: 300,
            borderRadius: "50%",
            background:
              "radial-gradient(ellipse, rgba(34, 197, 94, 0.15) 0%, transparent 70%)",
            opacity: glowPulse,
            filter: "blur(40px)",
          }}
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

          {/* Gradient underline */}
          <div
            style={{
              opacity: taglineOpacity,
              transform: `scaleX(${interpolate(taglineY, [0, 1], [0, 1])})`,
              marginTop: 16,
              width: 200,
              height: 2,
              borderRadius: 1,
              background: "linear-gradient(90deg, transparent, #22c55e, #3b82f6, transparent)",
            }}
          />
        </AbsoluteFill>
      </AbsoluteFill>
    </>
  );
};
