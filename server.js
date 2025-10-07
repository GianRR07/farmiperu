import express from 'express';
import sqlite3 from 'sqlite3';
import cors from 'cors';

const app = express();
const port = 3001;

app.use(cors());
app.use(express.json());

const db = new sqlite3.Database('./database.db', (err) => {
  if (err) {
    console.error('Error al conectar con la base de datos', err);
  } else {
    console.log('Conectado a la base de datos SQLite');
  }
});

//db.run(`DROP TABLE IF EXISTS usuarios`, (err) => {
//if (err) {
//console.error('Error al eliminar la tabla', err);
//} else {
//console.log('Tabla usuarios eliminada (si existía)');
//}

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
//});

app.get('/usuarios', (req, res) => {
  const query = 'SELECT * FROM usuarios';
  db.all(query, [], (err, rows) => {
    if (err) {
      return res.status(500).send('Error al obtener los usuarios');
    }
    res.status(200).json(rows);
  });
});

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

    res.status(200).json({
      message: 'Login exitoso',
      nombre: row.nombre,
      rol: row.rol,
      dni: row.dni,
      email: row.email
    });
  });
});


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

db.run(`
  CREATE TABLE IF NOT EXISTS pedidos (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    paypal_order_id TEXT,
    total_pen REAL,
    total_usd REAL,
    moneda_paypal TEXT,
    estado TEXT,
    fecha TEXT,
    -- identidad si hay sesión
    usuario_email TEXT,
    usuario_dni TEXT,
    -- identidad si es guest
    guest_nombre TEXT,
    guest_email TEXT,
    guest_telefono TEXT,
    guest_dni TEXT,
    -- respaldo PayPal
    paypal_payer_id TEXT,
    paypal_payer_email TEXT,
    shipping_address_json TEXT
  )
`, (err) => {
  if (err) console.error('Error al crear tabla pedidos', err);
  else console.log('Tabla pedidos creada correctamente');
});

db.run(`
  CREATE TABLE IF NOT EXISTS pedido_items (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    pedido_id INTEGER,
    producto_id INTEGER,
    nombre TEXT,
    precio_pen REAL,
    qty INTEGER,
    FOREIGN KEY (pedido_id) REFERENCES pedidos(id)
)
`, (err) => {
  if (err) console.error('Error al crear tabla pedido_items', err);
  else console.log('Tabla pedido_items creada correctamente');
});





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


app.get('/productos', (req, res) => {
  const query = 'SELECT * FROM productos';
  db.all(query, [], (err, rows) => {
    if (err) {
      return res.status(500).send('Error al obtener los productos');
    }
    res.status(200).json(rows);
  });
});

app.put('/productos/:id', (req, res) => {
  const { id } = req.params;
  const { nombre, descripcion, precio, presentacion, imagen } = req.body;

  if (!nombre || !descripcion || !precio || !presentacion || !imagen) {
    return res.status(400).send('Todos los campos son requeridos');
  }

  const query = `
    UPDATE productos
    SET nombre = ?, descripcion = ?, precio = ?, presentacion = ?, imagen = ?
    WHERE id = ?
  `;
  db.run(query, [nombre, descripcion, precio, presentacion, imagen, id], function (err) {
    if (err) {
      console.error('Error al actualizar producto:', err);
      return res.status(500).send('Error al actualizar el producto');
    }
    if (this.changes === 0) {
      return res.status(404).send('Producto no encontrado');
    }
    res.status(200).send({ message: 'Producto actualizado correctamente' });
  });
});



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




app.get('/', (req, res) => {
  res.send('¡Backend funcionando correctamente!');
});

app.post('/orders', (req, res) => {
  try {
    const {
      paypalOrderId,
      items,                // [{id, nombre, precio, qty}] en S/
      totalPEN,
      totalUSD,
      paypalCurrency = 'USD',
      estado = 'aprobado',

      // identidad desde tu app (si hay sesión)
      usuarioEmail,
      usuarioDni,

      // identidad guest (si no hay sesión)
      guestNombre,
      guestEmail,
      guestTelefono,
      guestDni,

      // respaldo PayPal
      paypalPayerId,
      paypalPayerEmail,
      shippingAddressJson
    } = req.body;

    if (!paypalOrderId || !Array.isArray(items) || items.length === 0) {
      return res.status(400).json({ error: 'Datos de pedido incompletos' });
    }

    const fecha = new Date().toISOString();

    db.run(
      `INSERT INTO pedidos (
        paypal_order_id, total_pen, total_usd, moneda_paypal, estado, fecha,
        usuario_email, usuario_dni,
        guest_nombre, guest_email, guest_telefono, guest_dni,
        paypal_payer_id, paypal_payer_email, shipping_address_json
      ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`,
      [
        paypalOrderId, totalPEN ?? null, totalUSD ?? null, paypalCurrency, estado, fecha,
        usuarioEmail ?? null, usuarioDni ?? null,
        guestNombre ?? null, guestEmail ?? null, guestTelefono ?? null, guestDni ?? null,
        paypalPayerId ?? null, paypalPayerEmail ?? null, shippingAddressJson ?? null
      ],
      function (err) {
        if (err) {
          console.error('Error insertando pedido:', err);
          return res.status(500).json({ error: 'No se pudo guardar el pedido' });
        }
        const pedidoId = this.lastID;

        const stmt = db.prepare(
          `INSERT INTO pedido_items (pedido_id, producto_id, nombre, precio_pen, qty)
           VALUES (?, ?, ?, ?, ?)`
        );
        for (const it of items) {
          stmt.run([pedidoId, it.id, it.nombre, Number(it.precio), Number(it.qty || 1)]);
        }
        stmt.finalize(e2 => {
          if (e2) {
            console.error('Error insertando items:', e2);
            return res.status(500).json({ error: 'No se pudo guardar los items' });
          }
          return res.status(201).json({ message: 'Pedido guardado', pedidoId });
        });
      }
    );
  } catch (e) {
    console.error(e);
    return res.status(500).json({ error: 'Error interno al guardar pedido' });
  }
});


// GET /reports/sales?granularity=day|week|month|year&start=YYYY-MM-DD&end=YYYY-MM-DD
app.get('/reports/sales', (req, res) => {
  const { granularity = 'day', start, end } = req.query;

  const where = [];
  const params = [];
  if (start) { where.push("date(fecha) >= date(?)"); params.push(start); }
  if (end) { where.push("date(fecha) <= date(?)"); params.push(end); }
  const whereSQL = where.length ? `WHERE ${where.join(' AND ')}` : '';

  let groupExpr;
  switch (granularity) {
    case 'day': groupExpr = `strftime('%Y-%m-%d', fecha)`; break;
    case 'week': groupExpr = `strftime('%Y', fecha) || '-W' || strftime('%W', fecha)`; break;
    case 'month': groupExpr = `strftime('%Y-%m', fecha)`; break;
    case 'year': groupExpr = `strftime('%Y', fecha)`; break;
    default: return res.status(400).json({ error: 'granularity inválida' });
  }

  const sql = `
    SELECT
      ${groupExpr} AS periodo,
      COUNT(*) AS pedidos,
      COALESCE(SUM(total_pen), 0) AS total_pen,
      COALESCE(SUM(total_usd), 0) AS total_usd
    FROM pedidos
    ${whereSQL}
    GROUP BY periodo
    ORDER BY periodo ASC
  `;

  db.all(sql, params, (err, rows) => {
    if (err) {
      console.error('Error generando reporte:', err);
      return res.status(500).json({ error: 'No se pudo generar el reporte' });
    }
    res.json(rows);
  });
});

app.get('/orders', (req, res) => {
  const { start, end, q = '', limit = 100, offset = 0 } = req.query;

  const where = [];
  const params = [];

  if (start) { where.push("date(fecha) >= date(?)"); params.push(start); }
  if (end) { where.push("date(fecha) <= date(?)"); params.push(end); }
  if (q) {
    // búsqueda por comprador, email, DNI o id de PayPal
    where.push(`(
      (usuario_email IS NOT NULL AND usuario_email LIKE ?)
      OR (usuario_dni IS NOT NULL AND usuario_dni LIKE ?)
      OR (guest_nombre IS NOT NULL AND guest_nombre LIKE ?)
      OR (guest_email IS NOT NULL AND guest_email LIKE ?)
      OR (guest_dni IS NOT NULL AND guest_dni LIKE ?)
      OR (paypal_order_id LIKE ?)
    )`);
    const like = `%${q}%`;
    params.push(like, like, like, like, like, like);
  }

  const whereSQL = where.length ? `WHERE ${where.join(' AND ')}` : '';
  const sqlOrders = `
    SELECT *
    FROM pedidos
    ${whereSQL}
    ORDER BY datetime(fecha) DESC
    LIMIT ? OFFSET ?
  `;
  params.push(Number(limit), Number(offset));

  db.all(sqlOrders, params, (err, orders) => {
    if (err) {
      console.error('Error consultando pedidos:', err);
      return res.status(500).json({ error: 'No se pudieron obtener los pedidos' });
    }
    if (!orders.length) {
      return res.json([]);
    }

    // Cargar items por lote
    const ids = orders.map(o => o.id);
    const placeholders = ids.map(() => '?').join(',');
    const sqlItems = `SELECT * FROM pedido_items WHERE pedido_id IN (${placeholders})`;

    db.all(sqlItems, ids, (err2, items) => {
      if (err2) {
        console.error('Error consultando items:', err2);
        return res.status(500).json({ error: 'No se pudieron obtener los ítems' });
      }

      const itemsByPedido = {};
      for (const it of items) {
        if (!itemsByPedido[it.pedido_id]) itemsByPedido[it.pedido_id] = [];
        itemsByPedido[it.pedido_id].push(it);
      }

      const enriched = orders.map(o => ({
        ...o,
        items: itemsByPedido[o.id] || []
      }));

      res.json(enriched);
    });
  });
});

// GET /orders/by-user?email=...&dni=...
// Devuelve los pedidos del usuario logueado (coincidencia exacta por email o DNI)
app.get('/orders/by-user', (req, res) => {
  const { email, dni, limit = 200, offset = 0 } = req.query;

  if (!email && !dni) {
    return res.status(400).json({ error: 'Se requiere email o dni' });
  }

  const where = [];
  const params = [];

  // Sólo pedidos de usuarios con sesión (no guest)
  where.push('(usuario_email IS NOT NULL OR usuario_dni IS NOT NULL)');

  if (email) { where.push('usuario_email = ?'); params.push(email); }
  if (dni)   { where.push('usuario_dni = ?');   params.push(dni); }

  const whereSQL = `WHERE ${where.join(' AND ')}`;

  const sqlOrders = `
    SELECT *
    FROM pedidos
    ${whereSQL}
    ORDER BY datetime(fecha) DESC
    LIMIT ? OFFSET ?
  `;
  params.push(Number(limit), Number(offset));

  db.all(sqlOrders, params, (err, orders) => {
    if (err) {
      console.error('Error consultando pedidos por usuario:', err);
      return res.status(500).json({ error: 'No se pudieron obtener los pedidos' });
    }
    if (!orders.length) return res.json([]);

    const ids = orders.map(o => o.id);
    const placeholders = ids.map(() => '?').join(',');
    const sqlItems = `SELECT * FROM pedido_items WHERE pedido_id IN (${placeholders})`;

    db.all(sqlItems, ids, (err2, items) => {
      if (err2) {
        console.error('Error consultando items:', err2);
        return res.status(500).json({ error: 'No se pudieron obtener los ítems' });
      }
      const itemsByPedido = {};
      for (const it of items) {
        if (!itemsByPedido[it.pedido_id]) itemsByPedido[it.pedido_id] = [];
        itemsByPedido[it.pedido_id].push(it);
      }
      const enriched = orders.map(o => ({ ...o, items: itemsByPedido[o.id] || [] }));
      res.json(enriched);
    });
  });
});

app.listen(port, () => {
  console.log(`Servidor Express corriendo en http://localhost:${port}`);
});
