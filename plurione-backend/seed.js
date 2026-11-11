import sqlite3 from 'sqlite3';
import bcrypt from 'bcrypt';

const sqlite = sqlite3.verbose();
const db = new sqlite.Database('./database.sqlite', async (err) => {
    if (err) {
        console.error('Error al conectar con SQLite:', err.message);
        process.exit(1);
    }
    console.log('Conectado a la base de datos para seeding...');
    await runSeed();
});

async function runSeed() {
    try {
        const hashedPassword = await bcrypt.hash('123456', 10);

        // 1. Usuarios de prueba (empleados y admin)
        const usuarios = [
            { nombre: 'Ana Gómez', email: 'ana@plurione.com', password: hashedPassword, departamento: 'Legal', rol: 'Empleado' },
            { nombre: 'Carlos Ruiz', email: 'carlos@plurione.com', password: hashedPassword, departamento: 'Finanzas', rol: 'Empleado' },
            { nombre: 'Miguel Admin', email: 'm.romero@plurione.com', password: hashedPassword, departamento: 'Sistemas y TI', rol: 'Administrador' }
        ];

        for (const u of usuarios) {
            db.get(`SELECT * FROM usuarios WHERE email = ?`, [u.email], (err, row) => {
                if (!row) {
                    db.run(
                        `INSERT INTO usuarios (nombre, email, password, departamento, rol) VALUES (?, ?, ?, ?, ?)`,
                        [u.nombre, u.email, u.password, u.departamento, u.rol],
                        (err) => { if (!err) console.log(`Usuario creado: ${u.nombre}`); }
                    );
                } else {
                    console.log(`Usuario ya existe (sin duplicar): ${u.email}`);
                }
            });
        }

        // 2. Obligaciones de prueba distribuidas entre los empleados
        const obligaciones = [
            { titulo: 'Revisión Fiscal Anual', entidad: 'SAT', ley: 'Ley del ISR', departamento: 'Finanzas', vencimiento: '2026-12-01', estado: 'proxima', responsable: 'Carlos Ruiz', evidenciaSubida: 0 },
            { titulo: 'Auditoría Ambiental', entidad: 'PROFEPA', ley: 'Ley General del Equilibrio Ecológico', departamento: 'Legal', vencimiento: '2026-12-15', estado: 'proxima', responsable: 'Ana Gómez', evidenciaSubida: 0 },
            { titulo: 'Declaración Trimestral IMSS', entidad: 'IMSS', ley: 'Ley del Seguro Social', departamento: 'Finanzas', vencimiento: '2026-11-20', estado: 'proxima', responsable: 'Carlos Ruiz', evidenciaSubida: 1 },
            { titulo: 'Licencia de Funcionamiento', entidad: 'Municipio', ley: 'Ley Orgánica Municipal', departamento: 'Legal', vencimiento: '2027-01-10', estado: 'proxima', responsable: 'Ana Gómez', evidenciaSubida: 0 },
            { titulo: 'Protección Civil y Visto Bueno', entidad: 'Protección Civil', ley: 'Ley de Gestión de Riesgos', departamento: 'Legal', vencimiento: '2026-12-30', estado: 'proxima', responsable: 'Ana Gómez', evidenciaSubida: 1 },
            { titulo: 'Reporte de Contabilidad Electrónica', entidad: 'SAT', ley: 'Código Fiscal de la Federación', departamento: 'Finanzas', vencimiento: '2026-11-28', estado: 'proxima', responsable: 'Carlos Ruiz', evidenciaSubida: 0 }
        ];

        setTimeout(() => {
            for (const o of obligaciones) {
                db.get(`SELECT * FROM obligaciones WHERE titulo = ?`, [o.titulo], (err, row) => {
                    if (!row) {
                        db.run(
                            `INSERT INTO obligaciones (titulo, entidad, ley, departamento, vencimiento, estado, responsable, evidenciaSubida) VALUES (?, ?, ?, ?, ?, ?, ?, ?)`,
                            [o.titulo, o.entidad, o.ley, o.departamento, o.vencimiento, o.estado, o.responsable, o.evidenciaSubida],
                            (err) => { if (!err) console.log(`Obligación creada: ${o.titulo}`); }
                        );
                    } else {
                        console.log(`Obligación ya existe (sin duplicar): ${o.titulo}`);
                    }
                });
            }
            setTimeout(() => {
                console.log('¡Seeding completado con éxito!');
                db.close();
            }, 1000);
        }, 1000);

    } catch (error) {
        console.error('Error en el proceso de seed:', error);
    }
}