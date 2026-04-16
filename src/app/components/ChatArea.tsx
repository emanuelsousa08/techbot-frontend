import { useEffect, useRef } from "react";
import { ChatMessage } from "./ChatMessage";
import { motion } from "motion/react";

export interface Message {
  id: string;
  role: "user" | "assistant";
  content: string;
  timestamp: Date;
}

interface ChatAreaProps {
  messages: Message[];
  isLoading?: boolean;
  theme: "light" | "dark";
}

export function ChatArea({ messages, isLoading, theme }: ChatAreaProps) {
  const messagesEndRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  const isDark = theme === "dark";
  const bgColor = isDark ? "bg-black" : "bg-white";
  const textPrimary = isDark ? "text-cyan-400" : "text-cyan-700";
  const textSecondary = isDark ? "text-cyan-600" : "text-cyan-500";
  const iconBg = isDark ? "bg-cyan-500/10" : "bg-cyan-100";
  const borderColor = isDark ? "border-cyan-500/30" : "border-cyan-300";
  const loadingBg = isDark ? "bg-cyan-950/20" : "bg-cyan-50";
  const loadingBorder = isDark ? "border-cyan-900/30" : "border-cyan-200";
  const loadingIconBg = isDark ? "bg-green-500" : "bg-green-600";
  const loadingText = isDark ? "text-cyan-500" : "text-cyan-600";

  return (
    <div className={`flex-1 overflow-y-auto pb-28 ${bgColor}`}>
      {messages.length === 0 ? (
        <div className="h-full flex flex-col items-center justify-center p-8">
          <motion.div
            initial={{ opacity: 0, scale: 0.8 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.3 }}
            className="text-center"
          >
            <div
              className={`w-24 h-24 mx-auto mb-6 ${iconBg} rounded-lg flex items-center justify-center border ${borderColor}`}
              style={{
                boxShadow: "0 0 30px rgba(34,211,238,0.3)",
              }}
            >
              <svg
                className={`w-12 h-12 ${textPrimary}`}
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={1.5}
                  d="M8 9l3 3-3 3m5 0h3M5 20h14a2 2 0 002-2V6a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z"
                />
              </svg>
            </div>
            <motion.h2
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.2, duration: 0.3 }}
              className={`text-3xl font-bold ${textPrimary} mb-3 font-mono`}
            >
              TechBot Terminal v1.0
            </motion.h2>
            <motion.p
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.2, duration: 0.3 }}
              className={`${textSecondary} max-w-md font-mono text-sm`}
            >
              <span>Sistema de suporte técnico inicializado.</span><br />
              Este chatbot foi projetado para fornecer assistência técnica básica,
              responder a perguntas comuns e ajudar a resolver problemas relacionados
              a tecnologia. Sinta-se à vontade para fazer perguntas ou solicitar ajuda!
            </motion.p>
          </motion.div>
        </div>
      ) : (
        <div className="max-w-4xl mx-auto">
          {messages.map((message) => (
            <ChatMessage
              key={message.id}
              role={message.role}
              content={message.content}
              timestamp={message.timestamp}
              theme={theme}
            />
          ))}
          {isLoading && (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              className={`flex gap-4 p-4 ${loadingBg} border-b ${loadingBorder}`}
            >
              <div
                className={`w-8 h-8 rounded flex items-center justify-center flex-shrink-0 ${loadingIconBg}`}
                style={{
                  boxShadow: "0 0 10px rgba(34,197,94,0.5)",
                }}
              >
                <motion.div
                  animate={{ rotate: 360 }}
                  transition={{ duration: 2, repeat: Infinity, ease: "linear" }}
                >
                  <svg
                    className={`w-5 h-5 ${isDark ? "text-black" : "text-white"}`}
                    fill="none"
                    viewBox="0 0 24 24"
                  >
                    <path
                      stroke="currentColor"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                    />
                  </svg>
                </motion.div>
              </div>
              <div className="flex-1">
                <span className={`font-mono ${textPrimary}`}>
                  TechBot@system
                </span>
                <div className="mt-2 flex items-center gap-2">
                  <motion.span
                    animate={{ opacity: [1, 0.3, 1] }}
                    transition={{ duration: 1.5, repeat: Infinity }}
                    className={`${loadingText} font-mono text-sm`}
                  >
                    &gt; Processando
                  </motion.span>
                  <motion.span
                    animate={{ opacity: [0, 1, 0] }}
                    transition={{ duration: 1.5, repeat: Infinity, delay: 0.2 }}
                    className={`${loadingText} font-mono`}
                  >
                    .
                  </motion.span>
                  <motion.span
                    animate={{ opacity: [0, 1, 0] }}
                    transition={{ duration: 1.5, repeat: Infinity, delay: 0.4 }}
                    className={`${loadingText} font-mono`}
                  >
                    .
                  </motion.span>
                  <motion.span
                    animate={{ opacity: [0, 1, 0] }}
                    transition={{ duration: 1.5, repeat: Infinity, delay: 0.6 }}
                    className={`${loadingText} font-mono`}
                  >
                    .
                  </motion.span>
                </div>
              </div>
            </motion.div>
          )}
          <div ref={messagesEndRef} />
        </div>
      )}
    </div>
  );
}
