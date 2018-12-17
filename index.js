"use strict"

const app = require("./bin/express");

app.listen(app.get("port"),()=>{
    console.log("Server on port ", app.get("port"));
});