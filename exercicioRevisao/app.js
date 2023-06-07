const express = require('express');
const mysql = require('mysql');
const app = express();

// Configuração da conexão com o Banco de Dados MySQL
const connection = mysql.createConnection({
    host:'localhost',
    user:'root',
    password:'',
    database:'users'
});

// Conecta-se ao Banco de Dados
connection.connect((err) => {
    if (err) {
        console.error('Erro ao conectar ao Banco de Dados:', err);
        return;
    }
    console.log('Conectado ao Banco de Dados MySQL');
});

