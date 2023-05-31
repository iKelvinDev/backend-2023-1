const express = require('express');
const formidable = require('formidable');

const app = express();
const port = 3000;

app.get('/', (req, res) => {
    res.send('Servidor funcionando...');
});

app.post('/arquivo', (req, res) => {
    res.send('Arquivo gravado com sucesso');
});

app.listen(port, () => {
    console.log(`Servidor funcionando na porta ${port}`);
});