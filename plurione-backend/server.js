import dotenv from "dotenv";
dotenv.config();

import express from "express";
import sqlite3 from "sqlite3";
import cors from "cors";
import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";
import nodemailer from "nodemailer";

const requiredEnv = [
  "JWT_SECRET",
  "ADMIN_INIT_EMAIL",
  "ADMIN_INIT_PASS",
  "SMTP_USER",
  "SMTP_PASS",
];
const missingEnv = requiredEnv.filter((env) => !process.env[env]);

if (missingEnv.length > 0) {
  console.error(
    `Faltan variables requeridas en el .env: ${missingEnv.join(", ")}. Copia .env.example a .env y configura los valores.`,
  );
  process.exit(1);
}

const app = express();
const PORT = process.env.PORT || 5000;
const JWT_SECRET = process.env.JWT_SECRET;

app.use(express.json());
app.use(cors());

const transporter = nodemailer.createTransport({
  service: "gmail",
  auth: {
    user: process.env.SMTP_USER,
    pass: process.env.SMTP_PASS,
  },
});

const sendWelcomeEmail = async (toEmail, nombreUsuario) => {
  try {
    console.log(
      `[Email Service] Simulando/Enviando correo de confirmación a: ${toEmail}`,
    );
  } catch (error) {
    console.error("Error al enviar correo:", error.message);
  }
};

const sqlite = sqlite3.verbose();
const db = new sqlite.Database("./database.sqlite", (err) => {
  if (err) {
    console.error("Error al conectar con SQLite:", err.message);
  } else {
    console.log("Conectado a la base de datos SQLite.");
    initDb();
  }
});

function initDb() {
  db.serialize(() => {
    db.run(
      `CREATE TABLE IF NOT EXISTS usuarios (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      nombre TEXT NOT NULL,
      email TEXT UNIQUE NOT NULL,
      password TEXT NOT NULL,
      departamento TEXT,
      rol TEXT DEFAULT 'Empleado'
    )`,
      (err) => {
        if (!err) {
          console.log("Tabla de usuarios lista.");

          const adminEmail = process.env.ADMIN_INIT_EMAIL;
          const adminPassword = process.env.ADMIN_INIT_PASS;

          db.get(
            `SELECT * FROM usuarios WHERE email = ?`,
            [adminEmail],
            async (err, row) => {
              if (!row) {
                const hashedPassword = await bcrypt.hash(adminPassword, 10);
                db.run(
                  `INSERT INTO usuarios (nombre, email, password, departamento, rol) VALUES (?, ?, ?, ?, ?)`,
                  [
                    "Miguel Romero Morales",
                    adminEmail,
                    hashedPassword,
                    "Sistemas y TI",
                    "Administrador",
                  ],
                );
              } else {
                db.run(
                  `UPDATE usuarios SET rol = 'Administrador' WHERE email = ?`,
                  [adminEmail],
                );
              }
            },
          );
        }
      },
    );

    db.run(
      `CREATE TABLE IF NOT EXISTS obligaciones (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      titulo TEXT NOT NULL,
      entidad TEXT NOT NULL,
      ley TEXT,
      departamento TEXT NOT NULL,
      vencimiento TEXT NOT NULL,
      estado TEXT NOT NULL DEFAULT 'proxima',
      responsable_id INTEGER,
      evidenciaSubida INTEGER DEFAULT 0
    )`,
      (err) => {
        if (!err) console.log("Tabla de obligaciones lista.");
      },
    );
  });
}

const verificarToken = (req, res, next) => {
  const authHeader = req.headers["authorization"];
  if (!authHeader)
    return res.status(401).json({ error: "Token no proporcionado." });

  const token = authHeader.split(" ")[1];
  if (!token)
    return res.status(401).json({ error: "Formato de token inválido." });

  try {
    const decoded = jwt.verify(token, JWT_SECRET);
    req.user = decoded;
    next();
  } catch (error) {
    return res.status(403).json({ error: "Token inválido o expirado." });
  }
};

const esAdmin = (req, res, next) => {
  if (
    req.user &&
    (req.user.rol === "Administrador" ||
      req.user.rol === "Administrador de Cumplimiento")
  ) {
    return next();
  }
  return res.status(403).json({
    error: "Acceso denegado: Se requieren permisos de Administrador.",
  });
};

app.post("/api/register", async (req, res) => {
  const { nombre, email, password, departamento } = req.body;

  if (!nombre || !email || !password) {
    return res.status(400).json({ error: "Faltan campos obligatorios." });
  }

  try {
    const hashedPassword = await bcrypt.hash(password, 10);
    const adminEmail = process.env.ADMIN_INIT_EMAIL;
    const rolAsignado =
      email.toLowerCase() === adminEmail.toLowerCase()
        ? "Administrador"
        : "Empleado";

    const query = `INSERT INTO usuarios (nombre, email, password, departamento, rol) VALUES (?, ?, ?, ?, ?)`;

    db.run(
      query,
      [
        nombre,
        email,
        hashedPassword,
        departamento || "Sistemas y TI",
        rolAsignado,
      ],
      function (err) {
        if (err) {
          if (err.message.includes("UNIQUE")) {
            return res
              .status(400)
              .json({ error: "El correo electrónico ya está registrado." });
          }
          return res.status(500).json({ error: err.message });
        }

        sendWelcomeEmail(email, nombre);

        const token = jwt.sign(
          { id: this.lastID, email, nombre, rol: rolAsignado },
          JWT_SECRET,
          { expiresIn: "8h" },
        );
        res.status(201).json({
          message: "Usuario registrado exitosamente",
          token,
          user: {
            id: this.lastID,
            nombre,
            email,
            departamento: departamento || "Sistemas y TI",
            rol: rolAsignado,
          },
        });
      },
    );
  } catch (error) {
    res.status(500).json({ error: "Error interno del servidor." });
  }
});

app.post("/api/login", (req, res) => {
  const { email, password } = req.body;

  if (!email || !password) {
    return res.status(400).json({ error: "Ingresa correo y contraseña." });
  }

  db.get(
    `SELECT * FROM usuarios WHERE email = ?`,
    [email],
    async (err, user) => {
      if (err) return res.status(500).json({ error: "Error del servidor." });
      if (!user)
        return res
          .status(401)
          .json({ error: "Correo o contraseña incorrectos." });

      const isValidPassword = await bcrypt.compare(password, user.password);
      if (!isValidPassword) {
        return res
          .status(401)
          .json({ error: "Correo o contraseña incorrectos." });
      }

      const token = jwt.sign(
        { id: user.id, email: user.email, nombre: user.nombre, rol: user.rol },
        JWT_SECRET,
        { expiresIn: "8h" },
      );

      res.json({
        message: "Inicio de sesión exitoso",
        token,
        user: {
          id: user.id,
          nombre: user.nombre,
          email: user.email,
          departamento: user.departamento,
          rol: user.rol,
        },
      });
    },
  );
});

app.get("/api/usuarios", verificarToken, esAdmin, (req, res) => {
  db.all(
    `SELECT id, nombre, email, rol, departamento FROM usuarios`,
    [],
    (err, rows) => {
      if (err) {
        return res
          .status(500)
          .json({ error: "Error al obtener usuarios de la base de datos" });
      }
      res.json(rows);
    },
  );
});

app.get("/api/obligaciones", verificarToken, (req, res) => {
  console.log("--- PETICIÓN OBLIGACIONES ---");
  console.log("Usuario decodificado del token (req.user):", req.user);

  let query = `
    SELECT obligaciones.*, usuarios.nombre AS responsable_nombre 
    FROM obligaciones 
    LEFT JOIN usuarios ON obligaciones.responsable_id = usuarios.id
  `;
  let params = [];

  if (req.user.rol === "Empleado") {
    console.log("Filtrando para empleado con ID:", req.user.id);
    query += ` WHERE obligaciones.responsable_id = ?`;
    params.push(req.user.id);
  } else {
    console.log("Usuario Admin: trayendo todas las obligaciones.");
  }

  db.all(query, params, (err, rows) => {
    if (err) {
      console.error("Error SQL:", err);
      return res.status(500).json({ error: "Error al consultar obligaciones" });
    }

    console.log("Obligaciones encontradas en la BD:", rows.length);

    const obligaciones = rows.map((o) => ({
      ...o,
      responsable: o.responsable_nombre || "Sin asignar",
      evidenciaSubida: Boolean(o.evidenciaSubida),
    }));

    res.json(obligaciones);
  });
});

app.post("/api/obligaciones", verificarToken, (req, res) => {
  const {
    titulo,
    entidad,
    ley,
    departamento,
    vencimiento,
    estado,
    responsable_id,
  } = req.body;

  const query = `
    INSERT INTO obligaciones (titulo, entidad, ley, departamento, vencimiento, estado, responsable_id)
    VALUES (?, ?, ?, ?, ?, ?, ?)
  `;

  db.run(
    query,
    [
      titulo,
      entidad || "SAT",
      ley || "Reglamento Interno",
      departamento || "Asuntos legales y cumplimiento normativo",
      vencimiento,
      estado || "proxima",
      Number(responsable_id) || 2,
    ],
    function (err) {
      if (err) {
        console.error("Error al insertar:", err.message);
        return res.status(400).json({ error: err.message });
      }
      res.json({ id: this.lastID, message: "Obligación creada exitosamente" });
    },
  );
});

app.patch("/api/obligaciones/:id", verificarToken, (req, res) => {
  const { id } = req.params;
  const { estado, evidenciaSubida } = req.body;
  const usuarioActual = req.user;

  db.get(`SELECT * FROM obligaciones WHERE id = ?`, [id], (err, obligacion) => {
    if (err) {
      return res.status(500).json({ error: "Error al buscar la obligación" });
    }

    if (!obligacion) {
      return res.status(404).json({ error: "Obligación no encontrada" });
    }

    const esAdministrador =
      usuarioActual.rol === "Administrador" ||
      usuarioActual.rol === "Administrador de Cumplimiento";
    const esResponsable =
      String(obligacion.responsable_id) === String(usuarioActual.id);

    if (!esAdministrador && !esResponsable) {
      return res
        .status(403)
        .json({ error: "No tienes permisos para modificar esta obligación." });
    }

    let fields = [];
    let params = [];

    if (estado !== undefined) {
      fields.push("estado = ?");
      params.push(estado);
    }
    if (evidenciaSubida !== undefined) {
      fields.push("evidenciaSubida = ?");
      params.push(evidenciaSubida ? 1 : 0);
    }

    if (fields.length === 0) {
      return res
        .status(400)
        .json({ error: "No se enviaron campos para actualizar" });
    }

    params.push(id);
    const query = `UPDATE obligaciones SET ${fields.join(", ")} WHERE id = ?`;

    db.run(query, params, function (err) {
      if (err)
        return res
          .status(500)
          .json({ error: "Error al actualizar obligación" });
      return res.json({
        message: "Obligación actualizada correctamente",
        changes: this.changes,
      });
    });
  });
});

app.listen(PORT, () => {
  console.log(`Servidor listo en http://localhost:${PORT}`);
});
