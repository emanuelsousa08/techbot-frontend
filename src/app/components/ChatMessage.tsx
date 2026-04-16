import { User, Terminal, Copy, Check } from "lucide-react";
import { motion } from "motion/react";
import { useState } from "react";

interface ChatMessageProps {
  role: "user" | "assistant";
  content: string;
  timestamp: Date;
  theme: "light" | "dark";
}

export function ChatMessage({
  role,
  content,
  timestamp,
  theme,
}: ChatMessageProps) {
  const isUser = role === "user";
  const isDark = theme === "dark";
  const [isCopied, setIsCopied] = useState(false);

  const bgColor = isUser
    ? "bg-transparent"
    : isDark
      ? "bg-cyan-950/20"
      : "bg-cyan-50";
  const borderColor = isDark ? "border-cyan-900/30" : "border-cyan-200";
  const userIconBg = isDark ? "bg-cyan-500" : "bg-cyan-600";
  const assistantIconBg = isDark ? "bg-green-500" : "bg-green-600";
  const textPrimary = isDark ? "text-cyan-400" : "text-cyan-700";
  const textSecondary = isDark ? "text-cyan-300" : "text-cyan-800";
  const textTime = isDark ? "text-cyan-700" : "text-cyan-500";
  const hoverBg = isDark ? "hover:bg-cyan-500/10" : "hover:bg-cyan-100/50";

  const handleCopy = async () => {
    try {
      await navigator.clipboard.writeText(content);
      setIsCopied(true);
      setTimeout(() => setIsCopied(false), 2000);
    } catch (err) {
      console.error("Erro ao copiar:", err);
    }
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.3 }}
      className={`flex gap-4 p-4 ${bgColor} border-b ${borderColor}`}
    >
      <div
        className={`w-8 h-8 rounded flex items-center justify-center flex-shrink-0 ${
          isUser ? userIconBg : assistantIconBg
        }`}
        style={{
          boxShadow: isUser
            ? "0 0 10px rgba(34,211,238,0.5)"
            : "0 0 10px rgba(34,197,94,0.5)",
        }}
      >
        {isUser ? (
          <User className={`w-5 h-5 ${isDark ? "text-black" : "text-white"}`} />
        ) : (
          <Terminal
            className={`w-5 h-5 ${isDark ? "text-black" : "text-white"}`}
          />
        )}
      </div>

      <div className="flex-1 space-y-2">
        <div className="flex items-center gap-3 justify-between">
          <div className="flex items-center gap-3">
            <span className={`font-mono ${textPrimary}`}>
              {isUser ? "USER@localhost" : "TECHBOT@system"}
            </span>
            <span className={`text-xs ${textTime} font-mono`}>
              [
              {timestamp.toLocaleTimeString("pt-BR", {
                hour: "2-digit",
                minute: "2-digit",
                second: "2-digit",
              })}
              ]
            </span>
          </div>
          {!isUser && (
            <motion.button
              onClick={handleCopy}
              whileHover={{ scale: 1.1 }}
              whileTap={{ scale: 0.95 }}
              className={`p-1 rounded transition-all ${hoverBg}`}
              title={isCopied ? "Copiado!" : "Copiar resposta"}
            >
              {isCopied ? (
                <Check
                  className={`w-4 h-4 ${isDark ? "text-green-400" : "text-green-600"}`}
                />
              ) : (
                <Copy className={`w-4 h-4 ${textPrimary}`} />
              )}
            </motion.button>
          )}
        </div>
        <p
          className={`${textSecondary} font-mono text-sm whitespace-pre-wrap leading-relaxed`}
        >
          {isUser ? "$ " : "> "}
          {content}
        </p>
      </div>
    </motion.div>
  );
}
