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

Para poblar la base de datos con usuarios de prueba y obligaciones iniciales, ejecuta el siguiente comando en la carpeta del backend:

```bash
npm run seed
```

Abre dos terminales distintas en la raíz del repositorio. En la primera terminal corre el servidor
Backend: 
```bash
npm run server
```

En la segunda terminal corre el cliente
Frontend: 
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