
const PORT = process.env.PORT || 3000;
const fs = require('fs');
const express = require('express');
var cors = require('cors');
const app = express();
app.use(cors())
const http = require('http');
const { setInterval } = require('timers/promises');
const server = http.Server(app);
const io = require('socket.io')(server, {
    serveClient : false
});

let RoomsRaw = fs.readFileSync('../HomeControll/client/src/data/RoomsDefault.json');
let Rooms = JSON.parse(RoomsRaw);
console.log(Rooms);

app.get('/api',cors(),(req, res)=>{
    res.json(Rooms)
})

server.listen(PORT, ()=>{
    console.log("Listening on Port : ", PORT);
});

require('dns').lookup(require('os').hostname(), function (err, add, fam) {
    console.log('addr: '+add);
});

// STATES

io.on("connect", (socket)=>{
    socket.on('join', (name)=>{
        socket.join(`Room${name}`);
        console.log(`User joined Room nr : ${name}`);

    });
    socket.on("joinDevice",(name)=>{
        socket.join(`Room${name.nr}`);
        console.log(`Device joined Room nr : ${name.nr}`);
        // console.log("Message : ",name);
        let index = Rooms.findIndex( r => r.nr === Number(name.nr));
        Rooms[index].devices.push({id : socket.id, name : name.device});
        const data = JSON.stringify(Rooms);
        // console.log("ROOMS : ",Rooms);
        fs.writeFileSync('../HomeControll/client/src/data/Rooms.json', data, 'utf8',()=>{
        });
        console.log("Needed Data : ", Rooms[index].nr);
        io.emit("joinDevice", Rooms[index].nr);
    })

    io.emit('sockId', socket.id);
    console.log("New user connected with Id : ", socket.id);

    socket.on("getlightStatus",(data)=>{
        // console.log(`Light id : ${data.id}`); 
        // console.log(`Light status : ${data.status}`); 
        io.to(`${data.id}`).emit("getlightStatus", `${data.status}`);
    })
    socket.on("sendlightStatus",(data)=>{
        // console.log("Status leda : ", data);
        io.emit(`LightStatus${data.nr}`, data); 
    });
    socket.on("getTempAndHum",(data)=>{
        // console.log("Get Temperature : ", data);
        io.to(`${data}`).emit("getTempAndHum","OK");
    });
    socket.on("sendTemperature",(data)=>{
        // console.log("Temperature : ", data); 
        // console.log(`Temperature${data.nr}`); 
        io.emit(`Temperature${data.nr}`, data); 
    });
    socket.on("setHeater",(data)=>{
        console.log("Heater DATA : ", data);
        io.emit("setHeater",data);
    });
    socket.on("getHeater",(data)=>{
        io.emit("getHeater", data);
    });
    socket.on("setAutoHeater", (data)=>{
        console.log("Set Heater : ", data);
        io.emit(`getAutoHeater${data.room}`,(data));
    });

    socket.on("rollerDown",(data)=>{
        console.log("Roller Down");
        io.emit("rollerDown","cos");
    });
    socket.on("rollerUp",(data)=>{
        console.log("Roller Up");
        io.emit("rollerUp","cos");
    });
    socket.on("setRollers",(data)=>{
        console.log("Slider Rollers");
        io.emit("setRollers",data);
    });

    socket.on("getRollers", (data)=>{
        console.log(data)
        io.emit(`Roller${data.nr}`,data);
    })

    socket.on('disconnect',()=>{
        console.log(socket.id, "Disconnected");
        Rooms.forEach( (r) =>{
            let InnerIndex = r.devices.findIndex( d => d.id===socket.id)
            if(InnerIndex !== -1){
                r.devices.splice(InnerIndex,1);
                io.emit("Refresh");
                // console.log("YOU");
            }
        })
        const data = JSON.stringify(Rooms);
        fs.writeFileSync('../HomeControll/client/src/data/Rooms.json', data, 'utf8',()=>{
        })
    });

});   