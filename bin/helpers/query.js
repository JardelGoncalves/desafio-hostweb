"use strict"

/**
 * Módulo responsável por retornar uma String para realizar as querys no banco de dados
 */

 // query para inserir dados no banco
 // recebe um objeto e a tabela onde o dado será inserido
module.exports.save = (data, table) => {
    // método concatenador retorna um objeto com os campos e values concatenados
    let valores_concatenados = concatenador(data, "insert")
    return `INSERT INTO ${table} (${valores_concatenados.fields}) VALUES (${valores_concatenados.values})`
}

// query usada para buscar todos os dados de uma tabela no banco
// projection são os campos que serão retornados de cada linha
module.exports.find = (table, projection) => {
    // caso projection não seja informado, retorna todos os campos (*)
    if (!projection) {
        return `SELECT * FROM ${table}`
    }
    return `SELECT ${projection} FROM ${table}`
}

// query usado para buscar um dado pelo campo email
module.exports.findByEmail = (table, email, projection) => {
    if (!projection) {
        return `SELECT * FROM ${table} WHERE email='${email}'`
    }
    return `SELECT ${projection} FROM ${table} WHERE email='${email}'`
}

//  query usado para buscar um dado pelo id
module.exports.findById = (table, id, projection) => {
    if (!projection) {
        return `SELECT * FROM ${table} WHERE id='${id}'`
    }
    return `SELECT ${projection} FROM ${table} WHERE id=${id}`
}

// query usado para atualizar os dados de uma linha em uma tabela pelo id
module.exports.findByIdAndUpdate = (table, id, data) => {
    let valores_concatenados = concatenador(data, "update");
    return `UPDATE ${table} SET ${valores_concatenados.set} WHERE id='${id}'`

}

// query usado para remover uma linha em uma tabela pelo id
module.exports.findByIdAndRemove = (table, id) => {
    return `DELETE FROM ${table} WHERE id='${id}'`
}

module.exports.findOne = (table, data, operator, projection) =>{
    let valores_concatenados = concatenador(data,"select-one", operator);
    if (!projection) {
        return `SELECT * FROM ${table} WHERE ${valores_concatenados.select_one}`
    }
    return `SELECT ${projection} FROM ${table} WHERE ${valores_concatenados.select_one}`
}

// método usado para retorna o tamanho de um objeto
function getTamanho(obj) {
    return Object.keys(obj).length
}

// método usado para concatenar os dados passado como objeto
function concatenador(obj, tipo, operator) {
    // os dados retornados (fields e values são usados no insert e set usado no update)
    let info = {
        fields: "",
        values: "",
        set: "",
        select_one:""
    };
    let tamanho = getTamanho(obj) - 1; // retorna a quantidade de posições corretas
    let cont = 0;
    if (tipo === "insert") {
        // concatena os dados para usar no insert
        for (let properties in obj) {
            if (cont < tamanho) {
                info.fields += properties + "," + " ";
                info.values += (typeof obj[properties] !== 'boolean' || typeof obj[properties] !== 'number') ? `'${obj[properties]}', ` : `${obj[properties]}, `;  
            } else {
                info.fields += properties
                info.values += (typeof obj[properties] !== 'boolean' || typeof obj[properties] !== 'number') ? `'${obj[properties]}'` : `${obj[properties]}`;
            }
            cont += 1
        }
    } else if (tipo === "update") {
        // concatena os dados para usar no update
        for (let properties in obj) {
            let tipo_string = `${properties} = '${obj[properties]}'`;
            let outro_tipo = `${properties}= ${obj[properties]}`;
            
            if (cont < tamanho) {
                info.set += (typeof obj[properties] !== 'boolean' || typeof obj[properties] !== 'number') ? `${tipo_string}, ` : `${outro_tipo}, `; 
                
            } else {
                info.set += (typeof obj[properties] !== 'boolean' || typeof obj[properties] !== 'number') ? tipo_string : outro_tipo; 
            }
            cont += 1
        }
    } else if (tipo === "select-one"){
        // concatena para o operador passado como argumento
        for (let properties in obj) {
            let tipo_string = `${properties} = '${obj[properties]}'`;
            let outro_tipo = `${properties}= ${obj[properties]}`;

            if (cont < tamanho) {
                info.select_one += (typeof obj[properties] !== 'boolean' && typeof obj[properties] !== 'number') ? `${tipo_string} ${operator} ` : `${outro_tipo} ${operator} `;
            } else {
                info.select_one += (typeof obj[properties] !== 'boolean' && typeof obj[properties] !== 'number') ? tipo_string : outro_tipo;
            }
            cont += 1
        }
    }
    return info
}

