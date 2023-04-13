import React, { useContext, useEffect, useState } from "react";
import styled from "styled-components";
import { PlusSquare, MinusSquare } from "@styled-icons/evaicons-solid";
import { SocketContext } from "../context/SocketContext";
import { Panel } from "./Panel";
import { mobile } from "../Mixins";
import { ToggleSwitch } from "./ToggleSwitch";
import { Slider } from "./Slider";

//CSS Styles

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

const AutoWrapper = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: space-between;
`;

const AutoToggle = styled(ToggleSwitch)`
  margin-top: 30px;
  ${(props) => props.state && "transform: scale(0.5); margin-top : 0px;"}
`;

const StyledAutoTemperature = styled.div`
  display: flex;
  align-items: center;
  justify-content: space-around;
  width: 80%;
`;

//Icons

const StyledPlus = styled(PlusSquare)`
  display: block;
  margin: 0px;
  height: 60px;
  color: var(--secondary);
  &:hover {
    color: var(--primary);
    background-size: 20px 10px;
  }
`;
const StyledMinus = styled(MinusSquare)`
  display: block;
  margin: 0px;
  height: 60px;
  color: var(--secondary);
  &:hover {
    color: var(--primary);
    background-size: 20px 10px;
  }
`;

const StyledTemperature = styled.button`
  display: block;
  cursor : pointer;
  font-size: 45px;
  font-weight: var(--txt-700);
  text-align: center;
  color: var(--secondary);
  border: 5px solid var(--secondary);
  border-radius: 50%;
  background-color : var(--primary);
  color : var(--white);
  padding 20px;
  margin: 0;
  width : 100px;
  height : 100px;
  ${mobile`
  font-size : 38px;
`}
`;

export const Heater = ({ data, room }) => {
  const { socket } = useContext(SocketContext); // socket object to communicate with socket.server

  const [heaterTemperature, setHeaterTemperature] = useState(23); // State of HeaterTemperature [Number] with values (from 5 to 40)
  const [actualTemperature, setActualTemperature] = useState(); // State of ActualTemperature [Number]
  const [heaterRoom, setHeaterRoom] = useState(room); // Number of current Room [Number]
  const [manual, setManual] = useState({ state: false, position: 45 }); // State to esablish Manual or Automatic connection and contains data about valve position [String] : with value (from "90" - fully opened to "0" - fully closed) , and state [boolean] : with values (true - "Manual", false - "Automatic")

  // Function to set heaterTemperature
  // value [String] is step of heaterTemperature change

  const handleHeaterTemperature = (value) => {
    if (heaterTemperature > 5 && heaterTemperature < 40) {
      setHeaterTemperature((prev) => (prev += value));
    }
    if (heaterTemperature === 40 && value === -1) {
      setHeaterTemperature((prev) => (prev += value));
    }
    if (heaterTemperature === 5 && value === 1) {
      setHeaterTemperature((prev) => (prev += value));
    }
  };

  // function to set heaterTemperature and send to other devices connected

  const setData = () => {
    setManual((prev) => ({ ...prev, state: false }));
    let data = { room: room, heaterTemperature: heaterTemperature }; // data that will be emmited to other clients  :
    socket.emit("setAutoHeater", data);
  };

  // function responsible for slider, using onChange event sets heaterStat values and emits position of valve to server

  const handleSlider = (e) => {
    setManual((prev) => ({ ...prev, state: true, position: e.target.value })); /// sets state of manual to be Manual and sets its position
    socket.emit("setHeater", `${e.target.value}`); // sends position of valve to server
  };

  //After initial Render of component react to server event

  useEffect(() => {
    socket.on(`Temperature${room}`, (temp) => {
      // Gather current room temperature
      setActualTemperature(Number(temp.temperature)); // set State uf actualTemperature
    });
    return () => {
      socket.off(`Temperature${room}`);
    };
  }, []);

  //After Render or Change of (actualtemperature - "temperature inside room" OR heaterTemperature - "temperature set teperature of heater", manual.state - "Auto or Manual valve manipulation" )

  useEffect(() => {
    socket.on(`getAutoHeater${room}`, (data) => {
      setHeaterTemperature((prev) => (prev = data.heaterTemperature));
    });
    return () => {
      socket.off(`getAutoHeater${room}`);
    };
  }, []);

  useEffect(() => {
    data = {
      actualTemperature: actualTemperature,
      heaterTemperature: heaterTemperature,
      room: heaterRoom,
    };
    console.log(manual);
    if (manual.state === false) {
      let diff = Math.round((actualTemperature - heaterTemperature) * 10) / 10; // Diffrence between heaterTemperature and actualTemperature
      console.log(diff);
      if (diff < 0) {
        // if heaterTemperature is higher than actual temperature close valve

        if (diff > -2 && diff < -1) {
          // if closer to 0 than vale is closer to 45% (hafl open) to optimize heat
          socket.emit("setHeater", "70");
          setManual((prev) => ({ ...prev, position: "70" }));
        } else if ((diff) => -1 && diff < -0.5) {
          socket.emit("setHeater", "55");
          setManual((prev) => ({ ...prev, position: "55" }));
        } else if ((diff) => -0.5) {
          socket.emit("setHeater", "45");
          setManual((prev) => ({ ...prev, position: "45" }));
        } else {
          socket.emit("setHeater", "90");
          setManual((prev) => ({ ...prev, position: "90" }));
        }
      } else {
        // if heaterTemperature is lower than actual temperature open valve

        if (diff < 2 && diff > 1) {
          // if closer to 0 than vale is closer to 45% (hafl open) to optimize heat

          socket.emit("setHeater", "20");
          setManual((prev) => ({ ...prev, position: "20" }));
        } else if (diff <= 1 && diff > 0.5) {
          socket.emit("setHeater", "35");
          setManual((prev) => ({ ...prev, position: "35" }));
        } else if (diff <= 0.5) {
          socket.emit("setHeater", "45");
          setManual((prev) => ({ ...prev, position: "45" }));
        } else {
          socket.emit("setHeater", "0");
          setManual((prev) => ({ ...prev, position: "0" }));
        }
      }
    }
  }, [actualTemperature, heaterTemperature, manual.state]);

  return (
    <Panel>
      <StyledH1>Temperatura grzejnika</StyledH1>
      <StyledH1>Automatyczne Sterowanie</StyledH1>
      <StyledAutoTemperature>
        <StyledMinus
          onClick={() => {
            handleHeaterTemperature(-1);
          }}
        />
        <StyledTemperature
          onClick={() => {
            setData();
          }}
        >
          {heaterTemperature}
        </StyledTemperature>
        <StyledPlus
          onClick={() => {
            handleHeaterTemperature(1);
          }}
        />
      </StyledAutoTemperature>
      <Slider
        min={0} // Minimal value of slider
        max={90} // Maximum value of slider
        handler={handleSlider} // function to handle onChangeEvent
        value={manual.position} //postition meant
        label="Manualne sterowanie" // label for slider
      />
    </Panel>
  );
};
