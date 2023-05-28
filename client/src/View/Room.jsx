import React, { useContext, useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { AppContext } from "../context/AppContext";
import { SocketContext } from "../context/SocketContext";
import { Device } from "../components/Device";
import axios from "axios";
import { Layout } from "../components/Layout";

// Main Component to manage Temperature, Light and Isolation control

export const Room = () => {
  const [haveAcces, setHaveAcces] = useState(false); // State used to check user Acces haveAcces [boolean]
  const [devices, setDevices] = useState(); // State used to store list of devices [{id : [String], name : [String]}]
  const [Rooms, setRooms] = useState(); // State used to store list of Rooms and devices that contains [nr : [Number], devices : [Array(of devices)]]

  const params = useParams(); // react hook used to get id of room from link
  const { access, getAccess } = useContext(AppContext); // react hook uset to contain needed logic (more in context/AppContext.jsx)
  const { socket } = useContext(SocketContext); // socket object to communicate with socket.server
  const navigator = useNavigate(); // hook used to redirect unlogged user to logIn "Home" page

  // function that get devices from Rooms state of this specific room using params of http link and provides them to devices state

  const getDevices = () => {
    if (Rooms !== undefined) {
      // If Rooms states is loaded
      let index = Rooms.findIndex((r) => r.nr === Number(params.id)); // search devices of specific room using params and set index of devices inside Array of Objects (Rooms)
      let devs = Rooms[index].devices; // get needed devices from Array of Objects(Rooms)
      console.log(Rooms);
      setDevices(devs); // provides devices to the state
    } else {
      // If Room state is not loade call getRooms() function to get Rooms
      getRooms();
    }
  };

  //function that fetch data from server api to data about Rooms

  const getRooms = async () => {
    let { data } = await axios.get(
      `http://${import.meta.env.VITE_IP}:${import.meta.env.VITE_PORT}/api`
    ); // fetch data from api
    setRooms(data);
  };

  useEffect(() => {
    if (!haveAcces) {
      //check that user have acces
      getAccess(); // try to get acces
      if (access === Number(params.id)) {
        // check that user have acces to this room
        setHaveAcces(true);
      } else {
        navigator("/"); // navigate user to the Home page
      }
    } else {
      if (devices === undefined || devices === null) {
        getDevices();
      }
      //Socket
      socket.emit("join", `${Number(params.id)}`); // Send infromation that user joined to the room
      socket.on("joinDevice", () => {
        // check that new device joined to the Room
        getRooms();
        getDevices();
        console.log("Devices", devices);
      });
      socket.on("Refresh", () => {
        // check on refresh rfrom server (device disconnect)
        console.log("działa");
        getRooms();
        getDevices();
        console.log("Devices", devices);
      });
      return () => {
        socket.off("joinDevice");
        socket.off("Refresh");
      };
    }
  }, [haveAcces, Rooms, devices]);

  // Helper Component to Render Devices

  const RenderFunc = () => {
    return (
      <Layout>
        {devices &&
          devices.map((d) => (
            <Device
              key={d.id}
              devices={devices.map((d) => d.name)}
              data={d}
              room={params.id}
            />
          ))}
      </Layout>
    );
  };

  return <>{!haveAcces ? null : RenderFunc()}</>; // Prevent acces to anwanted user until get logIn
};
