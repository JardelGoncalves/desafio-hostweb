let chai = require('chai');
let chaiHttp = require('chai-http');
let should = chai.should();

chai.use(chaiHttp);

let token_test = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c3VhcmlvIjpbeyJpZCI6MSwibm9tZSI6ImFkbWluIiwiZW1haWwiOiJhZG1pbkBhZG1pbi5jb20ifV0sImlhdCI6MTU0NTE5NTY5Nn0.DefB2Y5BKWKoT_rP2LTOOPiyQdZDhA1BcanFOZE8EnQ"
let id = null
// TESTAR ENDPOINT /usuario
describe('Usuário', () => {
    // GET
    describe('/GET', () => {
        it('Token não informado (acesso negado)', (done) => {
            chai.request('http://localhost:3000')
                .get('/usuario')
                .end((err, res) => {
                    res.should.have.status(401);
                    res.body.should.have.property('message').eql("Você precisa informar o Token para acessar o recurso");
                    done();
                });
        });
        it('Token inválido (acesso negado)', (done) => {
            chai.request('http://localhost:3000')
                .get('/usuario')
                .set("x-access-token", "eyJhbGciOiJIUzI1NiIleGFtcGxlLmNvbSJ9XSG6WMmbMHJp3YiCKafMVtGY9VZjIc17WZMb2_k")
                .end((err, res) => {
                    res.should.have.status(401);
                    res.body.should.have.property('message').eql("Token inválido");
                    done();
                });
        });

        it('Token válido (lista usuários)', (done) => {
            chai.request('http://localhost:3000')
                .get('/usuario')
                .set("x-access-token", token_test)

                .end((err, res) => {
                    res.should.have.status(200);
                    res.body.should.be.an("array");
                    done();
                });

        });
    })

    //GET BY ID
    describe('/GET/:id', () => {
        it('Token não informado (acesso negado)', (done) => {
            chai.request('http://localhost:3000')
                .get('/usuario/1')
                .end((err, res) => {
                    res.should.have.status(401);
                    res.body.should.have.property('message').eql("Você precisa informar o Token para acessar o recurso");
                    done();
                });
        });

        it('Token inválido (acesso negado)', (done) => {
            chai.request('http://localhost:3000')
                .get('/usuario/1')
                .set("x-access-token", "eyJhbGciOiJIUzI1NiIleGFtcGxlLmNvbSJ9XSG6WMmbMHJp3YiCKafMVtGY9VZjIc17WZMb2_k")
                .end((err, res) => {
                    res.should.have.status(401);
                    res.body.should.have.property('message').eql("Token inválido");
                    done();
                });
        });

        it('Token válido (lista usuário)', (done) => {
            chai.request('http://localhost:3000')
                .get('/usuario/1')
                .set("x-access-token", token_test)

                .end((err, res) => {
                    res.should.have.status(200);
                    res.body.should.be.an("array");
                    done();
                });

        });

        it('Token válido (usuário não encontrado)', (done) => {
            chai.request('http://localhost:3000')
                .get('/usuario/100')
                .set("x-access-token", token_test)

                .end((err, res) => {
                    res.should.have.status(404);
                    res.body.message.should.be.an("string");
                    done();
                });

        });
    })


    // POST (cadastrar usuário /usuario/register)
    describe('/POST (Cadastro de usuário)', () => {

        it('Informações do usuário não informada', (done) => {
            chai.request('http://localhost:3000')
                .post('/usuario/register')
                .send({})
                .end((err, res) => {
                    res.should.have.status(400);
                    res.body.message.should.be.an("string")
                    res.body.erros.should.be.an("array")
                    done();
                });
        });

        it('Senha de confirmação não informado', (done) => {
            chai.request('http://localhost:3000')
                .post('/usuario/register')
                .send({
                    nome: "Jardel",
                    email: "jardel@example.com",
                    password: "123"
                })
                .end((err, res) => {
                    res.should.have.status(400);
                    res.body.message.should.be.an("string")
                    res.body.erros.should.be.an("array")
                    done();
                });
        });

        it('Senhas diferentes', (done) => {
            chai.request('http://localhost:3000')
                .post('/usuario/register')
                .send({
                    nome: "Jardel",
                    email: "jardel@example.com",
                    password: "123",
                    passwordConfirm: "1234"
                })
                .end((err, res) => {
                    res.should.have.status(400);
                    res.body.message.should.be.an("string")
                    res.body.erros.should.be.an("array")
                    done();
                });
        });

        it('Cadastrar usuário', (done) => {
            chai.request('http://localhost:3000')
                .post('/usuario/register')
                .send({
                    nome: "Jardel",
                    email: "jardel@example.com",
                    password: "123",
                    passwordConfirm: "123"
                })
                .end((err, res) => {
                    res.should.have.status(201);
                    res.body.message.should.be.an("string")
                    done();
                });
        });

        it('Email já cadastrado', (done) => {
            chai.request('http://localhost:3000')
                .post('/usuario/register')
                .send({
                    nome: "Jardel",
                    email: "jardel@example.com",
                    password: "123",
                    passwordConfirm: "123"
                })
                .end((err, res) => {
                    res.should.have.status(400);
                    res.body.message.should.be.an("string")
                    done();
                });
        });

        it('Nunhum dado do usuário informado na autenticação', (done) => {
            chai.request('http://localhost:3000')
                .post('/usuario/auth')
                .send({})
                .end((err, res) => {
                    res.should.have.status(400);
                    res.body.message.should.be.an("string")
                    done();
                });
        });
        it('Email não informado na autenticação', (done) => {
            chai.request('http://localhost:3000')
                .post('/usuario/auth')
                .send({
                    password: "123"
                })
                .end((err, res) => {
                    res.should.have.status(400);
                    res.body.message.should.be.an("string")
                    done();
                });
        });
        it('Senha não informada na autenticação', (done) => {
            chai.request('http://localhost:3000')
                .post('/usuario/auth')
                .send({
                    email: "jardel@example.com"
                })
                .end((err, res) => {
                    res.should.have.status(400);
                    res.body.message.should.be.an("string")
                    done();
                });
        });

        it('Autenticando usuário', (done) => {
            chai.request('http://localhost:3000')
                .post('/usuario/auth')
                .send({
                    email: "jardel@example.com",
                    password: "123"
                })
                .end((err, res) => {
                    res.should.have.status(200);
                    res.body.usuario.should.be.an("array")
                    res.body.token.should.be.an("string")
                    id = res.body.usuario[0].id
                    done();
                });
        });
    })


    // PUT
    describe('/PUT/:id', () => {
        it('Token não informado', (done) => {
            chai.request('http://localhost:3000')
                .put('/usuario/1')
                .send({
                    nome: "Jardel",
                    password: "12345"
                })
                .end((err, res) => {
                    res.should.have.status(401);
                    res.body.should.have.property('message').eql("Você precisa informar o Token para acessar o recurso");
                    done();
                });
        });
        it('Token inválido', (done) => {

            chai.request('http://localhost:3000')
                .put('/usuario/1')
                .send({
                    nome: "Jardel",
                    password: "12345"
                })
                .set("x-access-token", "eyJhbGciOiJIUzI1NiIleGFtcGxlLmNvbSJ9XSG6WMmbMHJp3YiCKafMVtGY9VZjIc17WZMb2_k")
                .end((err, res) => {
                    res.should.have.status(401);
                    res.body.should.have.property('message').eql("Token inválido");
                    done();
                });
        });

        it('Usuário não existe', (done) => {

            chai.request('http://localhost:3000')
                .put('/usuario/100')
                .set("x-access-token", token_test)
                .end((err, res) => {
                    res.should.have.status(404);
                    res.body.message.should.be.an("string");
                    done();
                });
        });

        it('Nenhum dado informado', (done) => {

            chai.request('http://localhost:3000')
                .put('/usuario/'+id)
                .send({})
                .set("x-access-token", token_test)
                .end((err, res) => {
                    res.should.have.status(400);
                    res.body.message.should.be.an("string");
                    done();
                });
        });

        it('Alterar nome do usuario', (done) => {

            chai.request('http://localhost:3000')
                .put('/usuario/'+id)
                .send({nome: "X-Bacon"})
                .set("x-access-token", token_test)
                .end((err, res) => {
                    res.should.have.status(201);
                    res.body.message.should.be.an("string");
                    done();
                });
        });

        it('Alterar senha do usuario', (done) => {

            chai.request('http://localhost:3000')
                .put('/usuario/'+id)
                .send({password: "era uma vez"})
                .set("x-access-token", token_test)
                .end((err, res) => {
                    res.should.have.status(201);
                    res.body.message.should.be.an("string");
                    done();
                });
        });
    })

    // DELETE
    describe('/DELETE/:id', () => {
        it('Token não informado', (done) => {
            chai.request('http://localhost:3000')
                .del('/usuario/1')
                .end((err, res) => {
                    res.should.have.status(401);
                    res.body.should.have.property('message').eql("Você precisa informar o Token para acessar o recurso");
                    done();
                });
        });
        it('Token inválido', (done) => {
            chai.request('http://localhost:3000')
                .del('/usuario/1')
                .set("x-access-token", "eyJhbGciOiJIUzI1NiIleGFtcGxlLmNvbSJ9XSG6WMmbMHJp3YiCKafMVtGY9VZjIc17WZMb2_k")
                .end((err, res) => {
                    res.should.have.status(401);
                    res.body.should.have.property('message').eql("Token inválido");
                    done();
                });
        });

        it('Usuário não existe', (done) => {

            chai.request('http://localhost:3000')
                .del('/usuario/100')
                .set("x-access-token", token_test)
                .end((err, res) => {
                    res.should.have.status(404);
                    res.body.message.should.be.an("string");
                    done();
                });
        });

        it('Usuário removido', (done) => {

            chai.request('http://localhost:3000')
                .del('/usuario/' + id)
                .set("x-access-token", token_test)
                .end((err, res) => {
                    res.should.have.status(202);
                    res.body.message.should.be.an("string");
                    done();
                });
        });
    })

});

/*

it('Testando Token não informado', (done) => {
    chai.request('http://localhost:3000') // Endereço do servidor
        .get('/usuario') // endpoint que vamos testar
        .set("x-access-token","eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c3VhcmlvIjpbeyJpZCI6NCwibm9tZSI6Inh0dWRvIiwiZW1haWwiOiJqYXJkZWwxMEBleGFtcGxlLmNvbSJ9XSwiaWF0IjoxNTQ1MTc5MDY2fQ.SOsLYsG6WMmbMHJp3YiCKafMVtGY9VZjIc17WZMb2_k")
        .end((err, res) => { // testes a serem realizados
            res.should.have.status(200); // verificando se o retorno e um status code 200
            res.body.should.be.an('array');
            done();
        });
});
*/