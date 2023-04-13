import React, { useContext, useEffect, useState } from "react";
import styled from "styled-components";
import { SocketContext } from "../context/SocketContext";
import { mobile } from "../Mixins";
import { Panel } from "./Panel";
import { Slider } from "./Slider";
import { Window } from "@styled-icons/material-twotone/Window";

const StyledPanel = styled(Panel)``;

const StyledH1 = styled.h1`
  text-align: center;
  color: var(--secondary);
  ${mobile`
    font-size : 38px;
  `}
`;

const StyledWindowIcon = styled(Window)`
  flex-grow: 1;
  max-height: 150px;
  font-size: 10px;
  margin: 0;
  color: var(--blue-light);
  ${mobile`
  height : 20px;
`}
`;

export const Roller = ({ data, room }) => {
  const { socket } = useContext(SocketContext); // socket object to communicate with socket.server

  const [roller, setRoller] = useState(0);

  useEffect(() => {
    socket.on(`Roller${room}`, (msg) => {
      console.log(msg);
      setRoller((prev) => (prev = Number(msg.Roller)));
    });
    return () => {
      socket.off(`Roller${room}`);
    };
  }, []);

  const handleSlider = (e) => {
    socket.emit("setRollers", `${e.target.value}`); // sends position of valve to server
  };

  return (
    <StyledPanel>
      <StyledH1>Sterowanie Roletami</StyledH1>
      <StyledWindowIcon />
      <Slider
        handler={handleSlider}
        value={roller}
        min={0}
        max={100}
        step={1}
        // label={"Roleta"}
      />
    </StyledPanel>
  );
};
