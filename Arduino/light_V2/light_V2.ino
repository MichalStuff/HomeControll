#include <ESP8266WebServer.h>
#include <EEPROM.h>
#include <SocketIoClient.h>
#include <ArduinoJson.h>
#include <Arduino.h>
#include <ESP8266WiFi.h>

ESP8266WebServer    server(80);

#define USER_SERIAL Serial

#define LED 2
#define LIGHT 5

String Room = "1";
String Device = "Light";
String LightStatus = "OFF";

SocketIoClient webSocket;
int SocketStatus = 0;

struct settings {
  char ssid[30];
  char password[30];
  char socket[30];
} device_wifi = {};

void setup() {
  USER_SERIAL.begin(115200); //START LISTEN SERIAL PORT ON 115200 BUADRATE
  pinMode(LIGHT, OUTPUT);
  EEPROM.begin(sizeof(struct settings) );
  EEPROM.get( 0, device_wifi );
   
  WiFi.mode(WIFI_STA);
  USER_SERIAL.print("SSID : ");
  USER_SERIAL.println(device_wifi.ssid);
  WiFi.begin(device_wifi.ssid, device_wifi.password);

  wifiSetup();

  webSocket.on("connect", hello);
  webSocket.on("getlightStatus",lightController);

  USER_SERIAL.print("SOCKET IP : ");
  USER_SERIAL.println(device_wifi.socket);
  webSocket.begin(device_wifi.socket, 3000); //  CONNECT TO WITH SOCKET.IO SERVER
  server.on("/",  handlePortal);
  server.begin();

}

void loop() {
  if(WiFi.status() == WL_CONNECTED){
  webSocket.loop(SocektConnectionStatus); // LOOP RESPONSIBLE FOR KEEPING CONNECTION 
  }else{
    server.handleClient();
  }

}

void hello(const char* message, size_t length){
  USER_SERIAL.println("Connected to the Server");
  USER_SERIAL.println(message);
  USER_SERIAL.print("LED state : ");
  USER_SERIAL.println(digitalRead(LIGHT)); 
  String data = "{\"nr\":\"" + Room + "\",\"device\":\"" + Device + "\"}";
  webSocket.emit("joinDevice",data.c_str());
 //LightStatus on connection
  if(digitalRead(LIGHT) == 0){
    LightStatus = "OFF";
  }else{
    LightStatus = "ON";
  }
  data =  "{\"nr\":\"" + Room + "\",\"light\":\"" + LightStatus + "\"}";
  webSocket.emit("sendlightStatus", data.c_str());
  
}

void lightController(const char* message, size_t length){
  USER_SERIAL.print("Przycisk zmiany swiatla : ");
  USER_SERIAL.println(message);
  String msg(message);
  if(msg.equals("ON") || msg.equals("on")){
    digitalWrite(LIGHT, HIGH);
    USER_SERIAL.print("LED state : ");
    USER_SERIAL.println(digitalRead(LIGHT));
    LightStatus = "ON";
  }
  if(msg.equals("OFF") || msg.equals("off")){
    digitalWrite(LIGHT, LOW);
    USER_SERIAL.print("LED state : ");
    USER_SERIAL.print(digitalRead(LIGHT)); 
    LightStatus = "OFF";
  }
  String data =  "{\"nr\":\"" + Room + "\",\"light\":\"" + LightStatus + "\"}";
  webSocket.emit("sendlightStatus", data.c_str());
}

void handlePortal() {

  if (server.method() == HTTP_POST) {

    strncpy(device_wifi.ssid,     server.arg("ssid").c_str(),     sizeof(device_wifi.ssid) );
    strncpy(device_wifi.password, server.arg("password").c_str(), sizeof(device_wifi.password) );
    strncpy(device_wifi.socket,   server.arg("socket").c_str(), sizeof(device_wifi.socket) );
    device_wifi.ssid[server.arg("ssid").length()] = device_wifi.password[server.arg("password").length()] = device_wifi.socket[server.arg("socket").length()] = '\0';
    USER_SERIAL.print("SSID : ");
    USER_SERIAL.println(device_wifi.ssid);
    EEPROM.put(0, device_wifi);
    EEPROM.commit();

    server.send(200, "text/html", "<!DOCTYPE html><html lang='en'> <head> <meta charset='utf-8' /> <meta name='viewport' content='width=device-width, initial-scale=1' /> <title>Light Setup</title> <style> * { box-sizing: border-box; margin: 0 auto; } body { height: 100vh; display: flex; justify-content: center; align-items: center; font-family: Arial, Helvetica, sans-serif; background-color: #141523; color: #fff; } h1, p { text-align: center; } </style> </head> <body> <div class='form'> <h1>Light Setup</h1> <br /> <p>Your settings have been saved<br />Please restart the device.</p> </div> </body></html>");
  } else {
  server.send(200,"text/html", "<html lang='en'> <head> <meta charset='utf-8' /> <meta name='viewport' content='width=device-width, initial-scale=1' /> <title>Light Setup</title> <style> * { margin: 0 auto; box-sizing: border-box; } body { height: 100vh; display: flex; justify-content: center; align-items: center; font-family: Arial, Helvetica, sans-serif; background-color: #141523; color: #fff; } .in { display: block; border-radius: 10px; border: none; width: 100%; height: 40px; margin: 10px auto; } h1 { text-align: center; } button { color: black; background-color: #19d28f; border: none; width: 100%; padding: 10px; color: #fff; font-size: 30px; border-radius: 15px; } </style> </head> <body> <div class='form'> <form action='/' method='post'> <h1 class=''>Light Setup</h1> <br /> <div> <label>SSID</label><input type='text' class='in' name='ssid' /> </div> <div class='form-floating'> <br /><label>Password</label ><input type='password' class='in' name='password' /> </div> <div> <label>Socket</label><input type='text' class='in' name='socket' /> </div> <br /><br /><button type='submit'>Save</button> </form> </div> </body></html>");
  }
}

void wifiSetup(){

  while (WiFi.status() != WL_CONNECTED) {
    byte tries = 0;
    delay(1000);
    if (tries++ > 30) {
      WiFi.mode(WIFI_AP);
      WiFi.softAP("Light Device", "");
      break;
    }
  }
}

void SocektConnectionStatus(){
  if(webSocket.getStatus() == 0){
      SocketStatus ++;
      USER_SERIAL.println(SocketStatus);
  }
  if(SocketStatus > 300){
        WiFi.mode(WIFI_AP);
        WiFi.softAP("Light Device", "");
  }
}
