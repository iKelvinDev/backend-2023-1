const express = require('express');
const router = express.Router();
const mysql = require('mysql');

var con = mysql.createConnection({
    host: 'localhost',
    user: 'root',
    password: '',
    database: 'dbbiblioteca',
});

con.connect((erroConexao) => {
    if (erroConexao) {
        throw erroConexao;
    }
});

router.get('/', (req, res) => {
    con.query('SELECT * FROM tbEditora', (erroComandoSQL, result, fields) => {
        if (erroComandoSQL) {
            throw erroComandoSQL;
        }
        res.status(200).send(result);
    });
});

router.get('/:id', (req, res) => {
    const idEditora = req.params.id;
    const sql = 'SELECT * FROM tbEditora WHERE IdEditora = ?';
    con.query(sql, [idEditora], (erroComandoSQL, result, fields) => {
        if (erroComandoSQL) {
            throw erroComandoSQL;
        }

        if (result.length > 0) {
            res.status(200).send(result);
        }
        else {
            res.status(404).send('Não encontrado');
        }
    });
});

router.delete('/:id', (req, res) => {
    const idEditora = req.params.id;
    const sql = 'DELETE FROM tbEditora WHERE IdEditora = ?';
    con.query(sql, [idEditora], (erroComandoSQL, result, fields) => {
        if (erroComandoSQL) {
            throw erroComandoSQL;
        }

        if (result.affectedRows > 0) {
            res.status(200).send('Registro excluído com sucesso');
        }
        else {
            res.status(404).send('Não encontrado');
        }
    });
});

router.post('/', (req, res) => {
    const noeditora = req.body.noeditora;
    const ideditora = req.body.ideditora;

    const sql = 'INSERT INTO tbEditora (NoEditora, IdEditora) VALUES (?, ?)';
    con.query(sql, [noeditora, ideditora], (erroComandoSQL, result, fields) => {
        if (erroComandoSQL) {
            throw erroComandoSQL;
        }

        if (result.affectedRows > 0) {
            res.status(200).send('Registro incluído com sucesso');
        }
        else {
            res.status(400).send('Erro ao incluir o registro');
        }
    });
});

router.put('/:id', (req, res) => {
    const ideditora = req.params.id;
    const noeditora = req.body.noeditora;

    const sql = 'UPDATE tbEditora SET NoEditora = ?, IdEditora = ? WHERE IdEditora = ?';
    con.query(sql, [noeditora, ideditora], (erroComandoSQL, result, fields) => {
        if (erroUpdate) {
            throw erroUpdate;
        }

        if (result.affectedRows > 0) {
            res.status(200).send('Registro alterado com sucesso');
        }
        else {
            res.status(400).send('Registro não encontrado');
        }
    });
});

module.exports = router;