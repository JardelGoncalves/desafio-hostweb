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
        if(date){
            if (date.length === 17) {
                let DataHora = date.split(" ");
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
        } else {
            this.erros.push(message);
        }
    };


    verificaDataOuHora(dataOuHora, div) {
        let valida = true;
        let vetor_par = dataOuHora.split(div);
        if (vetor_par.length === 3) {
            for (let i = 0; i < vetor_par.length; i++) {
                // vetor_par = ["12", "33", "43"]
                if (isNaN(parseInt(vetor_par[i][0])) || isNaN(parseInt(vetor_par[i][1]))) {
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