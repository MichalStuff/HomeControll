import { createContext, useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import axios from "axios";

export const AppProvider = ({ children }) => {
  const [access, setAccess] = useState(
    localStorage.length != 0 ? Number(localStorage.getItem("access")) : 0
  );

  const [Rooms, setRooms] = useState();

  const params = useParams();

  const handleAcces = (nr) => {
    setAccess((prev) => (prev = nr));
    localStorage.setItem("access", nr);
  };

  const getAccess = () => {
    if (localStorage.length > 0) {
      const localAccess = Number(localStorage.getItem("access"));
      setAccess((prev) => (prev = localAccess));
    }
  };

  const getRooms = async () => {
    let { data } = await axios.get(
      `http://${import.meta.env.VITE_IP}:${import.meta.env.VITE_PORT}/api`
    );
    setRooms(data);
  };

  useEffect(() => {
    getRooms();
  }, []);

  useEffect(() => {
    // console.log("Render");
    getAccess();
  }, [params]);

  const value = { Rooms, access, handleAcces, getAccess, getRooms };

  return <AppContext.Provider value={value}>{children}</AppContext.Provider>;
};

export const AppContext = createContext();
