const express = require('express');
const cookieParser = require("cookie-parser");
const sessions = require('express-session');
const http = require('http');
var parseUrl = require('body-parser');
const app = express();

var mysql = require('mysql');

let encodeUrl = parseUrl.urlencoded({ extended: false });

app.use(sessions({
    secret: "thisismysecrctekey",
    saveUninitialized:true,
    cookie: { maxAge: 1000 * 60 * 60 * 24 }, 
    resave: false
}));

app.use(cookieParser());

var con = mysql.createConnection({
    host: "localhost",
    user: "newuser",
    password: "Dede_0807",
    database: "cadastro"
});

app.get('/', (req, res) => {
    res.sendFile(__dirname + '/register.html');
})

app.post('/register', encodeUrl, (req, res) => {
    var nome = req.body.nome;
    var email = req.body.email;
    var cpf = req.body.cpf;
    var nascimento = req.body.nascimento;
    var telefone = req.body.telefone;
    var celular = req.body.celular;
    var cep = req.body.cep;
    var numero = req.body.numero;
    var rua = req.body.rua;
    var bairro = req.body.bairro;
    var cidade = req.body.cidade;
    var escola = req.body.escola;

    con.connect(function(err) {
        if (err){
            console.log(err);
        };
        // verificando se o usuário já existe
        con.query(`SELECT * FROM funcionario WHERE cpf  = '${cpf}'`, function(err, result){
            if(err){
                console.log(err);
            };
            if(Object.keys(result).length > 0){
                res.sendFile(__dirname + '/failReg.html');
            }else{
            //criando a página de usuário
            function userPage(){
                req.session.user = {
                    nome: nome,
                    email: email,
                    cpf: cpf,
                    nascimento: nascimento,
                    telefone: telefone,
                    celular: celular,
                    cep: cep,
                    numero: numero,
                    rua: rua,
                    bairro: bairro,
                    cidade: cidade,
                    escola: escola
                };

                res.send(`
                <!DOCTYPE html>
                <html lang="en">
                <head>
                    <title>Login and register form with Node.js, Express.js and MySQL</title>
                    <meta charset="UTF-8">
                    <meta name="viewport" content="width=device-width, initial-scale=1">
                    <link href="https://cdn.jsdelivr.net/npm/bootstrap@5.1.3/dist/css/bootstrap.min.css" rel="stylesheet">
                </head>
                <body>
                    <div class="container">
                        <h3>Hi, ${req.session.user.nome}</h3>
                        <a href="register.html">Voltar</a>
                    </div>
                </body>
                </html>
                `);
            }
                var sql = `INSERT INTO funcionario (nome, email, cpf, nascimento, telefone, celular, cep, numero, rua, bairro, cidade) VALUES ('${nome}', '${email}', '${cpf}', '${nascimento}', '${telefone}', '${celular}', '${cep}', '${numero}', '${rua}', '${bairro}', '${cidade}')`;
                var sql2 = `INSERT INTO escolas (escola) VALUES ('${escola}')`
                con.query(sql, sql2, function (err, result) {
                    if (err){
                        console.log(err);
                    }else{
                        userPage();
                    };
                });

        }

    });
});


});

app.listen(4000, ()=>{
console.log("http://localhost:4000/");
});
