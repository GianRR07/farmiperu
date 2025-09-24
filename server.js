import express from 'express';
import sqlite3 from 'sqlite3';
import cors from 'cors';

const app = express();
const port = 3001;

app.use(cors());
app.use(express.json());

// Conexión a la base de datos SQLite
const db = new sqlite3.Database('./database.db', (err) => {
  if (err) {
    console.error('Error al conectar con la base de datos', err);
  } else {
    console.log('Conectado a la base de datos SQLite');
  }
});

// Eliminar la tabla si existe y crearla nuevamente
db.run(`DROP TABLE IF EXISTS usuarios`, (err) => {
  if (err) {
    console.error('Error al eliminar la tabla', err);
  } else {
    console.log('Tabla usuarios eliminada (si existía)');
  }

  // Crear tabla con el nuevo campo 'rol'
  db.run(`
    CREATE TABLE IF NOT EXISTS usuarios (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      nombre TEXT,
      dni TEXT UNIQUE,
      email TEXT UNIQUE,
      password TEXT,
      rol TEXT DEFAULT 'cliente'
    )
  `, (err) => {
    if (err) {
      console.error('Error al crear la tabla', err);
    } else {
      console.log('Tabla de usuarios creada correctamente');

      // Crear usuario admin
      const insertAdmin = `
        INSERT OR IGNORE INTO usuarios (nombre, dni, email, password, rol)
        VALUES ('admin', '11111111', 'admin@admin.com', 'admin1.', 'admin')
      `;

      db.run(insertAdmin, (err) => {
        if (err) {
          console.error('Error al insertar el usuario admin', err);
        } else {
          console.log('Usuario admin creado correctamente');
        }
      });

      // Crear usuario de prueba
      const insertPrueba = `
        INSERT OR IGNORE INTO usuarios (nombre, dni, email, password, rol)
        VALUES ('prueba', '22222222', 'prueba@prueba.com', 'prueba1.', 'cliente')
      `;

      db.run(insertPrueba, (err) => {
        if (err) {
          console.error('Error al insertar el usuario de prueba', err);
        } else {
          console.log('Usuario de prueba creado correctamente');
        }
      });
    }
  });
});

// Obtener todos los usuarios
app.get('/usuarios', (req, res) => {
  const query = 'SELECT * FROM usuarios';
  db.all(query, [], (err, rows) => {
    if (err) {
      return res.status(500).send('Error al obtener los usuarios');
    }
    res.status(200).json(rows);
  });
});

// Ruta de registro
app.post('/registro', (req, res) => {
  const { nombre, dni, email, password, rol } = req.body;

  if (!nombre || !dni || !email || !password) {
    return res.status(400).send('Todos los campos son requeridos');
  }

  const rolFinal = rol || 'cliente';

  const query = 'INSERT INTO usuarios (nombre, dni, email, password, rol) VALUES (?, ?, ?, ?, ?)';
  db.run(query, [nombre, dni, email, password, rolFinal], function (err) {
    if (err) {
      if (err.message.includes('UNIQUE constraint failed: usuarios.email')) {
        return res.status(409).send('El correo ya está registrado');
      }
      if (err.message.includes('UNIQUE constraint failed: usuarios.dni')) {
        return res.status(409).send('El DNI ya está registrado');
      }
      return res.status(500).send('Error al registrar el usuario');
    }

    res.status(201).send({ message: 'Usuario registrado correctamente' });
  });
});

// ✅ Ruta de login actualizada para devolver más info
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

    // ✅ Devuelve nombre, rol y mensaje
    res.status(200).json({
      message: 'Login exitoso',
      nombre: row.nombre,
      rol: row.rol,
      dni: row.dni, // opcional
      email: row.email // opcional
    });
  });
});


// Crear tabla de productos
db.run(`
  CREATE TABLE IF NOT EXISTS productos (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    nombre TEXT,
    descripcion TEXT,
    precio REAL,
    presentacion TEXT,
    imagen TEXT
  )
`, (err) => {
  if (err) {
    console.error('Error al crear la tabla de productos', err);
  } else {
    console.log('Tabla de productos creada correctamente');
  }
});




// Ruta para registrar productos
app.post('/productos', (req, res) => {
  const { nombre, descripcion, precio, presentacion, imagen } = req.body;

  if (!nombre || !descripcion || !precio || !presentacion || !imagen) {
    return res.status(400).send('Todos los campos son requeridos');
  }

  const query = `
    INSERT INTO productos (nombre, descripcion, precio, presentacion, imagen)
    VALUES (?, ?, ?, ?, ?)
  `;

  db.run(query, [nombre, descripcion, precio, presentacion, imagen], function (err) {
    if (err) {
      console.error(err);
      return res.status(500).send('Error al registrar el producto');
    }

    res.status(201).send({ message: 'Producto registrado correctamente' });
  });
});

// Ya está creada la tabla productos
app.get('/productos', (req, res) => {
  const query = 'SELECT * FROM productos';
  db.all(query, [], (err, rows) => {
    if (err) {
      return res.status(500).send('Error al obtener los productos');
    }
    res.status(200).json(rows);
  });
});



// Eliminar un producto por ID
app.delete('/productos/:id', (req, res) => {
  const { id } = req.params;

  const query = 'DELETE FROM productos WHERE id = ?';
  db.run(query, [id], function (err) {
    if (err) {
      return res.status(500).send('Error al eliminar el producto');
    }

    if (this.changes === 0) {
      return res.status(404).send('Producto no encontrado');
    }

    res.status(200).send('Producto eliminado correctamente');
  });
});




// Ruta de prueba
app.get('/', (req, res) => {
  res.send('¡Backend funcionando correctamente!');
});

// Iniciar servidor
app.listen(port, () => {
  console.log(`Servidor Express corriendo en http://localhost:${port}`);
});
