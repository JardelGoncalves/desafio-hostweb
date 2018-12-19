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
    return _repository_base.getById("tarefas", id);
}

module.exports.post = (data) => {
    return new Promise((resolve, reject) => {
        let _validador = new validation();
        _validador.isRequired(data.nome, "O nome da tarefa é requerido!");
        _validador.isRequired(data.descricao, "A descrição da tarefa é requerida!");
        _validador.isRequired(data.prazo, "O prazo da tarefa é requerido!");
        _validador.isRequired(data.prioridade, "A prioridade da tarefa é requerida!");
        _validador.dateValid(data.prazo, "Formato do prazo inválido (ex: 25/12/18 12:30:22)");
        

        _repository_base.post(_validador, data, "tarefas")
        .then((success)=>{
            resolve(success);
        })
        .catch((failed)=>{
            reject(failed);
        })
    })
}

module.exports.put = (id, data) => {
    return new Promise((resolve, reject) => {
        let _validador = new validation();
        if (data.prazo){
            _validador.dateValid(data.prazo, "Formato do prazo inválido (ex: 25/12/18 12:30:22)");
        }
        if (data.concluida !== undefined){
            console.log("aqui")
            _validador.isEqual((data.concluida === 0 || data.concluida === 1), "Valor para o campo concluida é inválido")
        }
        _repository_base.put(_validador, id, data, "tarefas")
        .then((success)=>{
            resolve(success);
        })
        .catch((failed)=>{
            reject(failed);
        })
    })
}


module.exports.delete = (id) => {
    return _repository_base.delete("tarefas", id)
}