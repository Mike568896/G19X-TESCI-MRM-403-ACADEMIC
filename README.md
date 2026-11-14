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
```bash 
npm install
```

3. **Configurar variables de entorno:**
Copia el archivo de ejemplo para crear el .env:
```bash
cp .env.example .env
```
(Asegúrate de configurar tus variables, incluyendo ADMIN_INIT_EMAIL y ADMIN_INIT_PASS para definir el usuario administrador inicial).

4. **Ejecutar el proyecto:**

Asegúrate de estar dentro de la carpeta del repositorio (`cd G19X-TESCI-MRM-403-ACADEMIC`) y abre **dos terminales distintas**:

* **En la primera terminal, inicia el servidor Backend** (esto creará automáticamente el archivo de base de datos y sus tablas):

```bash
npm run server
```

En la segunda terminal, pobla la base de datos ejecutando el script de seeding (con las tablas ya creadas):

```bash
npm run seed
```

En esa misma segunda terminal, levanta el cliente Frontend: 
```bash
npm run dev
```

Primer acceso:
Entrar a la aplicación usando el correo que definiste en ADMIN_INIT_EMAIL y la contraseña asignada en ADMIN_INIT_PASS.

## Cuentas de Prueba y Seeding

Una vez ejecutado el script de seed, puedes iniciar sesión con las siguientes credenciales precargadas:

| Correo |Contraseña | Rol | Responsable Asignado |
| :--- | :--- | :--- | :--- |
| **ana@plurione.com** | 123456 | Empleado | Ana Gomez |
| **Carlos@plurione.com** | 123456 | Empleado | Carlos Ruiz |
| **Romero@plurione.com** | 123456 | Administrador | Acceso Global |

## 📄 Documentación del Proyecto
Para más detalles sobre el diseño y alcance del sistema, puedes consultar:
- [Documento de Requisitos (PRD)](docs/PRD.md)
- [Producto Mínimo Viable (MVP)](docs/MVP.md)