"use strict"

const _repository = require("../repositories/tarefa-repository");

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

module.exports.post = (req, res) => {
    _repository.post(req.body)
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
}

module.exports.put = (req, res) => {
    _repository.put(req.params.id, req.body)
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
}


module.exports.delete = (req, res)=>{
    _repository.delete(req.params.id)
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
}