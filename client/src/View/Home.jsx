import { useContext } from "react";
import JoinRoom from "../components/JoinRoom";
import Rooms from "../data/Rooms.json";

export const Home = () => {
  return (
    <div>
      <JoinRoom></JoinRoom>
    </div>
  );
};
