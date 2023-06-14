const express = require('express');
const mysql = require('mysql');
const app = express();

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

// Rota para buscar os usuários
app.get('/users', (req, res) => {
    connection.query('SELECT * FROM TbUsers', (err, rows) => {
        if (err) {
            console.error('Erro ao executar a consulta:', err);
            return;
        }
        res.json(rows);
    });
});

// Inicia o servidor
app.listen(3000, () => {
    console.log('Servidor está rodando na porta 3000');
});
