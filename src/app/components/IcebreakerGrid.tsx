import { motion } from "motion/react";

interface IcebreakerGridProps {
  onSelect: (message: string) => void;
  theme: "light" | "dark";
  disabled?: boolean;
}

const ICEBREAKER_MESSAGES = [
  "Quais são as funcionalidades deste chatbot?",
  "Como posso configurar minha impressora?",
  "Meu computador está lento, quais melhorias posso fazer?",
  "Como posso trocar a memória RAM?",
  "Quais são as melhores práticas para segurança online?",
];

export function IcebreakerGrid({
  onSelect,
  theme,
  disabled = false,
}: IcebreakerGridProps) {
  const isDark = theme === "dark";
  const bgColor = isDark ? "bg-black" : "bg-white";
  const borderColor = isDark ? "border-cyan-500/30" : "border-cyan-600/30";
  const buttonBg = isDark ? "bg-cyan-500/10" : "bg-cyan-100/50";
  const buttonBorder = isDark ? "border-cyan-500/20" : "border-cyan-300/30";
  const buttonText = isDark ? "text-cyan-300" : "text-cyan-800";
  const buttonHover = isDark
    ? "hover:bg-cyan-500/20 hover:border-cyan-500/40"
    : "hover:bg-cyan-100 hover:border-cyan-400/50";

  const containerVariants = {
    hidden: { opacity: 0, y: 10 },
    visible: {
      opacity: 1,
      y: 0,
      transition: {
        staggerChildren: 0.05,
        delayChildren: 0.1,
      },
    },
  };

  const itemVariants = {
    hidden: { opacity: 0, scale: 0.95 },
    visible: { opacity: 1, scale: 1 },
  };

  return (
    <motion.div
      initial="hidden"
      animate="visible"
      exit="hidden"
      variants={containerVariants}
      className={`relative p-4 overflow-hidden w-[70%] mx-auto`}
    >
      {/* Gradientes laterais para efeito infinito */}
      <div
        className={`absolute left-0 top-0 bottom-0 w-48 bg-gradient-to-r ${isDark ? "from-black/100 via-black/60 to-transparent" : "from-white/100 via-white/60 to-transparent"} z-20 pointer-events-none`}
      />
      <div
        className={`absolute right-0 top-0 bottom-0 w-48 bg-gradient-to-l ${isDark ? "from-black/100 via-black/60 to-transparent" : "from-white/100 via-white/60 to-transparent"} z-20 pointer-events-none`}
      />

      <div className="px-8 overflow-x-auto pb-2 icebreaker-scroll">
        <div className="inline-flex gap-2 min-w-max py-1">
          {ICEBREAKER_MESSAGES.map((message, index) => (
            <motion.button
              key={index}
              variants={itemVariants}
              onClick={() => !disabled && onSelect(message)}
              disabled={disabled}
              className={`px-3 py-2 rounded-lg border ${buttonBg} ${buttonBorder} ${buttonText} font-mono text-xs text-left transition-all duration-200 ${buttonHover} disabled:opacity-50 disabled:cursor-not-allowed line-clamp-2 hover:shadow-lg hover:shadow-cyan-500/10`}
              style={{
                boxShadow: "0 0 8px rgba(34,211,238,0.1)",
              }}
              onMouseEnter={(e) => {
                if (!disabled) {
                  e.currentTarget.style.boxShadow =
                    "0 0 12px rgba(34,211,238,0.3)";
                }
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.boxShadow =
                  "0 0 8px rgba(34,211,238,0.1)";
              }}
            >
              {message}
            </motion.button>
          ))}
        </div>
      </div>
    </motion.div>
  );
}
