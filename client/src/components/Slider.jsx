import React, { useEffect, useRef, useState } from "react";
import styled from "styled-components";
import { mobile } from "../Mixins";

//CSS Styles

const StyledContainer = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: space-between;
`;

const StyledH1 = styled.h1`
  width: 80%;
  display: block;
  font-size: 45px;
  font-weight: var(--txt-700);
  text-align: center;
  color: var(--secondary);
  ${mobile`
    font-size : 38px;
  `}
`;

const StyledSlider = styled.input`
  margin-top: 10px;
  -webkit-appearance: none;
  display : block;
  appearance: none;
  height: 20px;
  width : 200px;
  background-color: var(--secondary);
  border-radius: 10px;
  }
  &::-webkit-slider-thumb{
    appearance: none;
    border-radius : 50%;
    width : 40px;
    height : 40px;
    background-color : var(--primary);
    border : 3px solid var(--secondary);
    display : block;
  }
  &::-webkit-slider-runnable-track{
    -webkit-appearance: none;
    
  }

`;

//Custom React component

export const Slider = ({
  value = 90, //value of slider
  handler, // handler function onChange
  min = 0, // Minimal range of slider
  max = 90, // Maximal range of slider
  step = 1, // Step of slider
  label = "", // label
}) => {
  const ref = useRef(); // reference to slider, used to set value of slider

  useEffect(() => {
    ref.current.value = value; // set slider current value
  }, [value]);

  return (
    <StyledContainer>
      <StyledH1>{label}</StyledH1> {/* Display label of slider */}
      <StyledH1>{value}</StyledH1> {/* Display value of slider */}
      <StyledSlider
        ref={ref}
        type="range"
        min={min}
        max={max}
        step={step}
        // OnMouseUp, onTouchEnd, onKeyUp used instead of onChange to prevents mutiple cals to server
        onMouseUp={(e) => {
          handler(e);
        }}
        onTouchEnd={(e) => {
          handler(e);
        }}
        onKeyUp={(e) => {
          if (
            e.key === "ArrowDown" ||
            e.key === "ArrowUp" ||
            e.key === "ArrowLeft" ||
            e.key === "ArrowRight"
          ) {
            handler(e);
          }
        }}
      />
    </StyledContainer>
  );
};
