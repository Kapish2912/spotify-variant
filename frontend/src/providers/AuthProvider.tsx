import { useAuth } from "@clerk/clerk-react";
import { useEffect, useState } from "react";
import { useAuthStore } from "@/stores/useAuthStore";
import { axiosInstance } from "@/lib/axios";
import { Loader } from "lucide-react";
import { useChatStore } from "@/stores/useChatStore";

const updateApiToken = (token: string | null) => {
  if (token) {
    axiosInstance.defaults.headers.common["Authorization"] = `Bearer ${token}`;
    console.log("Token set:", token);  // Debugging line
  } else {
    delete axiosInstance.defaults.headers.common["Authorization"];
    console.log("Token removed");  // Debugging line
  }
};

const AuthProvider = ({ children }: { children: React.ReactNode }) => {
  const { getToken , userId } = useAuth();
  const [loading, setLoading] = useState(true);
  const { checkAdminStatus } = useAuthStore();
  const {initSocket,disconnectSocket} = useChatStore();

  useEffect(() => {
    const initAuth = async () => {
      try {
        const token = await getToken();
        if (token) {
          localStorage.setItem("token", token); // Store token in localStorage
          updateApiToken(token);
          await checkAdminStatus();
          // init socket
          if(userId) initSocket(userId);
        }
      } catch (error) {
        updateApiToken(null);
        console.log("Error in auth provider", error);
      } finally {
        setLoading(false);
      }
    };

    initAuth();
    // clean up

    return () => disconnectSocket();
  }, [getToken, userId , checkAdminStatus , initSocket , disconnectSocket]);

  if (loading) return (
    <div className="h-screen w-full flex items-center justify-center">
      <Loader className="size-8 text-emerald-500 animate-spin" />
    </div>
  );

  return <div>{children}</div>;
};

export default AuthProvider;
