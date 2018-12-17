"use strict"


module.exports.insert = (obj, tabela)=>{
    let valores_concatenados = concatenador(obj)
    return `INSERT INTO ${tabela} (${valores_concatenados.fields}) VALUES (${valores_concatenados.values})`
}

module.exports.select = (table, fields)=>{
    if(!fields){
        return `SELECT * FROM ${table}` 
    }
    return `SELECT ${fields} FROM ${table}` 
}




function getTamanho(obj) {
    let tamanho = 0
    for (let properties in obj) {
        tamanho += 1
    }
    return tamanho
}

function concatenador(obj) {
    let info = {
        fields: "",
        values: ""
    };
    let tamanho = getTamanho(obj) - 1
    let cont = 0;

    for (let properties in obj) {
        if (cont < tamanho) {
            info.fields += properties + "," + " ";
            info.values += "'" + obj[properties] + "'," + " "
        } else {
            info.fields += properties
            info.values += "'" + obj[properties] + "'"
        }
        cont += 1
    }
    return info
}

