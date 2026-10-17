import express from 'express';
import sqlite3 from 'sqlite3';
import cors from 'cors';
import bcrypt from 'bcrypt';
import jwt from 'jsonwebtoken';
import nodemailer from 'nodemailer';

const app = express();
const PORT = 5000;
const JWT_SECRET = 'plurione_secret_key_proyect_2026';

app.use(express.json());
app.use(cors());

// Configuración del transportador de correo para notificaciones de bienvenida
// En producción se usan variables de entorno. Puedes usar un servicio como Ethereal o Gmail SMTP.
const transporter = nodemailer.createTransport({
  service: 'gmail',
  auth: {
    user: 'notificaciones.plurione@gmail.com', // Reemplazar con tu correo o usar credenciales de prueba
    pass: 'app_password_here'
  }
});

// Función para enviar correo de bienvenida (falla de forma silenciosa si no hay credenciales SMTP)
const sendWelcomeEmail = async (toEmail, nombreUsuario) => {
  try {
    console.log(`[Email Service] Simulando/Enviando correo de confirmación a: ${toEmail}`);
    /* 
    Descomentar si configuras credenciales SMTP reales:
    await transporter.sendMail({
      from: '"Pluri Uno LegalTech" <notificaciones@plurione.com>',
      to: toEmail,
      subject: '¡Bienvenido a Pluri Uno Compliance Hub!',
      text: `Hola ${nombreUsuario},\n\nTu cuenta institucional ha sido registrada con éxito en el sistema de seguimiento de obligaciones de Pluri Uno.\n\nAccede con tu correo para revisar tus tareas de cumplimiento asignadas.`
    });
    */
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
          // Asegurar que su rol sea Administrador si ya existía
          db.run(`UPDATE usuarios SET rol = 'Administrador' WHERE email = ?`, [adminEmail]);
        }
      });
    }
  });
}

// ENDPOINTS

// 1. REGISTRO DE USUARIO (Asigna rol Empleado por defecto)
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
      
      // Enviar correo de confirmación
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

// 3. OBTENER LISTA DE USUARIOS EN TIEMPO REAL (Exclusivo para Vista Admin)
app.get('/api/users', (req, res) => {
  db.all(`SELECT id, nombre, email, departamento, rol FROM usuarios`, [], (err, rows) => {
    if (err) {
      return res.status(500).json({ error: err.message });
    }
    res.json(rows);
  });
});

app.listen(PORT, () => {
  console.log(`Servidor listo en http://localhost:${PORT}`);
});