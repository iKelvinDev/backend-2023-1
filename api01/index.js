const express = require('express');
const mysql = require('mysql');
const jwt = require('jsonwebtoken');

const app = express();
const port = 3000;
app.use(express.json());
const MinhaSenha = 'ifrn2@23';

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

// metodo de autenticacao
app.post('/login', (req, res) => {
  if(req.body.usuario === 'kelvin' && req.body.senha === '123'){
  const id = 1;
  const nome = "Kelvin Marques"
  const grupo = "Admin"
  const token = jwt.sign({ id, nome, grupo }, MinhaSenha, {
    expiresIn: 60 // expires in 5min (300 segundos ==> 5 x 60)
  });
  res.json({ auth: true, token: token });
  }
  else {
    res.status(403).json({message: 'Login inválido!'});
  }
});

function verificarToken(req, res, next){
  const token = req.headers['x-access-token'];
  if (!token) {
    res.status(401).json({ auth: false, message: 'Nenhum token de autenticação informado.' });
  }
  else {
    jwt.verify(token, MinhaSenha, function(err, decoded) {
      if (err) {
        res.status(500).json({ auth: false, message: 'Token inválido.' });
      }
      else {
      console.log('Metodo acessado por ' + decoded.nome)
      next();
      }
    });
  }
}

app.get('/', (req, res) => {
  res.send('Hello World!');
});

app.get('/alunos', (req, res) => {
  res.send('{"nome":"Marcelo"}');
});

app.post('/alunos', (req, res) => {
  res.send('Executou um post');
});

app.get('/alunos/:id', (req, res) => {
  const id = req.params.id;
  if (id <= 10) {
    res.status(200).send('Aluno localizado com sucesso');
  } else {
    res.status(404).send('Aluno não encontrado');
  }
});

app.get('/autor', verificarToken, (req, res) => {
  con.query('SELECT * FROM tbAutor', (erroComandoSQL, result, fields) => {
    if (erroComandoSQL) {
      throw erroComandoSQL;
    }
    res.status(200).send(result);
  });
});

app.get('/autor/:id', (req, res) => {
  const idAutor = req.params.id;
  const sql = 'SELECT * FROM tbAutor WHERE IdAutor = ?';
  con.query(sql, [idAutor], (erroComandoSQL, result, fields) => {
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

app.delete('/autor/:id', (req, res) => {
  const idAutor = req.params.id;
  const sql = 'DELETE FROM tbAutor WHERE IdAutor = ?';
  con.query(sql, [idAutor], (erroComandoSQL, result, fields) => {
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

app.post('/autor', (req, res) => {
  const noautor = req.body.noautor;
  const idnacionalidade = req.body.idnacionalidade;

  const sql = 'INSERT INTO tbAutor (NoAutor, IdNacionalidade) VALUES (?, ?)';
  con.query(sql, [noautor, idnacionalidade], (erroComandoSQL, result, fields) => {
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

app.put('/autor/:id', (req, res) => {
  const idautor = req.params.id;
  const noautor = req.body.noautor;
  const idnacionalidade = req.body.idnacionalidade;

  const sql = 'UPDATE tbAutor SET NoAutor = ?, IdNacionalidade = ? WHERE IdAutor = ?';
  con.query(sql, [noautor, idnacionalidade, idautor], (erroComandoSQL, result, fields) => {
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

/* Editora */

app.get('/editora', (req, res) => {
  con.query('SELECT * FROM tbEditora', (erroComandoSQL, result, fields) => {
    if (erroComandoSQL) {
      throw erroComandoSQL;
    }
    res.status(200).send(result);
  });
});

app.get('/editora/:id', (req, res) => {
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

app.delete('/editora/:id', (req, res) => {
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

app.post('/editora', (req, res) => {
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

app.put('/editora/:id', (req, res) => {
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

app.listen(port, () => {
  console.log(`Example app listening on port ${port}`);
});
