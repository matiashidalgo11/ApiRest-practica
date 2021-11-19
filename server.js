/* import cors from "cors";
import methodOverride from "method-override";
import express, { response } from "express"; */

const methodOverride = require("method-override");
const cors = require("cors");
const express = require("express");
const multer = require("multer");
const {v4:uuid} = require("uuid");

//

const server = express();
const log = console.log;

let port = process.env.PORT || 3001;

server.use(express.json());
server.use(express.urlencoded({extended:true}));

let users = [{email:"aux@aux", name:"aux",pass:"aux"},{email:"matiashidalgo18@gmail.com", name:"matias",pass:"1234"}];


//GET
server.get("/",(req, res) =>{
    res.send("Server Funcionando");
});

server.get("/users", (req, res) => {
    res.send(users);
});

server.get("/users/:email", (req, res) =>{
    res.send(buscarPorEmail(req.params.email));
});

server.get('/name',(req, res) =>{

    let nombre = req.query.nombre;
    res.send(buscarPorName(nombre));

});

//POST

server.post('/user', (req, res) =>{

    let user = { email : req.body.email, name : req.body.name, pass : req.body.pass };
    users.push(user);
    res.send(users);
});


//CREATE CON FOTO

const multerConfig = multer.diskStorage({

    destination : function(req, file, cb) {
        cb(null,"./bucket");
    },
    filename:function(req,file,cb){
        let idImagen = uuid().split("-")[0];
        cb(null,`${idImagen}.${file.originalname}`);
    }

});

const multerMiddle = multer({storage:multerConfig});

server.post('/user/foto', multerMiddle.single('imagefile'),(req, res) =>{


    let path = `${req.file.destination}/${req.file.filename}`;
    log(path);
    /* let user = { email : req.body.email, name : req.body.name, pass : req.body.pass, photo :  path};
    users.push(user); */

    res.send(users); 
});



//DELETE

server.delete('/user/:email', (req, res) => {

    users = users.filter(elm => elm.email !== req.params.email);
    res.send(users);

});

server.delete('/user', (req, res) => {

    let emails = req.query.email;

    let lengthReq = emails.length;

    for(let i = 0; i < lengthReq; i++){

        users = users.filter(elm => elm.email !== emails[i]);
    }
    

    res.send(users);

});

//UPDATE

server.put('/user/update',(req, res) => {

    let email = req.body.email;

    let index = users.findIndex(elm => elm.email === email);

    let newUser = { email : email, name : req.body.name, pass : req.body.pass};

    users[index] = newUser;

    res.send(users);
});


//


server.listen(port, ()=>{
    log("start server");
});


//Funciones aux


function buscarPorEmail(email){
    
    let user = users.filter(elm => elm.email === email);
    
    return user;
}

function buscarPorName(name){
    
    let user = users.filter(elm => elm.name === name);
    
    return user;
}