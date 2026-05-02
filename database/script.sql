-- ============================================
-- CREAR BASE DE DATOS
-- ============================================
CREATE DATABASE issue_tracker;

-- Conectarse a la base de datos antes de ejecutar lo siguiente
-- \c issue_tracker;


-- ============================================
-- TABLA: usuarios
-- ============================================
CREATE TABLE usuarios (
    id SERIAL PRIMARY KEY,
    nombre VARCHAR(100) NOT NULL,
    email VARCHAR(150) UNIQUE NOT NULL,
    password TEXT NOT NULL,
    fecha_creacion TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);


-- ============================================
-- TABLA: proyectos
-- ============================================
CREATE TABLE proyectos (
    id SERIAL PRIMARY KEY,
    nombre VARCHAR(150) NOT NULL,
    descripcion TEXT,
    fecha_creacion TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    creador_id INT NOT NULL,
    CONSTRAINT fk_creador
        FOREIGN KEY (creador_id)
        REFERENCES usuarios(id)
        ON DELETE CASCADE
);


-- ============================================
-- TABLA: proyecto_usuario (N:M)
-- ============================================
CREATE TABLE proyecto_usuario (
    id SERIAL PRIMARY KEY,
    usuario_id INT NOT NULL,
    proyecto_id INT NOT NULL,

    CONSTRAINT fk_usuario
        FOREIGN KEY (usuario_id)
        REFERENCES usuarios(id)
        ON DELETE CASCADE,

    CONSTRAINT fk_proyecto
        FOREIGN KEY (proyecto_id)
        REFERENCES proyectos(id)
        ON DELETE CASCADE,

    CONSTRAINT unique_usuario_proyecto
        UNIQUE (usuario_id, proyecto_id)
);


-- ============================================
-- TABLA: tickets
-- ============================================
CREATE TABLE tickets (
    id SERIAL PRIMARY KEY,
    titulo VARCHAR(200) NOT NULL,
    descripcion TEXT,
    estado VARCHAR(20) NOT NULL DEFAULT 'pendiente',
    usuario_asignado_id INT,
    proyecto_id INT NOT NULL,
    fecha_creacion TIMESTAMP DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT fk_usuario_asignado
        FOREIGN KEY (usuario_asignado_id)
        REFERENCES usuarios(id)
        ON DELETE SET NULL,

    CONSTRAINT fk_ticket_proyecto
        FOREIGN KEY (proyecto_id)
        REFERENCES proyectos(id)
        ON DELETE CASCADE,

    CONSTRAINT check_estado
        CHECK (estado IN ('pendiente', 'en_progreso', 'completado'))
);


-- ============================================
-- ÍNDICES (performance)
-- ============================================
CREATE INDEX idx_tickets_proyecto ON tickets(proyecto_id);
CREATE INDEX idx_tickets_estado ON tickets(estado);
CREATE INDEX idx_proyecto_usuario ON proyecto_usuario(usuario_id, proyecto_id);


-- ============================================
-- DATOS DE PRUEBA (opcional)
-- ============================================

-- Usuarios
INSERT INTO usuarios (nombre, email, password)
VALUES 
('Juan Perez', 'juan@test.com', '123456'),
('Maria Lopez', 'maria@test.com', '123456');

-- Proyecto
INSERT INTO proyectos (nombre, descripcion, creador_id)
VALUES 
('Sistema de Tickets', 'Proyecto principal', 1);

-- Relación usuarios-proyecto
INSERT INTO proyecto_usuario (usuario_id, proyecto_id)
VALUES 
(1, 1),
(2, 1);

-- Tickets
INSERT INTO tickets (titulo, descripcion, estado, usuario_asignado_id, proyecto_id)
VALUES 
('Login no funciona', 'Error al iniciar sesión', 'pendiente', 1, 1),
('Crear dashboard', 'Vista principal del sistema', 'en_progreso', 2, 1),
('Bug en registro', 'Error al registrar usuario', 'completado', 1, 1); 