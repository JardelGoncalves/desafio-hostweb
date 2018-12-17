"use strict"

class Validation {
    constructor() {
        this.erros = []
    }


    isRequired(attr, message) {
        if (!attr || attr === "") {
            this.erros.push(message)
        }
    }


    isEmail(email, message) {
        if (email) {
            let tem_At = email.split("@");

            if (tem_At.length === 2) {
                let tem_Dot = tem_At[1].split(".");
                if (tem_Dot.length <= 1) {
                    this.erros.push(message)
                }
            } else {
                this.erros.push(message)
            };
        }else {
            this.erros.push(message)
        }
    }


    dateValid(date, message) {
        if (date.length === 17) {
            let DataHora = data.split(" ");
            if (DataHora.length === 2) {
                let dataValida = this.verificaDataOuHora(DataHora[0], "/");
                let horaValida = this.verificaDataOuHora(DataHora[1], ":");
                if (!dataValida || !horaValida) {
                    this.erros.push(message);
                }
            } else {
                this.erros.push(message);
            }
        } else {
            this.erros.push(message);
        };
    };


    verificaDataOuHora(dataOuHora, div) {
        let valida = true;
        let vetor = dataOuHora.split(div);
        if (vetor.length === 3) {
            for (let i = 0; i < vetor.length; i++) {
                if (!parseInt(vetor[i])) {
                    valida = false;
                    break
                }
            }
        } else {
            valida = false;
        }
        return valida

    }
}

module.exports = Validation;