import { motion } from "motion/react";
import { useEffect, useState } from "react";

interface WelcomeScreenProps {
  onComplete: () => void;
}

export function WelcomeScreen({ onComplete }: WelcomeScreenProps) {
  const [phase, setPhase] = useState<"fadein" | "hold" | "fadeout">("fadein");

  useEffect(() => {
    // Fade in: 1.5s
    const fadeInTimer = setTimeout(() => {
      setPhase("hold");
    }, 1500);

    // Hold: 1s
    const holdTimer = setTimeout(() => {
      setPhase("fadeout");
    }, 2500);

    // Fade out: 1.5s, then complete
    const fadeOutTimer = setTimeout(() => {
      onComplete();
    }, 4000);

    return () => {
      clearTimeout(fadeInTimer);
      clearTimeout(holdTimer);
      clearTimeout(fadeOutTimer);
    };
  }, [onComplete]);

  return (
    <motion.div
      initial={{ opacity: 1 }}
      animate={{ 
        opacity: phase === "fadein" ? 1 : phase === "hold" ? 1 : 0 
      }}
      transition={{ 
        duration: phase === "fadein" ? 1.5 : phase === "fadeout" ? 1.5 : 0,
        ease: "easeInOut"
      }}
      className="fixed inset-0 bg-black z-50 flex items-center justify-center"
    >
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ 
          opacity: phase === "fadein" ? 1 : phase === "hold" ? 1 : 0 
        }}
        transition={{ 
          duration: phase === "fadein" ? 1.5 : phase === "fadeout" ? 1.5 : 0,
          ease: "easeInOut"
        }}
        className="text-center relative"
      >
        {/* Main text with stroke only */}
        <motion.h1 
          className="text-[12rem] font-bold font-mono select-none"
          style={{
            color: "transparent",
            WebkitTextStroke: "3px #22d3ee",
            textStroke: "3px #22d3ee",
          }}
        >
          Bem Vindo!
        </motion.h1>

        {/* Animated glow effect on text stroke */}
        <motion.div
          className="absolute inset-0 flex items-center justify-center pointer-events-none"
          animate={{
            filter: [
              "drop-shadow(0 0 10px rgba(34,211,238,0.3))",
              "drop-shadow(0 0 30px rgba(34,211,238,0.8))",
              "drop-shadow(0 0 10px rgba(34,211,238,0.3))",
            ],
          }}
          transition={{
            duration: 2,
            repeat: Infinity,
            ease: "easeInOut"
          }}
        >
          <h1 
            className="text-[12rem] font-bold font-mono select-none"
            style={{
              color: "transparent",
              WebkitTextStroke: "3px #22d3ee",
              textStroke: "3px #22d3ee",
            }}
          >
            Bem Vindo!
          </h1>
        </motion.div>
      </motion.div>
    </motion.div>
  );
}
