# PRD (Product Requirements Document) - Pluri Uno

## 1. Problema
Las empresas enfrentan riesgos legales y multas severas por falta de control centralizado en sus obligaciones normativas y regulatorias.

## 2. Usuarios Objetivo
- **Administrador:** Control total de la plataforma y gestión de usuarios.
- **Responsable / Empleado:** Seguimiento de obligaciones y carga de evidencias.

## 3. Requisitos Funcionales
- Autenticación con JWT y cifrado de contraseñas.
- Control de acceso basado en roles (RBAC) con middleware `esAdmin`.
- Gestión de obligaciones (Lectura, Creación y Actualización de estado vía PATCH).