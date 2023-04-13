import React, { useContext, useEffect, useState } from "react";
import styled, { createGlobalStyle } from "styled-components";
import { ToggleSwitch } from "./ToggleSwitch";
import { LightbulbFill } from "@styled-icons/bootstrap/LightbulbFill";
import { Panel } from "./Panel";
import { SocketContext } from "../context/SocketContext";
import { mobile } from "../Mixins";

const StyledH1 = styled.h1`
  text-align: center;
  color: var(--secondary);
  ${mobile`
    font-size : 38px;
  `}
`;

const StyledLightOff = styled(LightbulbFill)`
  color: var(--secondary);
  font-size: 20px;
  width: 150px;
`;

const StyledLightOn = styled(LightbulbFill)`
  color: #ffff09;
  font-size: 20px;
  width: 150px;
  }
`;

export const LightPanel = ({ data, room }) => {
  const [light, setLight] = useState(false); // state of light [boolean] (false : light "OFF", true : light "ON" )

  const { socket } = useContext(SocketContext); // socket object to communicate with socket.server

  //function to change State of light

  const handleLight = () => {
    const id = data.id;
    if (light === false) {
      const State = { id: id, status: "ON" }; // Set id of device [String] and status [String] ("ON" or "OFF") TURN ON
      socket.emit("getlightStatus", State); //Send data to Device by Server
    } else {
      const State = { id: id, status: "OFF" }; // Set id of device [String] and status [String] ("ON" or "OFF") TURN OFF
      socket.emit("getlightStatus", State); //Send data to Device by Server
    }
  };

  useEffect(() => {
    socket.on(`LightStatus${room}`, (data) => {
      // get data from device about light state
      if (data.light === "OFF") setLight((prev) => (prev = false)); // Light OFF
      if (data.light === "ON") setLight((prev) => (prev = true)); // Light ON
    });

    return () => {
      socket.off(`LightStatus${room}`); // Reset of socket event (Prevent of multiple calls to server)
    };
  }, []);

  return (
    <Panel>
      <StyledH1>Sterowanie Oświetleniem</StyledH1>
      {light === true ? <StyledLightOn /> : <StyledLightOff />}
      <ToggleSwitch state={light} type="checkbox" handler={handleLight} />{" "}
      {/* Switch to turn light on or of*/}
    </Panel>
  );
};
