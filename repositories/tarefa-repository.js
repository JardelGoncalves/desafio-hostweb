"use strict"

const connection = require("../bin/config/db-connection")();
const validation = require("../bin/helpers/validation");
const Query = require("../bin/helpers/query");
const _repository_base = require("../bin/base/repository-base");
const Promise = require("promise");


module.exports.getAll = () => {
    return _repository_base.getAll("tarefas");
}

module.exports.getById = (id) => {
    return _repository_base.getById("tarefas", id, "Nenhuma tarefa encontrado!");
}

module.exports.post = (data) => {
    return new Promise((resolve, reject) => {
        let _validador = new validation();
        _validador.isRequired(data.nome, "O nome da tarefa é requerido!");
        _validador.isRequired(data.descricao, "A descrição da tarefa é requerida!");
        _validador.isRequired(data.prazo, "O prazo da tarefa é requerido!");
        _validador.isRequired(data.prioridade, "A prioridade da tarefa é requerida!");
        _validador.dateValid(data.prazo, "Formato do prazo inválido (ex: 25/12/18 12:30:22)");

        if (_validador.erros.length === 0) {
            connection.query(Query.save(data, "tarefas"), (err, result) => {
                if (result) {
                    resolve({
                        message: "Tarefa cadastrada com sucesso",
                        status: 201
                    })
                } else {
                    console.log(err)
                    reject({
                        message: "Ocorreu um erro inesperado!",
                        status: 503
                    })
                }
            })
        } else {
            reject({
                message: "Não foi possivel realizar o cadastro da tarefa",
                erros: _validador.erros,
                status: 400
            })
        }
    })
}

module.exports.put = (id, data) => {
    return new Promise((resolve, reject) => {
        let _validador = new validation();

        _validador.isRequired(data.nome, "O nome da tarefa é requerido!");
        _validador.isRequired(data.descricao, "A descrição da tarefa é requerida!");
        _validador.isRequired(data.prazo, "O prazo da tarefa é requerido!");
        _validador.isRequired(data.prioridade, "A prioridade da tarefa é requerida!");
        _validador.dateValid(data.prazo, "Formato do prazo inválido (ex: 25/12/18 12:30:22)");

        if (_validador.erros.length === 0) {
            connection.query(Query.findByIdAndUpdate("tarefas", id, data), (err, result) => {
                if (result) {
                    if(result.affectedRows === 1){
                        resolve({
                            message: "Tarefa atualizada com sucesso!",
                            status: 202
                        })
                    } else {
                        reject({
                            message: "Tarefa não encontrada",
                            status: 404
                        })
                    }
                } else {
                    reject({
                        message: "Ocorreu um erro inesperado!",
                        status: 503
                    })
                }
            })
        } else {
            reject({
                message: "Não foi possivel atualizar a tarefa!",
                erros: _validador.erros,
                status: 400
            })
        }
    })
}

module.exports.alteraStatus = (id, data) => {
    return new Promise((resolve, reject) => {
        if (data.concluida === 1 || data.concluida === 0) {
            connection.query(Query.findByIdAndUpdate("tarefas", id, data), (err, result) => {
                if (result) {
                    if(result.affectedRows === 1){
                        resolve({
                            message: "Status da tarefa atualizado com sucesso!",
                            status: 202
                        })
                    } else {
                        reject({
                            message: "Tarefa não encontrada",
                            status: 404
                        })
                    }
                } else {
                    console.log(err)
                    reject({
                        message: "Ocorreu um erro inesperado!",
                        status: 503
                    })
                }
            })
        } else {
            reject({
                message: "Não foi possivel atualizar o status da tarefa!",
                erros: ["Campo concluido é requerido!"],
                status: 400
            })
        }
    })
}

module.exports.delete = (id) => {
    return _repository_base.delete("tarefas", id, "Tarefa removida com sucesso!", "Tarefa não encontrada")
}