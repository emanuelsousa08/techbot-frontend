import {
  MessageSquare,
  Settings,
  User,
  Menu,
  Search,
  X,
  Trash2,
  Github,
} from "lucide-react";
import { useState } from "react";
import { motion, AnimatePresence } from "motion/react";
import { UserProfileModal } from "./UserProfileModal";
import type { User as UserType } from "../../hooks/useUserSession";

interface Conversation {
  id: string;
  title: string;
  timestamp: Date;
}

interface SidebarProps {
  conversations: Conversation[];
  onNewChat: () => void;
  onSelectConversation: (id: string) => void;
  onDeleteConversation: (id: string) => void;
  selectedConversationId: string | null;
  onLogin: (username: string, password: string) => Promise<boolean>;
  onRegister: (data: {
    username: string;
    password: string;
    name: string;
    email: string;
  }) => Promise<boolean>;
  theme: "light" | "dark";
  user: UserType | null;
  isLoggedIn: boolean;
  onUpdateUser: (user: Partial<UserType>) => void;
  onLogout: () => void;
}

export function Sidebar({
  conversations,
  onNewChat,
  onSelectConversation,
  onDeleteConversation,
  selectedConversationId,
  onLogin,
  onRegister,
  theme,
  user,
  isLoggedIn,
  onUpdateUser,
  onLogout,
}: SidebarProps) {
  const [isCollapsed, setIsCollapsed] = useState(true);
  const [showSettings, setShowSettings] = useState(false);
  const [showProfileModal, setShowProfileModal] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");

  const filteredConversations = conversations.filter((conv) =>
    conv.title.toLowerCase().includes(searchQuery.toLowerCase()),
  );

  const toggleCollapse = () => {
    setIsCollapsed(!isCollapsed);
    if (showSettings) setShowSettings(false);
  };

  const handleSettingsClick = () => {
    if (isCollapsed) setIsCollapsed(false);
    setShowSettings(!showSettings);
  };

  const handleNewChat = () => {
    onNewChat();
    if (isCollapsed) setIsCollapsed(false);
  };

  const isDark = theme === "dark";
  const bgColor = isDark ? "bg-black" : "bg-white";
  const borderColor = isDark ? "border-cyan-500/30" : "border-cyan-600/30";
  const textPrimary = isDark ? "text-cyan-400" : "text-cyan-700";
  const textSecondary = isDark ? "text-cyan-600" : "text-cyan-500";
  const textTertiary = isDark ? "text-cyan-700" : "text-cyan-400";
  const hoverBg = isDark ? "hover:bg-cyan-500/10" : "hover:bg-cyan-100/50";
  const inputBg = isDark ? "bg-black" : "bg-white";
  const inputBorder = isDark ? "border-cyan-500/50" : "border-cyan-600/50";

  return (
    <motion.aside
      initial={false}
      animate={{ width: isCollapsed ? "4rem" : "21rem" }}
      transition={{ duration: 0.3, ease: "easeInOut" }}
      className={`relative h-full ${bgColor} border-r ${borderColor} flex flex-col overflow-hidden`}
    >
      <AnimatePresence mode="wait">
        {showSettings && !isCollapsed ? (
          <motion.div
            key="settings"
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: -20 }}
            transition={{ duration: 0.2 }}
            className="flex-1 flex flex-col p-4"
          >
            <div className="flex items-center justify-between mb-6">
              <h2 className={`${textPrimary} font-mono text-lg`}>
                Configurações
              </h2>
              <button
                onClick={() => setShowSettings(false)}
                className={`p-1 ${hoverBg} rounded transition-colors`}
              >
                <X className={`w-5 h-5 ${textPrimary}`} />
              </button>
            </div>

            <div className="space-y-6 flex-1 overflow-y-auto">
              <div className={`rounded-3xl border ${borderColor} p-4`}>
                <p className={`${textPrimary} font-mono text-sm mb-2`}>
                  Acesse sua conta clicando no ícone de avatar.
                </p>
                <p className={`${textSecondary} font-mono text-xs`}>
                  Login e cadastro agora estão disponíveis em um modal
                  centralizado.
                </p>
              </div>
            </div>

            <div className="space-y-2 flex-bottom overflow-y-auto flex items-center justify-center">
              <a
                href="https://github.com/emanuelsousa08/techbot-frontend.git"
                target="_blank"
                rel="noopener noreferrer"
                aria-label="Link para o repositório do projeto"
                className={`rounded-2xl border ${borderColor} p-4 flex items-center justify-center ${hoverBg} transition-all group`}
              >
                <Github
                  className={`w-6 h-6 ${textPrimary} group-hover:text-cyan-300 transition-colors`}
                />
              </a>
            </div>
            <div className="space-y-1 overflow-y-auto">
              <div className={`rounded-2xl p-1`}>
                <p className={`${textPrimary} font-mono text-sm mb-2 space-y-4`}>
                    Link para o repositório do projeto no GitHub
                </p>  
              </div>
            </div>
          </motion.div>
        ) : (
          <motion.div
            key="main"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.2 }}
            className="flex-1 flex flex-col"
          >
            {/* Header */}
            <div
              className={`p-4 border-b ${borderColor} flex items-center gap-2`}
            >
              {/* Botão do Menu - Apenas o ícone quando a sidebar estiver colapsada, oculto quando expandida */}
              {isCollapsed ? (
                <button
                  onClick={toggleCollapse}
                  className={`p-2 ${hoverBg} rounded transition-all`}
                >
                  <Menu className={`w-5 h-5 ${textPrimary}`} />
                </button>
              ) : (
                <button
                  onClick={toggleCollapse}
                  className={`p-2 border ${inputBorder} rounded transition-all ${hoverBg} group relative overflow-hidden`}
                  style={{
                    boxShadow: "0 0 10px rgba(34,211,238,0.2)",
                  }}
                  onMouseEnter={(e) => {
                    e.currentTarget.style.boxShadow =
                      "0 0 20px rgba(34,211,238,0.5)";
                  }}
                  onMouseLeave={(e) => {
                    e.currentTarget.style.boxShadow =
                      "0 0 10px rgba(34,211,238,0.2)";
                  }}
                >
                  <X className={`w-5 h-5 ${textPrimary} relative z-10`} />
                </button>
              )}

              {!isCollapsed && (
                <motion.button
                  initial={{ opacity: 0, scale: 0.8 }}
                  animate={{ opacity: 1, scale: 1 }}
                  onClick={handleNewChat}
                  className={`flex-1 flex items-center justify-center gap-2 px-4 py-2 ${textPrimary} font-mono border ${inputBorder} rounded transition-all group relative overflow-hidden`}
                  style={{
                    boxShadow: "0 0 10px rgba(34,211,238,0.2)",
                  }}
                  onMouseEnter={(e) => {
                    e.currentTarget.style.boxShadow =
                      "0 0 20px rgba(34,211,238,0.5)";
                  }}
                  onMouseLeave={(e) => {
                    e.currentTarget.style.boxShadow =
                      "0 0 10px rgba(34,211,238,0.2)";
                  }}
                >
                  <span className="text-2xl leading-none">+</span>
                  <span>Nova Conversa</span>
                </motion.button>
              )}
            </div>

            {/* Pesquisa */}
            {!isCollapsed && (
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                className={`p-4 border-b ${borderColor}`}
              >
                <div className="relative">
                  <Search
                    className={`absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 ${textSecondary}`}
                  />
                  <input
                    type="text"
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    placeholder="Buscar..."
                    className={`w-full pl-10 pr-3 py-2 ${inputBg} border ${inputBorder} rounded ${textPrimary} font-mono text-sm placeholder-${textTertiary} focus:outline-none focus:border-cyan-400 focus:shadow-[0_0_10px_rgba(34,211,238,0.3)] transition-all`}
                  />
                </div>
              </motion.div>
            )}

            {/* Conversations List */}
            <div className="flex-1 overflow-y-auto p-2">
              {!isCollapsed && (
                <motion.div
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  className="space-y-1"
                >
                  {filteredConversations.length === 0 ? (
                    <p
                      className={`${textTertiary} font-mono text-xs text-center py-8`}
                    >
                      {searchQuery ? "Nenhum resultado" : "Sem conversas"}
                    </p>
                  ) : (
                    filteredConversations.map((conversation) => (
                      <button
                        key={conversation.id}
                        onClick={() => onSelectConversation(conversation.id)}
                        className={`w-full flex items-center gap-2 px-3 py-2 rounded transition-all text-left font-mono text-sm ${
                          selectedConversationId === conversation.id
                            ? `${isDark ? "bg-cyan-500/20" : "bg-cyan-100"} border ${inputBorder} ${textPrimary}`
                            : `${textSecondary} ${hoverBg}`
                        }`}
                      >
                        <MessageSquare className="w-4 h-4 flex-shrink-0 mt-0.5" />
                        <div className="flex-1 min-w-0">
                          <p className="truncate">{conversation.title}</p>
                          <p
                            className={`text-xs ${isDark ? "text-cyan-800" : "text-cyan-400"}`}
                          >
                            {conversation.timestamp.toLocaleDateString("pt-BR")}
                          </p>
                        </div>
                        {!isCollapsed && (
                          <button
                            type="button"
                            onClick={(e) => {
                              e.stopPropagation();
                              onDeleteConversation(conversation.id);
                            }}
                            className={`p-2 rounded-lg transition-colors ${hoverBg} ${textSecondary}`}
                          >
                            <Trash2 className="w-4 h-4" />
                          </button>
                        )}
                      </button>
                    ))
                  )}
                </motion.div>
              )}
            </div>

            {/* Footer */}
            <div className={`border-t ${borderColor}`}>
              <button
                onClick={() => setShowProfileModal(true)}
                className={`w-full flex items-center gap-3 p-4 ${hoverBg} transition-colors ${
                  isCollapsed ? "justify-center" : ""
                }`}
              >
                <div
                  className={`w-8 h-8 rounded-full ${isDark ? "bg-cyan-500/20" : "bg-cyan-100"} border ${inputBorder} flex items-center justify-center flex-shrink-0`}
                >
                  <span
                    className={`${textPrimary} font-mono text-sm font-bold`}
                  >
                    {user?.name.charAt(0).toUpperCase() || "U"}
                  </span>
                </div>
                {!isCollapsed && (
                  <motion.div
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    className="flex-1 text-left"
                  >
                    <p className={`${textPrimary} font-mono text-sm`}>
                      {user?.name || "Usuário"}
                    </p>
                    <p className={`${textTertiary} font-mono text-xs`}>
                      Online
                    </p>
                  </motion.div>
                )}
              </button>

              <button
                onClick={handleSettingsClick}
                className={`w-full flex items-center gap-3 p-4 border-t ${borderColor} transition-all ${
                  isCollapsed ? "justify-center" : ""
                } ${showSettings ? (isDark ? "bg-cyan-500/20" : "bg-cyan-100") : hoverBg} group relative overflow-hidden`}
                style={{
                  boxShadow: showSettings
                    ? "inset 0 0 20px rgba(34,211,238,0.3)"
                    : "none",
                }}
              >
                <Settings
                  className={`w-5 h-5 ${textPrimary} ${
                    showSettings ? "animate-spin" : ""
                  } relative z-10`}
                />
                {!isCollapsed && (
                  <motion.span
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    className={`${textPrimary} font-mono text-sm relative z-10`}
                  >
                    Configurações
                  </motion.span>
                )}
              </button>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* User Profile Modal */}
      <AnimatePresence>
        {showProfileModal && (
          <UserProfileModal
            user={user}
            isLoggedIn={isLoggedIn}
            theme={theme}
            onClose={() => setShowProfileModal(false)}
            onLogin={onLogin}
            onRegister={onRegister}
            onLogout={() => {
              onLogout();
              setShowProfileModal(false);
            }}
          />
        )}
      </AnimatePresence>
    </motion.aside>
  );
}
