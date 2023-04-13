import React from "react";
import styled from "styled-components";
import { mobile } from "../Mixins";

//CSS Styles

const StyledToggleSwitch = styled.input`
  appearance: none;
  height: 100px;
  width: 180px;
  background-color: var(--secondary);
  border-radius: 50px;
  cursor: pointer;
  outline: none;
  transition: var(--fast);
  &::before {
    position: relative;
    top: 10%;
    left: 5%;
    display: block;
    content: "";
    height: 80px;
    width: 80px;
    border-radius: 50%;
    background-color: var(--white-dark);
    transition: var(--fast);
  }
  &::after {
    position: relative;
    color: var(--secondary);
    top: -45%;
    left: 10%;
    font-size: 30px;
    font-weight: var(--txt-700);
    transition: var(--fast);
    content: "OFF";
  }
  &:checked {
    background-color: var(--primary);
    &::before {
      top: 10%;
      left: 50%;
    }
    &::after {
      content: "ON";
      left: 60%;
    }
  }
  ${mobile`
    transform : scale(0.8);
  `}
`;

// Custom ToggleSwitch component

export const ToggleSwitch = ({ handler, state, className }) => {
  return (
    <StyledToggleSwitch
      className={className} // used to solve the problem with customize "custom" components made with StyledComponents
      type="checkbox"
      onChange={(e) => {
        handler(e); // handle onChangeEvent (passed by parent component)
      }}
      checked={state} // state of ToggleSwitch
    />
  );
};
