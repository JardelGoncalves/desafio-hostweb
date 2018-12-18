"use strict"

const express = require("express");
const body_parser = require("body-parser");
const app = express()

// Configurações do body-parser
app.use(body_parser.json());
app.use(body_parser.urlencoded({extended:true}));
app.set("port", 3000);

// Rotas API
app.use("/usuario", require("../routes/usuario-routes"));
module.exports = app;