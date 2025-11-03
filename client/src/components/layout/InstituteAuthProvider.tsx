import React, { createContext, useContext, useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";

interface InstituteContextType {
  user: any | null;  
  loading: boolean;  
  logout: () => void;
}

const InstituteContext = createContext<InstituteContextType | null>(null);


export const useInstituteAuth = () => {
  const context = useContext(InstituteContext);
  if (!context) {
    throw new Error("useInstituteAuth must be used within an InstituteAuthProvider");
  }
  return context;
};

// Provider component
export const InstituteAuthProvider = ({
  children,
}: {
  children: React.ReactNode;
}) => {
  const [user, setUser] = useState<any | null>(null);  
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();  

  // Function to fetch user data
  const fetchUserFromAPI = async () => {
    const serverUrl = import.meta.env.VITE_SERVER_URL; 
    try {
      const response = await fetch(`${serverUrl}/api/institute/auth/getUser`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        credentials: "include", 
      });

      if (!response.ok) {
        throw new Error("Failed to fetch user data");
      }

      const data = await response.json();

      if (data.user) {
        setUser(data.user); 
      } else {
        throw new Error("User not found");
      }
    } catch (error) {
      console.error("Error fetching user from API:", error);
      setUser(null);  
    } finally {
      setLoading(false);  
    }
  };


  useEffect(() => {
    fetchUserFromAPI();
  }, []);

  
  useEffect(() => {
    if (!loading && user === null) {
      navigate("/login");  
    }
  }, [loading, user, navigate]);


  const logout = () => {
    setUser(null);  
   
  };

  return (
    <InstituteContext.Provider value={{ user, loading, logout }}>
      {children}
    </InstituteContext.Provider>
  );
};
