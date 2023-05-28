# HomeControll


### Intoduction

__HomeControl__ is an IoT application for managing devices in the room using ESP8266 12E. I created this prokject to get mine engineering degree. The main purpose of this project is to provide responsive web application that allows user to control devices inside the room. Devices are connected with WiFi and communicate with server using WebSockets. Clients side also communicate with server using WebSockets to provide continous connection with server. For this moment app provides : 
 *  *ligt controll*
 * *teperature and humidity data reading*
 * *temperature controll*
 * *blinds controll*
 
![view](https://github.com/MichalStuff/HomeControll/assets/87261327/bbcc150e-0ebd-46d7-a2c3-968bcbf72055){with:60%}

This project deliver Frontend, Backend, and wiring diagram and code for Devices. 
The biggest issue of this project was to find good information about connecting Arduino based devices with SocketIO. I hope that project will help to solve someone problems.

### Table of Contents
* [Introduction](#introduction)
* [Techologies](#techologies)
* [Setup](#setup)
* [New Device](#new-device)

### Technologies

* JavaScript
* React.js (v 18.2.0)
* Node.js
* Express.js
* SocketIO/ SocketIO-client (v 2.3.0)
* [SocketIO for Arduino](https://github.com/timum-viw/socket.io-client)
* Styled Componens (v 5.3.6)
* Arduino
* C++

### Setup
* To use this this project you need to download this repository [link](https://github.com/MichalStuff/HomeControll)
* Next Step is to go to main folder an type *"npm install"* in terminal
* Then you need to go to the 'client' folder and type *"npm install"* in terminal
* Next step is to back to the main folder and type *"npm run server"* after this step you shoudl see ip address of your local server (this IP address will be needed to konfigurate client side and device, there is special comment in code) insde client folder you can use .env file
![konf2](https://github.com/MichalStuff/HomeControll/assets/87261327/b0420d9e-2f90-4c44-b0dc-5ff5e014bc6e)
* In the next step you need to type *"npm start"* to start front-end side (web page) in the terminal you should get local ip address of your website
![konf1](https://github.com/MichalStuff/HomeControll/assets/87261327/fd01f5b9-5485-4acd-a297-f1ffe201a443)
* then you need to upload *Arduino* code to your devices and change IP and PORT
* last step is to boot your device and connect it to WiFi network using your device as AccessPoint (or change code and do it manualy)
![konf4](https://github.com/MichalStuff/HomeControll/assets/87261327/c5f44123-1d79-469b-bbce-f14e17e32f53)
*  after connecting with device you need to go to your browser to your localhost:3000 and configurate your device
![konf3](https://github.com/MichalStuff/HomeControll/assets/87261327/8f517f99-b6ef-4c44-880a-3c1b0b396eab)

that's it now You can controll your devices :)

### New Device
To add new device you need to do your own code and wiring for the device (Prefered ESP but you can use any device that provide WiFi connection like: Raspberry Pi Pico W). Nex Step is to integrate Server and Device using SocketIO : 

Using method on included inside SocketIO library you can add new Event that trigger some action (More at : [SocketIO Documentation](https://socket.io/docs/v4/)) 

__Server__ : 
*The code below presents how to recive message form client and emit to device :*
```Javascript
socket.on("ReciveTriggerMessageFromClient",(data)=>{
        io.emit(`EmitMessageToDevice`, data); 
}
```
*The code below presents how to recive message form device and emit to client :*

```Javascript
socket.on("ReciveTriggerMessageFromDevice",(data)=>{
        io.emit(`EmitMessageToDClient`, data); 
}
```

__Client__ : 
*Inicialization of SocketIO inside new React Component (using existing socket object from Context)*
```Javascript
const { socket } = useContext(SocketContext); // this line is needed to use SocketIO inside Component
```
*Sending Message :*

The best way to use it by usingHTML Event like""OnCilck" by you can use it like you wish (in some cases it can be SetInterval inside useEffect hook depending on situation)

```Javascript
sockt.emit("MessageName",data); // sending data to device
````
*Reciving Message :*

The best way to recive message is by usng useEffect hook where you can mount and unmount event listener (socket.on - method)

```JavaScript
  useEffect(() => {
    socket.on("MessageName", (data) => {
      console.log(data); // Show data reviced after triggering "MessageName" event
      //type your code here ... 
    });
    return () => {
      socket.off(`MessageName`); // this is important to unmount. Whitout this step Event will be mounted multiple times and after each call data will be shown several times
    };
  }, []);
```
__Device :__

To add new device you need to copy one of my device codes and analize it ( there is a lot off comments what each function do)

*Initialization :*

```C++
    SocketIoClient webSocket; // inicialize web socket
```

Inside setpu function you need to begin socketIO connection

```C+++
 setup(){
     webSocket.begin();
 }
```

Inside loop function you need to add SockedIO loop

```C+++
    loop()
    {
        webSocket.loop();
    }
```


*Sending message :*
You need to place this code inside setup function or callback function (depending what you want to recive)
```C++
    String data = "{\"something\:"" + YOURDATA + "\"} // you can better see how to prepare data in my code 
    websSocket.emit("MessageName", data.c_str()) // one of the ways to send data as object
```

*Reciving Message  :*

To recive message you need to place code inside setup() 

```C+++
    setup(){
        webSocket.on("MessageName", CallbackFunctionName);
    }
```
Then you need to declarate you callback function where "you can tell your device what to do"

```C
    void CallbackFunctionName(const char* data, size_t length){
        //your code ...
    }
```
