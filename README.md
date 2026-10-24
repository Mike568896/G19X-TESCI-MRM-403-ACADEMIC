# Pluri Uno - Sistema de Gestión de Cumplimiento Legal y Regulatorio

Pluri Uno es una plataforma web integral diseñada para la gestión, seguimiento y auditoría de obligaciones normativas, legales y operativas (SAT, STPS, normativas internas) dentro de una organización.

## 🚀 Arquitectura y Tecnologías
- **Frontend:** React + Vite, Tailwind CSS, Lucide Icons.
- **Backend:** Node.js, Express.
- **Base de Datos:** SQLite (`database.sqlite`).
- **Autenticación:** JSON Web Tokens (JWT) con encriptación de contraseñas (`bcrypt`).

## 🛠️ Requisitos e Instalación

1. **Clonar el repositorio:**
   ```bash
   git clone https://github.com/Mike568896/G19X-TESCI-MRM-403-ACADEMICO.git
   cd MIKE_049

1.- Instalar Dependencias:
npm install
cd plurione-backend && npm install && cd ..

2.- Configurar variables de entorno:
Copia el archivo de ejemplo para crear tu .env:
cp .env.example .env
Asegúrate de definir variables como PORT, JWT_SECRET, ADMIN_INIT_EMAIL y ADMIN_INIT_PASS.

3.- Ejecutar el proyecto:

Backend: npm run server (Corre en http://localhost:5000)

Frontend: npm run dev (Corre en http://localhost:5173)

ESPECIFICACIÓN TÉCNICA DEL MVP Y PRD
1. Visión del Producto
Pluri Uno centraliza la gestión de cumplimiento normativo para empresas, reduciendo riesgos de sanciones mediante el control en tiempo real de obligaciones, fechas de vencimiento y evidencias auditables.

2. Alcance del MVP (Minimum Viable Product)
Autenticación Segura: Inicio de sesión y registro de usuarios mediante tokens JWT y hashing de contraseñas con bcrypt.

Control de Funciones (RBAC): Middleware de backend para restricción de rutas exclusivas para administradores (esAdmin).

Gestión de Obligaciones: CRUD con operaciones de lectura, creación y actualización de estado (PATCH) persistido en SQLite.

Carga de Evidencias: Registro y vinculación de evidencias documentales a obligaciones para auditorías.

Alertas y Calendarización: Identificación visual de obligaciones próximas, vencidas y completadas.

3. Roles de Usuario
Administrador: Acceso completo a métricas, gestión de usuarios y administración global.

Empleado / Responsable: Consulta de obligaciones asignadas y registro de evidencias documentales.

4. Uso de Inteligencia Artificial
En el desarrollo de este proyecto se emplearon asistentes de Inteligencia Artificial como apoyo metodológico en el refinamiento del código, diagnóstico de bugs en el estado de React/Express y estructuración de la documentación técnica.