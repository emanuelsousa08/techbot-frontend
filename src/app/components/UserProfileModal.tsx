import { useMemo, useState } from "react";
import { X } from "lucide-react";
import { motion } from "motion/react";
import { User } from "../../hooks/useUserSession";

interface UserProfileModalProps {
  user: User | null;
  isLoggedIn: boolean;
  theme: "light" | "dark";
  onClose: () => void;
  onLogin: (username: string, password: string) => Promise<boolean>;
  onRegister: (data: {
    username: string;
    password: string;
    name: string;
    email: string;
  }) => Promise<boolean>;
  onLogout: () => void;
}

export function UserProfileModal({
  user,
  isLoggedIn,
  theme,
  onClose,
  onLogin,
  onRegister,
  onLogout,
}: UserProfileModalProps) {
  const [activeTab, setActiveTab] = useState<"login" | "register">("login");
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [error, setError] = useState<string | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const isDark = theme === "dark";
  const bgColor = isDark ? "bg-black" : "bg-white";
  const borderColor = isDark ? "border-cyan-500/30" : "border-cyan-600/30";
  const textColor = isDark ? "text-cyan-300" : "text-cyan-800";
  const inputBorder = isDark ? "border-cyan-500/50" : "border-cyan-600/50";
  const textTertiary = isDark ? "text-cyan-700" : "text-cyan-400";

  const handleSubmit = async () => {
    setError(null);
    setIsSubmitting(true);

    try {
      if (activeTab === "login") {
        if (!username || !password) {
          throw new Error("Informe usuário e senha.");
        }

        const success = await onLogin(username.trim(), password);
        if (success) {
          setUsername("");
          setPassword("");
          setName("");
          setEmail("");
          onClose();
        } else {
          // Login failed - error toast already shown by handleLogin
          setError("Falha na autenticação. Verifique suas credenciais.");
        }
      } else {
        if (!username || !password || !name || !email) {
          throw new Error("Preencha todos os campos de cadastro.");
        }

        const success = await onRegister({
          username: username.trim(),
          password,
          name: name.trim(),
          email: email.trim(),
        });
        if (success) {
          setUsername("");
          setPassword("");
          setName("");
          setEmail("");
          onClose();
        } else {
          // Registration failed - error toast already shown by handleRegister
          setError("Falha no cadastro. Verifique os dados e tente novamente.");
        }
      }
    } catch (err) {
      setError(err instanceof Error ? err.message : "Erro inesperado.");
    } finally {
      setIsSubmitting(false);
    }
  };

  const activeTabClasses = useMemo(
    () => ({
      active: "border-b-2 border-cyan-500 text-cyan-400",
      inactive: "text-cyan-500/70 hover:text-cyan-300",
    }),
    [],
  );

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-50"
      onClick={onClose}
    >
      <motion.div
        initial={{ scale: 0.95, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        exit={{ scale: 0.95, opacity: 0 }}
        onClick={(e) => e.stopPropagation()}
        className={`${bgColor} border ${borderColor} rounded-3xl p-6 max-w-lg w-full mx-4 shadow-xl`}
      >
        <div className="flex items-center justify-between mb-5">
          <div>
            <h2 className={`${textColor} font-mono text-xl font-semibold`}>
              {isLoggedIn ? "Minha conta" : "Acesse sua conta TechBot"}
            </h2>
            {!isLoggedIn ? (
              <p className={`${textTertiary} font-mono text-sm mt-1`}>
                Faça login ou crie sua conta para salvar histórico de chat.
              </p>
            ) : (
              <p className={`${textTertiary} font-mono text-sm mt-1`}>
                Você está logado como {user?.name}.
              </p>
            )}
          </div>
          <button
            onClick={onClose}
            className="p-2 rounded-full hover:bg-cyan-500/10 transition-colors"
          >
            <X className={`w-5 h-5 ${textColor}`} />
          </button>
        </div>

        {isLoggedIn ? (
          <div className="space-y-4">
            <div className={`rounded-3xl border ${borderColor} p-4`}>
              <p className={`${textColor} font-mono text-sm`}>Nome</p>
              <p className={`${textTertiary} font-mono text-base`}>
                {user?.name}
              </p>
            </div>
            <div className={`rounded-3xl border ${borderColor} p-4`}>
              <p className={`${textColor} font-mono text-sm`}>Email</p>
              <p className={`${textTertiary} font-mono text-base`}>
                {user?.email}
              </p>
            </div>
            <button
              onClick={onLogout}
              className="w-full px-4 py-3 rounded-2xl bg-rose-500 text-white font-mono transition hover:bg-rose-400"
            >
              Sair
            </button>
          </div>
        ) : (
          <div>
            <div className="mb-5 flex gap-2 rounded-full bg-cyan-500/10 p-1">
              <button
                type="button"
                onClick={() => setActiveTab("login")}
                className={`flex-1 rounded-full px-4 py-2 text-sm font-mono transition ${
                  activeTab === "login"
                    ? activeTabClasses.active
                    : activeTabClasses.inactive
                }`}
              >
                Entrar
              </button>
              <button
                type="button"
                onClick={() => setActiveTab("register")}
                className={`flex-1 rounded-full px-4 py-2 text-sm font-mono transition ${
                  activeTab === "register"
                    ? activeTabClasses.active
                    : activeTabClasses.inactive
                }`}
              >
                Cadastro
              </button>
            </div>

            <div className="space-y-4">
              <div>
                <label className={`block ${textColor} font-mono text-sm mb-2`}>
                  Usuário
                </label>
                <input
                  type="text"
                  value={username}
                  onChange={(e) => setUsername(e.target.value)}
                  placeholder="Seu usuário"
                  className={`w-full px-4 py-3 border ${inputBorder} rounded-xl ${textColor} bg-black placeholder-${textTertiary} focus:outline-none focus:border-cyan-400 transition-all`}
                />
              </div>

              <div>
                <label className={`block ${textColor} font-mono text-sm mb-2`}>
                  Senha
                </label>
                <input
                  type="password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="******"
                  className={`w-full px-4 py-3 border ${inputBorder} rounded-xl ${textColor} bg-black placeholder-${textTertiary} focus:outline-none focus:border-cyan-400 transition-all`}
                />
              </div>

              {activeTab === "register" && (
                <>
                  <div>
                    <label
                      className={`block ${textColor} font-mono text-sm mb-2`}
                    >
                      Nome
                    </label>
                    <input
                      type="text"
                      value={name}
                      onChange={(e) => setName(e.target.value)}
                      placeholder="Seu nome"
                      className={`w-full px-4 py-3 border ${inputBorder} rounded-xl ${textColor} bg-black placeholder-${textTertiary} focus:outline-none focus:border-cyan-400 transition-all`}
                    />
                  </div>
                  <div>
                    <label
                      className={`block ${textColor} font-mono text-sm mb-2`}
                    >
                      Email
                    </label>
                    <input
                      type="email"
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      placeholder="seu@email.com"
                      className={`w-full px-4 py-3 border ${inputBorder} rounded-xl ${textColor} bg-black placeholder-${textTertiary} focus:outline-none focus:border-cyan-400 transition-all`}
                    />
                  </div>
                </>
              )}

              {error && (
                <p className="text-rose-400 text-sm font-mono">{error}</p>
              )}

              <button
                type="button"
                onClick={handleSubmit}
                disabled={isSubmitting}
                className="w-full px-4 py-3 rounded-2xl bg-cyan-500 text-black font-mono transition hover:bg-cyan-400 disabled:opacity-60 disabled:cursor-not-allowed"
              >
                {activeTab === "login" ? "Entrar" : "Cadastrar"}
              </button>
            </div>
          </div>
        )}
      </motion.div>
    </motion.div>
  );
}
