const express = require('express');
const mysql = require('mysql');
const app = express();
const jwt = require('jsonwebtoken');
const cors = require('cors');
const bodyParser = require('body-parser');

// Configuração da conexão com o Banco de Dados MySQL
const connection = mysql.createConnection({
    host:'localhost',
    user:'root',
    password:'',
    database:'exercicio_backend'
});

// Conecta-se ao Banco de Dados
connection.connect((err) => {
    if (err) {
        console.error('Erro ao conectar ao Banco de Dados:', err);
        return;
    }
    console.log('Conectado ao Banco de Dados MySQL');
});

function gerarToken(payload) {
    const senhaToken = 'kelvin123';
    return jwt.sign(payload, senhaToken, {expiresIn: 20});
};

// Rota de login
app.post('/login', (req,res) => {
    const loginname = req.body.loginname;
    const password = req.body.password;
    connection.query('SELECT UserName FROM TbUsers WHERE loginName = ? AND password = ?', 
    [loginname, password], (error, rows) => {
        if(error) {
            console.log('Erro ao processar o comando SQL.', )
        }
        else {
            if(rows.length > 0) {
                const payload = {noUsuario: rows[0].nomeUsuario};
                const token = gerarToken(payload);
                res.json({ acessToken: token});
            }
            else {
                res.status(403).json({ messageErro: 'Login Inválido!' });
            }
            
        }        
    });
});

// Rota para buscar os usuários
app.get('/users', (req, res) => {
    connection.query('SELECT CodUser, UserName, LoginName FROM TbUsers', (err, rows) => {
        if (err) {
            console.error('Erro ao executar a consulta:', err);
            return;
        }
        res.json(rows);
    });
});

// Rota para buscar os usuários por id
app.get('/users:id', (req, res) => {
    const id = req.params['id'];
    connection.query('SELECT CodUser, UserName, LoginName FROM TbUsers WHERE CodUser = ?',
    [id], (err, rows) => {
        if (err) {
            console.error('Erro ao executar a consulta:', err);
            return;
        }
        res.json(rows[0]);
    });
});

// Inicia o servidor
app.listen(3000, () => {
    console.log('Servidor está rodando na porta 3000');
});
