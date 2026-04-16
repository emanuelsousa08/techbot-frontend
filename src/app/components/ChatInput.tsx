import { Send } from "lucide-react";
import { useState, FormEvent } from "react";
import { motion } from "motion/react";

interface ChatInputProps {
  onSendMessage: (message: string) => void;
  disabled?: boolean;
  theme: "light" | "dark";
  showBorder?: boolean;
}

export function ChatInput({
  onSendMessage,
  disabled,
  theme,
  showBorder = true,
}: ChatInputProps) {
  const [message, setMessage] = useState("");
  const [isFocused, setIsFocused] = useState(false);

  const handleSubmit = (e: FormEvent) => {
    e.preventDefault();
    if (message.trim() && !disabled) {
      onSendMessage(message.trim());
      setMessage("");
    }
  };

  const isDark = theme === "dark";
  const bgColor = isDark ? "bg-black" : "bg-white";
  const borderColor = isDark ? "border-cyan-500/30" : "border-cyan-600/30";
  const textColor = isDark ? "text-cyan-300" : "text-cyan-800";
  const inputBorder = isDark ? "border-cyan-500/50" : "border-cyan-600/50";
  const placeholderColor = isDark
    ? "placeholder-cyan-700"
    : "placeholder-cyan-400";

  return (
    <form
      onSubmit={handleSubmit}
      className={`${showBorder ? `border-t ${borderColor}` : ""} ${bgColor} p-4 relative rounded-xl shadow-xl w-[70%] mx-auto mb-4`}
    >
      <div className="flex gap-3">
        <div className="flex-1 relative">
          <input
            type="text"
            value={message}
            onChange={(e) => setMessage(e.target.value)}
            onFocus={() => setIsFocused(true)}
            onBlur={() => setIsFocused(false)}
            placeholder="> Digite sua mensagem..."
            disabled={disabled}
            className={`w-full px-4 py-3 ${bgColor} border ${inputBorder} rounded ${textColor} font-mono ${placeholderColor} focus:outline-none focus:border-cyan-400 transition-all disabled:opacity-50 disabled:cursor-not-allowed`}
            style={{
              boxShadow: isFocused
                ? "0 0 20px rgba(34,211,238,0.4), inset 0 0 20px rgba(34,211,238,0.1)"
                : "0 0 10px rgba(34,211,238,0.2)",
            }}
          />
          {isFocused && (
            <motion.div
              layoutId="input-glow"
              className="absolute inset-0 border-2 border-cyan-400 rounded pointer-events-none"
              initial={{ opacity: 0 }}
              animate={{ opacity: [0.5, 1, 0.5] }}
              transition={{ duration: 2, repeat: Infinity }}
            />
          )}
        </div>

        <motion.button
          type="submit"
          disabled={!message.trim() || disabled}
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
          className={`relative px-6 py-3 ${isDark ? "bg-cyan-500 hover:bg-cyan-400" : "bg-cyan-600 hover:bg-cyan-500"} disabled:bg-gray-700 disabled:cursor-not-allowed ${isDark ? "text-black" : "text-white"} font-mono rounded transition-all flex items-center gap-2 overflow-hidden group`}
          style={{
            boxShadow:
              message.trim() && !disabled
                ? "0 0 20px rgba(34,211,238,0.6)"
                : "none",
          }}
        >
          {/* Plano de fundo animado */}
          {message.trim() && !disabled && (
            <motion.div
              className={`absolute inset-0 ${isDark ? "bg-gradient-to-r from-cyan-400 via-cyan-300 to-cyan-400" : "bg-gradient-to-r from-cyan-500 via-cyan-400 to-cyan-500"}`}
              animate={{
                x: ["-100%", "100%"],
              }}
              transition={{
                duration: 2,
                repeat: Infinity,
                ease: "linear",
              }}
            />
          )}
          <Send className="w-5 h-5 relative z-10" />
        </motion.button>
      </div>
    </form>
  );
}
