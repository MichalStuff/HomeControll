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
    // let { data } = await axios.get("http://192.168.2.10:3000/api");
    // let { data } = await axios.get("http://192.168.1.10:3000/api");
    // let { data } = await axios.get("http://192.168.1.104:3000/api");
    let { data } = await axios.get("http://192.168.1.107:3000/api");
    // let { data } = await axios.get("http://172.20.160.1:3000/api");
    // console.log(data);
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
