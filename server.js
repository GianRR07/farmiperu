const express = require('express');
const sqlite3 = require('sqlite3').verbose();
const cors = require('cors'); // Importar cors
const app = express();
const port = 3001;

// Usar CORS para permitir solicitudes desde cualquier origen
app.use(cors());

// Middleware para manejar JSON
app.use(express.json());

// Conectar con la base de datos SQLite
const db = new sqlite3.Database('./database.db', (err) => {
  if (err) {
    console.error('Error al conectar con la base de datos', err);
  } else {
    console.log('Conectado a la base de datos SQLite');
  }
});

// Crear tabla de usuarios si no existe
db.run(`
  CREATE TABLE IF NOT EXISTS usuarios (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    email TEXT UNIQUE,
    password TEXT
  )
`, (err) => {
  if (err) {
    console.error('Error al crear la tabla', err);
  } else {
    console.log('Tabla de usuarios creada o ya existe');
  }
});

// Ruta para registrar un nuevo usuario
app.post('/registro', (req, res) => {
  const { email, password } = req.body;

  if (!email || !password) {
    return res.status(400).send('Email y contraseña son requeridos');
  }

  const query = 'INSERT INTO usuarios (email, password) VALUES (?, ?)';
  db.run(query, [email, password], function (err) {
    if (err) {
      return res.status(500).send('Error al registrar el usuario');
    }
    res.status(201).send({ message: 'Usuario registrado correctamente' });
  });
});

// Ruta para iniciar sesión
app.post('/login', (req, res) => {
  const { email, password } = req.body;

  if (!email || !password) {
    return res.status(400).send('Email y contraseña son requeridos');
  }

  const query = 'SELECT * FROM usuarios WHERE email = ?';
  db.get(query, [email], (err, row) => {
    if (err) {
      return res.status(500).send('Error al verificar las credenciales');
    }

    if (!row || row.password !== password) {
      return res.status(401).send('Credenciales incorrectas');
    }

    res.status(200).send({ message: 'Login exitoso' });
  });
});

app.listen(port, () => {
  console.log(`Servidor Express corriendo en http://localhost:${port}`);
});
