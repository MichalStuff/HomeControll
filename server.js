
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
// console.log(Rooms);

app.get('/api',cors(),(req, res)=>{
    res.json(Rooms)
})

server.listen(PORT, ()=>{
    console.log("Listening on Port : ", PORT);
});

require('dns').lookup(require('os').hostname(),{ family : 4 }, function (err, add) {
    console.log('addr: ' + add);
  })
// STATES

io.on("connect", (socket)=>{
    socket.on('join', (name)=>{
        socket.join(`Room${name}`);
        console.log(`User joined Room nr : ${name}`);

    });
    socket.on("joinDevice",(name)=>{
        socket.join(`Room${name.nr}`);
        console.log(`Device joined Room nr : ${name.nr}`);
        let index = Rooms.findIndex( r => r.nr === Number(name.nr));
        Rooms[index].devices.push({id : socket.id, name : name.device});
        const data = JSON.stringify(Rooms);
        fs.writeFileSync('../HomeControll/client/src/data/Rooms.json', data, 'utf8',()=>{
        });
        // console.log("Needed Data : ", Rooms[index].nr);
        io.emit("joinDevice", Rooms[index].nr);
    })

    io.emit('sockId', socket.id);
    console.log("New user connected with Id : ", socket.id);

    socket.on("getlightStatus",(data)=>{
        io.to(`${data.id}`).emit("getlightStatus", `${data.status}`);
    })
    socket.on("sendlightStatus",(data)=>{
        io.emit(`LightStatus${data.nr}`, data); 
    });
    socket.on("getTempAndHum",(data)=>{
        io.to(`${data}`).emit("getTempAndHum","OK");
    });
    socket.on("sendTemperature",(data)=>{
        io.emit(`Temperature${data.nr}`, data); 
    });
    socket.on("setHeater",(data)=>{
        io.emit("setHeater",data);
    });
    socket.on("getHeater",(data)=>{
        io.emit("getHeater", data);
    });
    socket.on("setAutoHeater", (data)=>{
        io.emit(`getAutoHeater${data.room}`,(data));
    });

    socket.on("rollerDown",(data)=>{
        io.emit("rollerDown","cos");
    });
    socket.on("rollerUp",(data)=>{
        io.emit("rollerUp","cos");
    });
    socket.on("setRollers",(data)=>{
        io.emit("setRollers",data);
    });

    socket.on("getRollers", (data)=>{
        io.emit(`Roller${data.nr}`,data);
    })

    socket.on('disconnect',()=>{
        console.log(socket.id, "Disconnected");
        Rooms.forEach( (r) =>{
            let InnerIndex = r.devices.findIndex( d => d.id===socket.id)
            if(InnerIndex !== -1){
                r.devices.splice(InnerIndex,1);
                io.emit("Refresh");
            }
        })
        const data = JSON.stringify(Rooms);
        fs.writeFileSync('../HomeControll/client/src/data/Rooms.json', data, 'utf8',()=>{
        })
    });

});   