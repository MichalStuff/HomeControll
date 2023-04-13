import React, { useContext, useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { toast } from "react-toastify";
import styled from "styled-components";
import { AppContext } from "../context/AppContext";
import { Button } from "./Button";
import { Input } from "./Input";
import { mobile } from "../Mixins";

const StyledJoinRoom = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  min-width: 80%;
  padding: 20px;
  background-color: var(--white-dark);
  box-shadow: 11px 11px 13px -6px rgba(103, 103, 103, 1);
  border-radius: 20px;
  ${mobile`
    width : 90%;
  `}
`;

const StyledForm = styled.form`
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
`;

const StyledH1 = styled.h1`
  width: 80%;
  margin: 20px 0;
  text-align: center;
  color: var(--secondary);
  font-weight: var(--txt-700);
  font-size: 38px;
`;

const JoinRoom = () => {
  const [userRoom, setUserRoom] = useState({ nr: "", password: "" });
  const { Rooms, handleAcces } = useContext(AppContext);

  const navigator = useNavigate();

  const handleSubmit = (e) => {
    e.preventDefault();
    if (userRoom.nr !== "" && userRoom.password !== "") {
      let index = Rooms.findIndex((r) => r.nr === Number(userRoom.nr));
      if (index !== -1 && Rooms[index].password === userRoom.password) {
        handleAcces(Number(userRoom.nr));
        navigator(`/room/${userRoom.nr}`);
      } else if (index !== -1 && Rooms[index].password !== userRoom.password) {
        toast.error("Podano złe hasło!");
      } else if (index === -1) {
        toast.error("Podano zły nr pokoju!");
      }
    }
  };

  return (
    <StyledJoinRoom>
      <StyledH1>Wpisz dane podane w recepcji</StyledH1>
      <StyledForm
        onSubmit={(e) => {
          handleSubmit(e);
        }}
      >
        <Input
          label="Room"
          handler={(e) => {
            console.log(e.target.value);
            setUserRoom((prev) => ({ ...prev, nr: e.target.value }));
          }}
          type="number"
          value={userRoom.nr}
        ></Input>
        <Input
          label="Password"
          handler={(e) => {
            console.log(e.target.value);
            setUserRoom((prev) => ({ ...prev, password: e.target.value }));
          }}
          type="password"
          value={userRoom.password}
        ></Input>
        <Button handler={handleSubmit}>Zaloguj</Button>
      </StyledForm>
    </StyledJoinRoom>
  );
};

export default JoinRoom;
