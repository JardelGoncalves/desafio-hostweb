"use strict"

const variables = require("../bin/config/variables");
const Promise = require("promise");
const jwt = require("jsonwebtoken");

/**
 * Autenticação da API via JWT
 */

module.exports = (req, res, next) => {
    function verifyJWT(){
        return new Promise((resolve, reject) => {
            let token = req.body.token || req.query.query || req.headers["x-access-token"];
            if (token){
                try {
                    let decoded = jwt.verify(token, variables.Securty.secretKey)
                    resolve(decoded)
                } catch (error) {
                    console.log(error)
                    reject({message:"Token inválido"})
                }
            } else {
                reject({message:"Você precisa informar o Token para acessar o recurso"})
            }
        })
    }
    verifyJWT()
    .then((result)=>{
        req.usuarioLogado = result;
        next();
    })
    .catch((err) =>{
        res.status(401).json(err);
        return;
    })
}