# MVP (Minimum Viable Product) - Pluri Uno

## 1. Alcance y Estado del MVP

| Funcionalidad | Estado actual | Observaciones |
| :--- | :--- | :--- |
| **Autenticación y Sesión (JWT)** | Implementado | Autenticación local mediante tokens JWT, uso de `bcrypt` y persistencia de sesión por rol tras recargar con `F5`. |
| **Control de Roles (RBAC)** | Implementado | Roles de `Administrador` y `Empleado` con bloqueo de seguridad en servidor (`403 Forbidden`). |
| **Gestión de Obligaciones (SQLite)** | Implementado | Persistencia real en base de datos SQLite con asignación normalizada por `responsable_id` (INTEGER). |
| **Filtro y Asignación** | Implementado | Endpoints parametrizados para filtrar obligaciones según el usuario autenticado. |
| **Carga de Evidencias** | Simulado / Entorno Local | Interfaz de gestión visual integrada; almacenamiento de estado en base de datos sin persistencia binaria pesada (Multer/Azure). |
| **Notificaciones por Correo / SSO** | Fuera de alcance / Conceptual | Retirados del flujo activo de la UI para mantener total transparencia con las capacidades reales del sistema. |

## 2. Criterios de Aceptación Comprobables
1. **Autenticación Correcta:** El administrador y los empleados (`ana@plurione.com`, `carlos@plurione.com`, `m.romero@plurione.com`) pueden iniciar sesión con `123456` y recibir un JWT válido que persiste al recargar la página.
2. **Restricción de Acceso y Permisos:** Un usuario con rol `Empleado` solo visualiza sus obligaciones asignadas y el servidor bloquea con `403` cualquier intento de crear registros si no es `Administrador`.
3. **Consistencia de Datos:** Al registrar o modificar obligaciones utilizando el script de siembra (`npm run seed`) o la interfaz web, los cambios persisten de manera íntegra en la base de datos SQLite.