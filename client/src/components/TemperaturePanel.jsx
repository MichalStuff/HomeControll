import React, { useContext, useEffect, useState } from "react";
import styled from "styled-components";
import { Panel } from "./Panel";
import { Temperature } from "@styled-icons/fluentui-system-regular/Temperature";
import { Droplet } from "@styled-icons/fa-solid/Droplet";
import { SocketContext } from "../context/SocketContext";
import { mobile } from "../Mixins";

//CSS Stlyes

const StyledH1 = styled.h1`
  display: block;
  font-size: 45px;
  font-weight: var(--txt-700);
  text-align: center;
  color: var(--secondary);
  ${mobile`
    font-size : 38px;
  `}
`;

const StyledContainer = styled.div`
  display: flex;
  flex-direction: row;
  align-items: center;
  justify-content: center;
  width: 80%;
`;

const StyledValue = styled.p`
  display: block;
  flex-grow: 1;
  font-weight: var(--txt-600);
  font-size: 38px;
  color: var(--secondary);
  ${mobile`
  font-size : 34px;
`}
`;

const StyledTemperatureIcon = styled(Temperature)`
  flex-grow: 1;
  height: 58px;
  color: var(--red);
  ${mobile`
  height : 48px;
`}
`;
const StyledHmumidityIcon = styled(Droplet)`
  flex-grow: 1;
  height: 44px;
  color: var(--blue-light);
  ${mobile`
  height : 38px;
`}
`;

// Custeom React Component to Display temperature and humidity

export const TemperaturePanel = ({ data, room }) => {
  const { socket } = useContext(SocketContext); // socket object to communicate with socket.server
  const [temperatureData, setTemperatureData] = useState({
    // temperatureData is object state that contains temperature [String] (iside Room) and humidity [String] (inside Room)
    temperature: "",
    humidity: "",
  });

  //Function to get data from thermometer device (work like "request")

  const getTemperature = () => {
    const id = data.id; //id of device
    socket.emit("getTempAndHum", id); // Send "request" to device by server
  };

  useEffect(() => {
    // Function that call getTemperature function every 3000 milisecins (3 second )(! Attention due to specification of dht22 module used in this project minimal value of Interval is 2000ms )
    const IntervalID = setInterval(() => {
      getTemperature();
    }, 3000);
    socket.on(`Temperature${room}`, (data) => {
      // Get data from device (temperature and humidity)
      setTemperatureData((prev) => ({
        // Set new data form device to state (temperature and humidity)
        ...prev,
        temperature: data.temperature,
        humidity: data.humidity,
      }));
    });
    console.log(`Temperature${room}`);
    // When component not needed
    return () => {
      socket.off(`Temperature${room}`); // Clear socket Event to prevent multiple calls to the server and device
      clearInterval(IntervalID); // Clear interval of setIntervalFunction
    };
  }, [data]); //!!!!! PRZETESTOWAĆ CZY DZIAŁA LEPIEJ Z data CZY BEZ (Naprawa błędu z brakiem aktualizacji termometru)

  return (
    <Panel>
      <StyledH1>Temperatura w Pomieszczeniu</StyledH1>
      <StyledContainer>
        <StyledTemperatureIcon />
        <StyledValue>{temperatureData.temperature}°C</StyledValue>{" "}
        {/* Display Temperature value */}
      </StyledContainer>
      <StyledH1>Wilgotność powietrza</StyledH1>
      <StyledContainer>
        <StyledHmumidityIcon />
        <StyledValue>{temperatureData.humidity}%</StyledValue>{" "}
        {/* Display Humidity value */}
      </StyledContainer>
    </Panel>
  );
};
