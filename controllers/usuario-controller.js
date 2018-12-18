"use strict"

const _repository = require("../repositories/usuario-repository");
const variables = require("../bin/config/variables");
const jwt = require("jsonwebtoken");

module.exports.authenticate = (req, res) => {
    if (req.body.email && req.body.password) {
        _repository.authenticate(req.body.email, req.body.password)
            .then((usuarioEncontrado) => {
                if (usuarioEncontrado) {
                    res.status(200).json({
                        usuario: usuarioEncontrado,
                        token: jwt.sign({
                            usuario: usuarioEncontrado
                        }, variables.Securty.secretKey)
                    })
                }else {
                    res.status(400).json({
                        message: "Não foi possivel efetuar o login"
                    })
                }
            })
            .catch((err) => {
                res.status(404).json({
                    message: "Usuário ou senha inválido!"
                })
                return;
            })
    } else {
        res.status(400).json({
            message: "Não foi possivel efetuar o login"
        })
        return;
    }
}


// Cadastro de usuário
module.exports.register = (req, res) => {
    if (req.body.password && req.body.passwordConfirm) {
        if (req.body.password === req.body.passwordConfirm) {
            _repository.register({
                    nome: req.body.nome,
                    email: req.body.email,
                    password: req.body.password
                })
                .then((success) => {
                    res.status(success.status).json({
                        message: success.message
                    })
                })
                .catch((failed) => {
                    res.status(failed.status).json({
                        message: failed.message,
                        erros: failed.erros
                    })
                })
        } else {
            res.status(400).json({
                message: "Não foi possivel realizar o cadastro",
                erros: ["Senha e Confirmação da senha não equivalentes!"]
            })
        }
    } else {
        res.status(400).json({
            message: "Não foi possivel realizar o cadastro",
            erros: ["Senha e Confirmação da senha são requeridas!"]
        })
    }
}

// Listar todos os usuários
module.exports.getAll = (req, res) => {
    _repository.getAll()
        .then((success) => {
            res.status(success.status).json(success.message)
        })
        .catch((failed) => {
            res.status(failed.status).json({
                message: failed.message
            })
        })
}

// Obter usuário pelo ID
module.exports.getById = (req, res) => {
    _repository.getById(req.params.id)
        .then((success) => {
            res.status(success.status).json(success.message)
        })
        .catch((failed) => {
            res.status(failed.status).json({
                message: failed.message
            })
        })
}

// Atualizar Nome e Senha do usuário
module.exports.put = (req, res) => {
    if (req.params.id) {
        _repository.put(req.params.id, {
                nome: req.body.nome,
                password: req.body.password
            })
            .then((success) => {
                res.status(success.status).json({
                    message: success.message
                })
            })
            .catch((failed) => {
                res.status(failed.status).json({
                    message: failed.message,
                    erros: failed.erros
                })
            })
    } else {
        res.status(400).json({
            message: "Solicitação inválida!",
            erros: ["Informe um ID!"]
        })
    }
}

// Remover Usuário pelo ID
module.exports.delete = (req, res) => {
    if (req.params.id) {
        _repository.delete(req.params.id)
            .then((success) => {
                res.status(success.status).json({
                    message: success.message
                })
            })
            .catch((failed) => {
                res.status(failed.status).json({
                    message: failed.message
                })
            })
    } else {
        res.status(400).json({
            message: "Solicitação inválida!",
            erros: ["Informe um ID!"]
        })
    }
}