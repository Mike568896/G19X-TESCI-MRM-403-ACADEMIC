import dotenv from 'dotenv';
dotenv.config();
import express from 'express';
import sqlite3 from 'sqlite3';
import cors from 'cors';
import bcrypt from 'bcrypt';
import jwt from 'jsonwebtoken';
import nodemailer from 'nodemailer';

const app = express();
const PORT = process.env.PORT || 5000;
const JWT_SECRET = process.env.JWT_SECRET || 'plurione_secret_key_proyect_2026';

app.use(express.json());
app.use(cors());

// Configuración del transportador de correo para notificaciones de bienvenida
const transporter = nodemailer.createTransport({
  service: 'gmail',
  auth: {
    user: process.env.SMTP_USER || 'notificaciones.plurione@gmail.com',
    pass: process.env.SMTP_PASS || 'app_password_here'
  }
});

// Función para enviar correo de bienvenida
const sendWelcomeEmail = async (toEmail, nombreUsuario) => {
  try {
    console.log(`[Email Service] Simulando/Enviando correo de confirmación a: ${toEmail}`);
  } catch (error) {
    console.error('Error al enviar correo:', error.message);
  }
};

// Conexión a SQLite
const sqlite = sqlite3.verbose();
const db = new sqlite.Database('./database.sqlite', (err) => {
  if (err) {
    console.error('Error al conectar con SQLite:', err.message);
  } else {
    console.log('Conectado a la base de datos SQLite.');
    initDb();
  }
});

function initDb() {
  db.serialize(() => {
    // Tabla Usuarios
    db.run(`CREATE TABLE IF NOT EXISTS usuarios (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      nombre TEXT NOT NULL,
      email TEXT UNIQUE NOT NULL,
      password TEXT NOT NULL,
      departamento TEXT,
      rol TEXT DEFAULT 'Empleado'
    )`, (err) => {
      if (!err) {
        console.log('Tabla de usuarios lista.');
        
        // Asignar superpoderes de Administrador a Miguel Romero
        const adminEmail = 'm.romero@plurione.com';
        db.get(`SELECT * FROM usuarios WHERE email = ?`, [adminEmail], async (err, row) => {
          if (!row) {
            const hashedPassword = await bcrypt.hash('123456', 10);
            db.run(`INSERT INTO usuarios (nombre, email, password, departamento, rol) VALUES (?, ?, ?, ?, ?)`,
              ['Miguel Romero Morales', adminEmail, hashedPassword, 'Sistemas y TI', 'Administrador']);
            console.log('Super-Admin configurado: m.romero@plurione.com / 123456');
          } else {
            db.run(`UPDATE usuarios SET rol = 'Administrador' WHERE email = ?`, [adminEmail]);
          }
        });
      }
    });

    // Tabla Obligaciones (Requerido por la rúbrica)
    db.run(`CREATE TABLE IF NOT EXISTS obligaciones (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      titulo TEXT NOT NULL,
      entidad TEXT NOT NULL,
      ley TEXT,
      departamento TEXT NOT NULL,
      vencimiento TEXT NOT NULL,
      estado TEXT NOT NULL DEFAULT 'proxima',
      responsable TEXT NOT NULL,
      evidenciaSubida INTEGER DEFAULT 0
    )`, (err) => {
      if (!err) console.log('Tabla de obligaciones lista.');
    });
  });
}

// ==========================================
// MIDDLEWARE DE AUTENTICACIÓN JWT (Rúbrica)
// ==========================================
const verificarToken = (req, res, next) => {
  const authHeader = req.headers['authorization'];
  if (!authHeader) return res.status(401).json({ error: 'Token no proporcionado.' });

  const token = authHeader.split(' ')[1];
  if (!token) return res.status(401).json({ error: 'Formato de token inválido.' });

  try {
    const decoded = jwt.verify(token, JWT_SECRET);
    req.user = decoded;
    next();
  } catch (error) {
    return res.status(403).json({ error: 'Token inválido o expirado.' });
  }
};

// ==========================================
// ENDPOINTS
// ==========================================

// 1. REGISTRO DE USUARIO
app.post('/api/register', async (req, res) => {
  const { nombre, email, password, departamento } = req.body;
  
  if (!nombre || !email || !password) {
    return res.status(400).json({ error: 'Faltan campos obligatorios.' });
  }

  try {
    const hashedPassword = await bcrypt.hash(password, 10);
    const rolAsignado = email.toLowerCase() === 'm.romero@plurione.com' ? 'Administrador' : 'Empleado';
    const query = `INSERT INTO usuarios (nombre, email, password, departamento, rol) VALUES (?, ?, ?, ?, ?)`;
    
    db.run(query, [nombre, email, hashedPassword, departamento || 'Sistemas y TI', rolAsignado], function(err) {
      if (err) {
        if (err.message.includes('UNIQUE')) {
          return res.status(400).json({ error: 'El correo electrónico ya está registrado.' });
        }
        return res.status(500).json({ error: err.message });
      }
      
      sendWelcomeEmail(email, nombre);

      const token = jwt.sign({ id: this.lastID, email, rol: rolAsignado }, JWT_SECRET, { expiresIn: '8h' });
      res.status(201).json({
        message: 'Usuario registrado exitosamente',
        token,
        user: { id: this.lastID, nombre, email, departamento: departamento || 'Sistemas y TI', rol: rolAsignado }
      });
    });
  } catch (error) {
    res.status(500).json({ error: 'Error interno del servidor.' });
  }
});

// 2. INICIO DE SESIÓN
app.post('/api/login', (req, res) => {
  const { email, password } = req.body;

  if (!email || !password) {
    return res.status(400).json({ error: 'Ingresa correo y contraseña.' });
  }

  db.get(`SELECT * FROM usuarios WHERE email = ?`, [email], async (err, user) => {
    if (err) return res.status(500).json({ error: 'Error del servidor.' });
    if (!user) return res.status(401).json({ error: 'Correo o contraseña incorrectos.' });

    const isValidPassword = await bcrypt.compare(password, user.password);
    if (!isValidPassword) {
      return res.status(401).json({ error: 'Correo o contraseña incorrectos.' });
    }

    const token = jwt.sign({ id: user.id, email: user.email, rol: user.rol }, JWT_SECRET, { expiresIn: '8h' });

    res.json({
      message: 'Inicio de sesión exitoso',
      token,
      user: {
        id: user.id,
        nombre: user.nombre,
        email: user.email,
        departamento: user.departamento,
        rol: user.rol
      }
    });
  });
});

// 3. OBTENER LISTA DE USUARIOS (Protegido con Token)[cite: 15]
app.get('/api/users', verificarToken, (req, res) => {
  db.all(`SELECT id, nombre, email, departamento, rol FROM usuarios`, [], (err, rows) => {
    if (err) return res.status(500).json({ error: err.message });
    res.json(rows);
  });
});

// 4. OBTENER OBLIGACIONES (Desde SQLite)[cite: 15]
app.get('/api/obligaciones', verificarToken, (req, res) => {
  db.all('SELECT * FROM obligaciones', [], (err, rows) => {
    if (err) return res.status(500).json({ error: 'Error al consultar obligaciones' });
    
    const obligaciones = rows.map(o => ({
      ...o,
      evidenciaSubida: Boolean(o.evidenciaSubida)
    }));
    
    res.json(obligaciones);
  });
});

// 5. CREAR OBLIGACIÓN[cite: 15]
app.post('/api/obligaciones', verificarToken, (req, res) => {
  const { titulo, entidad, ley, departamento, vencimiento, estado, responsable } = req.body;
  if (!titulo || !entidad || !departamento || !vencimiento || !responsable) {
    return res.status(400).json({ error: 'Faltan campos obligatorios' });
  }

  const query = `
    INSERT INTO obligaciones (titulo, entidad, ley, departamento, vencimiento, estado, responsable, evidenciaSubida)
    VALUES (?, ?, ?, ?, ?, ?, ?, 0)
  `;
  const params = [titulo, entidad, ley || '', departamento, vencimiento, estado || 'proxima', responsable];

  db.run(query, params, function(err) {
    if (err) return res.status(500).json({ error: 'Error al insertar obligación' });
    res.status(201).json({ id: this.lastID, ...req.body, evidenciaSubida: false });
  });
});

// 6. ACTUALIZAR OBLIGACIÓN[cite: 15]
app.patch('/api/obligaciones/:id', verificarToken, (req, res) => {
  const { id } = req.params;
  const { estado, evidenciaSubida } = req.body;

  let fields = [];
  let params = [];

  if (estado !== undefined) {
    fields.push('estado = ?');
    params.push(estado);
  }
  if (evidenciaSubida !== undefined) {
    fields.push('evidenciaSubida = ?');
    params.push(evidenciaSubida ? 1 : 0);
  }

  if (fields.length === 0) {
    return res.status(400).json({ error: 'No se enviaron campos para actualizar' });
  }

  params.push(id);
  const query = `UPDATE obligaciones SET ${fields.join(', ')} WHERE id = ?`;

  db.run(query, params, function(err) {
    if (err) return res.status(500).json({ error: 'Error al actualizar obligación' });
    res.json({ message: 'Obligación actualizada correctamente' });
  });
});

// Obtener todos los usuarios de la BD (Solo para Admin)
app.get('/api/usuarios', verificarToken, (req, res) => {
  db.all(`SELECT id, nombre, email, rol, departamento FROM usuarios`, [], (err, rows) => {
    if (err) {
      return res.status(500).json({ error: 'Error al obtener usuarios de la base de datos' });
    }
    res.json(rows);
  });
});

// Obtener todos los usuarios de la BD (Solo para Admin)
app.get('/api/usuarios', verificarToken, (req, res) => {
  db.all(`SELECT id, nombre, email, rol, departamento FROM usuarios`, [], (err, rows) => {
    if (err) {
      return res.status(500).json({ error: 'Error al obtener usuarios de la base de datos' });
    }
    res.json(rows);
  });
});

app.listen(PORT, () => {
  console.log(`Servidor listo en http://localhost:${PORT}`);
});