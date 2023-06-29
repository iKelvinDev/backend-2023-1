const express = require('express');
const mysql = require('mysql');
const cors = require('cors');
const jwt = require('jsonwebtoken');
const crypto = require('crypto');
const formidable = require('formidable');
const fs = require('fs');

const bodyParser = require('body-parser');

const app = express();
app.use(cors());
app.use(bodyParser.json());

const senhaToken = 'IFRN2@23';

// Configuração da conexão com o Banco de Dados MySQL
const connection = mysql.createConnection({
    host: 'localhost',
    user: 'root',
    password: '',
    database: 'exercicio_backend'
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
    return jwt.sign(payload, senhaToken, { expiresIn: 60 * 10, }); // expires in 5min
}

function verificarToken(req, res, next) {
    const token = req.headers['x-acess-token'];
    if (!token) {
        return res.status(401).json({ mensagemErro: 'Usuário não autenticado. Faça login antes de chamar este recurso.' });
    }
    else {
        jwt.verify(token, senhaToken, (error, decoded) => {
            if (error) {
                return res.status(403).json({ mensagemErro: 'Token inválido. Faça login novamente.' });
            }
            else {
                const userName = decoded.userName
                console.log(`Usuário ${userName} autenticado com sucesso.`);
                next();
            }
        });
    }
}

function encriptarSenha(senha) {
    const hash = crypto.createHash('sha256');
    hash.update(senha + senhaToken);
    return hash.digest('hex');
}

// Rota de login
app.post('/login', (req, res) => {
    const loginName = req.body.loginName;
    const password = encriptarSenha(req.body.password);
    connection.query('SELECT UserName FROM TbUsers WHERE LoginName = ? AND Password = ?',
        [loginName, password], (error, rows) => {
            if (error) {
                console.log('Erro ao processar o comando SQL.',);
            }
            else {
                if (rows.length > 0) {
                    const payload = { userName: rows[0].userName };
                    const token = gerarToken(payload);
                    res.json({ acessToken: token });
                }
                else {
                    res.status(403).json({ messageErro: 'Login Inválido!' });
                }
            }
        });
});

// Rota para buscar os usuários
app.get('/users', verificarToken, (req, res) => {
    connection.query('SELECT CodUser, UserName, LoginName FROM TbUsers', (err, rows) => {
        if (err) {
            console.error('Erro ao executar a consulta:', err);
            return;
        }
        res.json(rows);
    });
});

// Rota para buscar os usuários por id
app.get('/users/:id', verificarToken, (req, res) => {
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

// Rota para criar usuário
app.post('/users', (req, res) => {
    const userName = req.body.userName
    const loginName = req.body.loginName;
    const password = encriptarSenha(req.body.password);
    connection.query('INSERT INTO TbUsers (UserName, LoginName, Password) VALUES(?,?,?)',
        [userName, loginName, password], (error, rows) => {
            if (error) {
                console.log('Erro ao processar o comando SQL.', error.message);
            }
            else {
                res.status(201).json({ messageErro: 'Usuário cadastrado com sucesso!' });
            }
        });
});

app.get('/photo/:id', (req, res) => {
    const id = req.params['id'];
    const sql = 'SELECT photo FROM TbUsers WHERE CodUser = ?';
    connection.query(sql, [id], (err, result) => {
        if (err) {
            throw err;
        }

        if (result.length > 0) {
            const photo = result[0].photo;
            const fs = require('fs');
            fs.writeFileSync('foto.jpg', photo);
            //console.log('Imagem recuperada e salva com sucesso!');
            res.writeHead(200, { 'Content-Type': 'image/jpeg' });
            res.end(photo, 'binary');
        } else {
            console.log('Nenhuma imagem encontrada com o ID fornecido.');
            res.status(404).json({ mensagem: 'Nenhuma imagem encontrada' });
        }
    });
});

app.put('/photo/:id', (req, res) => {
    const id = req.params['id'];
    const form = new formidable.IncomingForm();
    form.parse(req, (err, fields, files) => {
        if (err) {
            next(err);
        } else {
            const caminhoOriginal = files.arquivo[0].filepath;
            console.log(caminhoOriginal);
            const image = fs.readFileSync(caminhoOriginal);
            const sql = 'UPDATE TbUsers SET photo = ? WHERE CodUser = ?';
            connection.query(sql, [image, id], (err, result) => {
                if (err) {
                    res
                        .status(400)
                        .json({ mensagem: `Erro ao gravar mensagem. Erro: ${err.message}` });
                    throw err;
                } else {
                    //console.log('Imagem gravada com sucesso!');
                    res.status(200).json({ mensagem: 'Imagem gravada com sucesso.' });
                }
            });
        }
    });
});

// Inicia o servidor
app.listen(3000, () => {
    console.log('Servidor está rodando na porta 3000');
});
