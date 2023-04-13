import React, { useEffect } from "react";
import { Heater } from "./Heater";
import { LightPanel } from "./LightPanel";
import { Roller } from "./Roller";
import { TemperaturePanel } from "./TemperaturePanel";

// React component to Render connected devices

// data { id : [String] id of device , name : [String] Name of device }
// room [String] Number of Room
// devices [Array of Strings] names of devices in Room

export const Device = ({ data, room, devices }) => {
  return (
    <>
      {/* If device api contains device device is rendered  and passes needed parameters*/}
      {data.name.includes("Temperature") && (
        <TemperaturePanel data={data} room={room} />
      )}
      {data.name.includes("Light") && <LightPanel data={data} room={room} />}
      {/* Heater is specific device that in this version needs Temperature device to work */}
      {data.name.includes("Heater") && devices.includes("Temperature") && (
        <Heater data={data} room={room} />
      )}
      {data.name.includes("Roller") && <Roller data={data} room={room} />}
    </>
  );
};
