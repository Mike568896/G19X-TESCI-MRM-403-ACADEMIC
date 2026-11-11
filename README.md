# Pluri Uno - Sistema de Gestión de Cumplimiento Legal y Regulatorio

Pluri Uno es una plataforma web integral diseñada para la gestión, seguimiento y auditoría de obligaciones normativas, legales y operativas dentro de una organización.

## Arquitectura y Tecnologías
- **Frontend:** React + Vite, Tailwind CSS, Lucide Icons.
- **Backend:** Node.js, Express.
- **Base de Datos:** SQLite (`database.sqlite`).
- **Autenticación:** JSON Web Tokens (JWT) con encriptación de contraseñas (`bcrypt`).

## Requisitos e Instalación

1. **Clonar el repositorio:**
   ```bash
   git clone https://github.com/Mike568896/G19X-TESCI-MRM-403-ACADEMIC.git
   cd G19X-TESCI-MRM-403-ACADEMIC
   ```

2. **Instalar Dependencias:**
npm install

3. **Configurar variables de entorno:**
Copia el archivo de ejemplo para crear el .env:
cp .env.example .env
(Asegúrate de configurar tus variables, incluyendo ADMIN_INIT_EMAIL y ADMIN_INIT_PASS para definir el usuario administrador inicial).

4. **Ejecutar el proyecto:**
Abre dos terminales distintas en la raíz del repositorio. En la primera terminal corre el servidor:
Backend: npm run server (Corre en http://localhost:5000)

En la segunda terminal corre el cliente:
Frontend: npm run dev (Corre en http://localhost:5173)

Primer acceso:
Entrar a la aplicación usando el correo que definiste en ADMIN_INIT_EMAIL y la contraseña asignada en ADMIN_INIT_PASS.

## 📄 Documentación del Proyecto
Para más detalles sobre el diseño y alcance del sistema, puedes consultar:
- [Documento de Requisitos (PRD)](docs/PRD.md)
- [Producto Mínimo Viable (MVP)](docs/MVP.md)