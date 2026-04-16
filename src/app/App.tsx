import { useState, useEffect } from "react";
import { Navbar } from "./components/Navbar";
import { Sidebar } from "./components/Sidebar";
import { ChatArea, Message } from "./components/ChatArea";
import { ChatInput } from "./components/ChatInput";
import { IcebreakerGrid } from "./components/IcebreakerGrid";
import { WelcomeScreen } from "./components/WelcomeScreen";
import { useUserSession } from "../hooks/useUserSession";
import {
  NotificationProvider,
  useNotifications,
} from "../hooks/useNotifications";
import { Toaster } from "./components/ui/sonner";
import { toast } from "sonner";
import { motion, AnimatePresence } from "motion/react";
import { API } from "../config/api";

interface Conversation {
  id: string;
  title: string;
  timestamp: Date;
  messages: Message[];
}

function AppContent() {
  const [theme, setTheme] = useState<"light" | "dark">("dark");
  const [conversations, setConversations] = useState<Conversation[]>([]);
  const [selectedConversationId, setSelectedConversationId] = useState<
    string | null
  >(null);
  const [token, setToken] = useState("");
  const [context, setContext] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [showWelcome, setShowWelcome] = useState(true);
  const [isTransitioning, setIsTransitioning] = useState(false);

  // Gerenciamento de sessão do usuário
  const { user, login, updateUser, logout } = useUserSession();

  // Observa se é a primeira visita do usuário e mantém o estado de sessão
  useEffect(() => {
    const hasVisited = localStorage.getItem("techbot_visited");
    if (hasVisited) {
      setShowWelcome(false);
    } else {
      localStorage.setItem("techbot_visited", "true");
    }

    const initializeSession = async () => {
      const savedToken = localStorage.getItem("techbot_token");
      if (!savedToken) {
        return;
      }

      setToken(savedToken);

      try {
        const response = await fetch(API.auth.me, {
          headers: {
            Authorization: `Bearer ${savedToken}`,
          },
        });

        if (!response.ok) {
          throw new Error("Sessão inválida");
        }

        const data = await response.json();
        login({
          id: data.id,
          name: data.name,
          email: data.email,
          avatar: data.avatar || data.name?.charAt(0).toUpperCase() || "U",
          joinDate: new Date(data.joinDate),
        });

        await loadConversations(savedToken);
      } catch (error) {
        console.warn("Não foi possível recuperar a sessão:", error);
        setToken("");
        localStorage.removeItem("techbot_token");
      }
    };

    initializeSession();
  }, []);

  // Mudança de tema
  useEffect(() => {
    if (theme === "dark") {
      document.documentElement.classList.add("dark");
      document.body.style.backgroundColor = "#000000";
    } else {
      document.documentElement.classList.remove("dark");
      document.body.style.backgroundColor = "#ffffff";
    }
  }, [theme]);

  const toggleTheme = () => {
    setIsTransitioning(true);
    setTimeout(() => {
      setTheme((prev) => (prev === "dark" ? "light" : "dark"));
      setTimeout(() => {
        setIsTransitioning(false);
      }, 600);
    }, 300);
  };

  const handleNewChat = async () => {
    const newConversation: Conversation = {
      id: Date.now().toString(),
      title: "Nova Conversa",
      timestamp: new Date(),
      messages: [],
    };
    setConversations((prev) => [newConversation, ...prev]);
    setSelectedConversationId(newConversation.id);

    if (token) {
      await saveConversation(newConversation);
    }
  };

  const handleSelectConversation = (id: string) => {
    setSelectedConversationId(id);
  };

  const handleDeleteConversation = async (id: string) => {
    setConversations((prev) => {
      const next = prev.filter((conv) => conv.id !== id);
      if (selectedConversationId === id) {
        setSelectedConversationId(next[0]?.id ?? null);
      }
      return next;
    });

    if (!token) {
      return;
    }

    try {
      await fetch(API.chats.delete(id), {
        method: "DELETE",
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
    } catch (error) {
      console.warn("Erro ao excluir conversa:", error);
    }
  };

  const getCurrentConversation = () => {
    return conversations.find((c) => c.id === selectedConversationId);
  };

  const parseConversations = (items: any[]): Conversation[] => {
    return items.map((item) => ({
      ...item,
      timestamp: new Date(item.timestamp),
      messages: item.messages.map((message: any) => ({
        ...message,
        timestamp: new Date(message.timestamp),
      })),
    }));
  };

  const loadConversations = async (authToken?: string) => {
    const tokenToUse = authToken || token;
    if (!tokenToUse) return;

    try {
      const response = await fetch(API.chats.list, {
        headers: {
          Authorization: `Bearer ${tokenToUse}`,
        },
      });

      if (!response.ok) {
        throw new Error("Falha ao carregar histórico de chat");
      }

      const data = await response.json();
      const parsed = parseConversations(data);
      setConversations(parsed);
      if (!selectedConversationId && parsed.length > 0) {
        setSelectedConversationId(parsed[0].id);
      }
    } catch (error) {
      console.warn("Erro ao carregar conversas:", error);
    }
  };

  const saveConversation = async (conversation: Conversation) => {
    if (!token) return;

    try {
      await fetch(API.chats.create, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({
          conversation: {
            ...conversation,
            timestamp: conversation.timestamp.toISOString(),
            messages: conversation.messages.map((message) => ({
              ...message,
              timestamp: message.timestamp.toISOString(),
            })),
          },
        }),
      });
    } catch (error) {
      console.warn("Erro ao salvar conversa:", error);
    }
  };

  const handleLogin = async (
    username: string,
    password: string,
  ): Promise<boolean> => {
    try {
      const response = await fetch(API.auth.login, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          username,
          password,
        }),
      });

      if (!response.ok) {
        const errorData = await response.json().catch(() => ({}));
        toast.error("Erro no login", {
          description: errorData.error || "Verifique suas credenciais.",
        });
        return false;
      }

      const data = await response.json();

      if (!data.token) {
        throw new Error("Token não recebido do servidor");
      }

      setToken(data.token);
      localStorage.setItem("techbot_token", data.token);

      // Buscar dados do usuário via /auth/me
      try {
        const meResponse = await fetch(API.auth.me, {
          headers: {
            Authorization: `Bearer ${data.token}`,
          },
        });

        if (meResponse.ok) {
          const userData = await meResponse.json();
          login({
            id: userData.id,
            name: userData.name,
            email: userData.email,
            avatar:
              userData.avatar || userData.name?.charAt(0).toUpperCase() || "U",
            joinDate: new Date(userData.joinDate),
          });
        }
      } catch (error) {
        console.warn("Não foi possível obter dados do usuário:", error);
      }

      // Carregar conversas (não bloquear o sucesso do login se falhar)
      try {
        await loadConversations(data.token);
      } catch (convError) {
        console.warn("Não foi possível carregar conversas:", convError);
      }

      toast.success("Login realizado com sucesso!");
      return true;
    } catch (error) {
      console.error("Erro no login:", error);
      toast.error("Erro no login", {
        description:
          error instanceof Error
            ? error.message
            : "Ocorreu um erro inesperado. Tente novamente.",
      });
      setToken("");
      return false;
    }
  };

  const handleRegister = async (registrationData: {
    username: string;
    password: string;
    name: string;
    email: string;
  }): Promise<boolean> => {
    try {
      const response = await fetch(API.auth.register, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(registrationData),
      });

      if (!response.ok) {
        const errorData = await response.json().catch(() => ({}));
        if (response.status === 409) {
          toast.error("Usuário já existe", {
            description: "Tente outro nome de usuário.",
          });
        } else {
          toast.error("Erro no cadastro", {
            description: errorData.error || "Ocorreu um erro inesperado.",
          });
        }
        return false;
      }

      const data = await response.json();

      // Validar resposta do servidor
      if (!data.token) {
        throw new Error("Token não recebido do servidor");
      }

      if (!data.user || !data.user.id) {
        throw new Error("Dados de usuário inválidos do servidor");
      }

      // Salvar token
      setToken(data.token);
      localStorage.setItem("techbot_token", data.token);

      // Fazer login com dados retornados
      login({
        id: data.user.id,
        name: data.user.name || registrationData.name,
        email: data.user.email || registrationData.email,
        avatar:
          data.user.avatar ||
          registrationData.name.charAt(0).toUpperCase() ||
          "U",
        joinDate: data.user.joinDate
          ? new Date(data.user.joinDate)
          : new Date(),
      });

      // Carregar conversas (não bloquear se falhar)
      try {
        await loadConversations(data.token);
      } catch (convError) {
        console.warn("Não foi possível carregar conversas:", convError);
      }

      toast.success("Conta criada com sucesso!", {
        description: "Bem-vindo ao TechBot!",
      });
      return true;
    } catch (error) {
      console.error("Erro no cadastro:", error);
      toast.error("Erro no cadastro", {
        description:
          error instanceof Error
            ? error.message
            : "Ocorreu um erro inesperado. Tente novamente.",
      });
      setToken("");
      return false;
    }
  };

  const handleLogout = () => {
    logout();
    setToken("");
    setConversations([]);
    setSelectedConversationId(null);
    localStorage.removeItem("techbot_token");
  };

  const handleSendMessage = async (content: string) => {
    if (!token || token.length === 0) {
      const botMessage: Message = {
        id: Date.now().toString(),
        role: "assistant",
        content:
          "[ERRO] Usuário não autenticado. Faça login e tente novamente.",
        timestamp: new Date(),
      };

      let conversationId = selectedConversationId;
      if (!conversationId) {
        const newConversation: Conversation = {
          id: Date.now().toString(),
          title: content.slice(0, 30) + (content.length > 30 ? "..." : ""),
          timestamp: new Date(),
          messages: [],
        };
        setConversations((prev) => [newConversation, ...prev]);
        conversationId = newConversation.id;
        setSelectedConversationId(conversationId);
      }

      setConversations((prev) =>
        prev.map((conv) =>
          conv.id === conversationId
            ? {
                ...conv,
                messages: [...conv.messages, botMessage],
              }
            : conv,
        ),
      );

      return;
    }

    let conversationId = selectedConversationId;

    if (!conversationId) {
      const newConversation: Conversation = {
        id: Date.now().toString(),
        title: content.slice(0, 30) + (content.length > 30 ? "..." : ""),
        timestamp: new Date(),
        messages: [],
      };
      setConversations((prev) => [newConversation, ...prev]);
      conversationId = newConversation.id;
      setSelectedConversationId(conversationId);
    }

    const userMessage: Message = {
      id: Date.now().toString(),
      role: "user",
      content,
      timestamp: new Date(),
    };

    const currentConv = conversations.find((c) => c.id === conversationId);
    const updatedConversation: Conversation = {
      id: conversationId,
      title:
        currentConv?.messages.length === 0 || !currentConv
          ? content.slice(0, 30) + (content.length > 30 ? "..." : "")
          : currentConv.title,
      timestamp: currentConv?.timestamp || new Date(),
      messages: [...(currentConv?.messages || []), userMessage],
    };

    setConversations((prev) =>
      prev.map((conv) =>
        conv.id === conversationId ? updatedConversation : conv,
      ),
    );

    if (token) {
      await saveConversation(updatedConversation);
    }

    setIsLoading(true);

    try {
      const currentConv = conversations.find((c) => c.id === conversationId);
      const conversationHistory = currentConv?.messages || [];

      const messages = conversationHistory.map((msg) => ({
        role: msg.role === "user" ? "user" : "model",
        parts: [{ text: msg.content }],
      }));

      messages.push({
        role: "user",
        parts: [{ text: content }],
      });

      const systemInstruction = context
        ? `Você é um assistente de suporte técnico especializado em:

            * Windows e Linux
            * Redes e conectividade
            * Hardware e recomendação de peças
            * Solução de problemas técnicos
            * Programação básica e scripts simples
            * Criação de arquivos de texto e markdown

            Seu objetivo é ajudar o usuário de forma simples, prática e direta.

            Siga estas diretrizes:

            * Explique como se estivesse ajudando alguém iniciante
            * Use linguagem clara e evite termos técnicos difíceis (ou explique quando usar)
            * Sempre que possível, forneça passo a passo
            * Use exemplos práticos para facilitar o entendimento
            * Mantenha um tom amigável e encorajador

            Regras importantes:

            * Foque apenas nos temas técnicos listados acima
            * Se a pergunta fugir do escopo, responda educadamente e tente redirecionar para algo relacionado
            * Não peça nem armazene informações pessoais do usuário
            * Sempre oriente o usuário a seguir os passos com cuidado para evitar erros ou perda de dados

            Seu papel é fazer o usuário se sentir seguro e capaz de resolver o problema com sua ajuda.`
        : "Você é um assistente técnico especializado em suporte e troubleshooting.";

      const payload = {
        contents: messages,
        systemInstruction: {
          parts: [{ text: systemInstruction }],
        },
        generationConfig: {
          temperature: 0.5,
          maxOutputTokens: 5000,
        },
      };

      const response = await fetch(API.gemini, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({ payload }),
      });

      if (!response.ok) {
        const errorData = await response.json();
        const errorMsg =
          errorData.error?.message || `Erro da API: ${response.status}`;

        if (response.status === 400) {
          throw new Error(`Erro na requisição: ${errorMsg}`);
        } else if (response.status === 401 || response.status === 403) {
          throw new Error(
            `API Key inválida ou expirada. Detalhes: ${errorMsg}`,
          );
        } else if (response.status === 429 || errorMsg.includes("quota")) {
          throw new Error(
            `Quota de API excedida. Aguarde antes de tentar novamente.\n\nDetalhes: ${errorMsg}`,
          );
        }

        throw new Error(errorMsg);
      }

      const data = await response.json();
      const assistantMessage = data.candidates?.[0]?.content?.parts?.[0]?.text;

      if (!assistantMessage) {
        throw new Error("Resposta vazia da API");
      }

      const botMessage: Message = {
        id: (Date.now() + 1).toString(),
        role: "assistant",
        content: assistantMessage,
        timestamp: new Date(),
      };

      const conversationWithResponse: Conversation = {
        ...updatedConversation,
        messages: [...updatedConversation.messages, botMessage],
      };

      setConversations((prev) =>
        prev.map((conv) =>
          conv.id === conversationId ? conversationWithResponse : conv,
        ),
      );

      if (token) {
        await saveConversation(conversationWithResponse);
      }
    } catch (error) {
      const errorMessage =
        error instanceof Error ? error.message : "Erro desconhecido";

      const botMessage: Message = {
        id: (Date.now() + 1).toString(),
        role: "assistant",
        content: `[ERRO] ${errorMessage}\n\nVerifique se a API Key está configurada corretamente no servidor (.env).`,
        timestamp: new Date(),
      };

      const conversationWithError: Conversation = {
        ...updatedConversation,
        messages: [...updatedConversation.messages, botMessage],
      };

      setConversations((prev) =>
        prev.map((conv) =>
          conv.id === conversationId ? conversationWithError : conv,
        ),
      );

      if (token) {
        await saveConversation(conversationWithError);
      }
    } finally {
      setIsLoading(false);
    }
  };

  const currentConversation = getCurrentConversation();

  if (showWelcome) {
    return <WelcomeScreen onComplete={() => setShowWelcome(false)} />;
  }

  return (
    <div
      className={`h-screen flex flex-col ${theme === "dark" ? "bg-black" : "bg-white"} relative`}
    >
      <AnimatePresence>
        {isTransitioning && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 0.2 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.3 }}
            className={`absolute inset-0 z-50 pointer-events-none ${
              theme === "dark" ? "bg-white" : "bg-black"
            }`}
          />
        )}
      </AnimatePresence>

      <Navbar theme={theme} onThemeToggle={toggleTheme} />

      <div className="flex-1 flex overflow-hidden">
        <Sidebar
          conversations={conversations}
          onNewChat={handleNewChat}
          onSelectConversation={handleSelectConversation}
          onDeleteConversation={handleDeleteConversation}
          selectedConversationId={selectedConversationId}
          onLogin={handleLogin}
          onRegister={handleRegister}
          theme={theme}
          user={user}
          isLoggedIn={Boolean(user)}
          onUpdateUser={updateUser}
          onLogout={handleLogout}
        />

        <main className="flex-1 flex flex-col overflow-hidden relative">
          <ChatArea
            messages={currentConversation?.messages || []}
            isLoading={isLoading}
            theme={theme}
          />
          <div className="flex flex-col gap-3 pb-4">
            {(!currentConversation ||
              currentConversation.messages.length === 0) && (
              <IcebreakerGrid
                onSelect={handleSendMessage}
                theme={theme}
                disabled={isLoading}
              />
            )}
            <ChatInput
              onSendMessage={handleSendMessage}
              disabled={isLoading}
              theme={theme}
              showBorder={
                !(
                  currentConversation &&
                  currentConversation.messages.length === 0
                )
              }
            />
          </div>
        </main>
      </div>
    </div>
  );
}

export default function App() {
  return (
    <NotificationProvider>
      <AppContent />
      <Toaster position="top-right" richColors />
    </NotificationProvider>
  );
}
