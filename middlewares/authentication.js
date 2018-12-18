"use strict"

const variables = require("../bin/config/variables");
const Promise = require("promise");
const jwt = require("jsonwebtoken");
const connection = require("../bin/config/db-connection")();
const Query = require("../bin/helpers/query");

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
                    connection.query(Query.findOne("usuario", decoded.usuario[0],"AND"), (err, result)=>{
                        if(result){
                            resolve(decoded)
                        } else {
                            console.log(err)
                            reject({message:"Usuário inválido"})
                        }
                    })
        
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