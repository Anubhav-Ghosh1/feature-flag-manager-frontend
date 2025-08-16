import React, {
  createContext,
  useContext,
  useState,
  useEffect,
  ReactNode,
} from "react";
import axios from "axios";
import Cookies from "js-cookie";
import { API_BASE_URL } from "../components/CommonUtils/api";

interface UserContextType {
  user: any;
  loading: boolean;
  setUser: (user: any) => void;
}

const UserContext = createContext<UserContextType | undefined>(undefined);

export const useUser = () => {
  const context = useContext(UserContext);
  if (!context) throw new Error("useUser must be used within a UserProvider");
  return context;
};

export const UserProvider = ({ children }: { children: ReactNode }) => {
  const [user, setUser] = useState<any>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const token = Cookies.get("accessToken");
    console.log("accessToken", token);
    axios
      .get(`${API_BASE_URL}/users/userInfo`, {
        headers: token ? { Authorization: `Bearer ${token}` } : {},
        withCredentials: true,
      })
      .then((res) => {
        setUser(res.data.data);
        setLoading(false);
      })
      .catch(() => setLoading(false));
  }, []);

  return (
    <UserContext.Provider value={{ user, loading, setUser }}>
      {children}
    </UserContext.Provider>
  );
};
