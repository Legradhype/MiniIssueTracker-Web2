# 🚀 Mini Issue Tracker - Estilo Jira

Una aplicación **Full Stack** para gestionar proyectos, tickets e incidencias de software. Construida con **Node.js + Express + PostgreSQL** en el backend y **EJS** en el frontend.

---

## 📋 Características Principales

✅ **Autenticación** - Registro y login de usuarios  
✅ **Gestión de Proyectos** - Crear, editar, listar y acceder a proyectos  
✅ **Gestión de Tickets** - CRUD completo con estados  
✅ **Tablero Kanban** - Visualizar tickets por estado (Pendiente, En Progreso, Completado)  
✅ **Asignación de Tareas** - Asignar tickets a miembros del equipo  
✅ **Validaciones Robustas** - Usando Zod  
✅ **Reglas de Negocio** - Transiciones de estado validadas  
✅ **Seguridad** - JWT + Middleware de autorización  

---

## 🛠️ Tecnologías Utilizadas

### Backend
- **Node.js** - Runtime de JavaScript
- **Express** - Framework web
- **PostgreSQL** - Base de datos relacional
- **Sequelize** - ORM para NodeJS
- **JWT** - Autenticación con tokens
- **Bcrypt** - Encriptación de contraseñas
- **Zod** - Validación de esquemas
- **dotenv** - Configuración de variables de entorno

### Frontend
- **EJS** - Plantillas HTML dinámicas
- **Bootstrap 5** - Diseño responsive
- **Bootstrap Icons** - Iconografía
- **Fetch API** - Comunicación con backend

---

## 📁 Estructura del Proyecto

```
MiniIssueTracker-Web2/
├── app.js                    # Aplicación principal
├── package.json              # Dependencias
├── .env                       # Variables de entorno
├── config/
│   ├── config.json           # Configuración de base de datos
│   └── db.js                 # Conexión a PostgreSQL
├── controllers/              # Lógica de negocio
│   ├── authController.js
│   ├── proyectoController.js
│   └── ticketController.js
├── models/                   # Modelos Sequelize
│   ├── index.js
│   ├── usuario.js
│   ├── proyecto.js
│   ├── ticket.js
│   └── proyectoUsuario.js
├── routes/                   # Rutas API
│   ├── auth.js
│   ├── proyectos.js
│   └── tickets.js
├── middleware/               # Middlewares
│   ├── authMiddleware.js
│   ├── proyectoMiddleware.js
│   └── validators.js
├── views/                    # Plantillas EJS
│   ├── index.ejs
│   ├── auth/
│   ├── cliente/
│   └── partials/
└── database/
    └── script.sql            # Script inicial de BD
```

---

## 🚀 Instalación y Ejecución

### 1. Requisitos Previos
- **Node.js** v16+ y **npm**
- **PostgreSQL** v12+

### 2. Instalar Dependencias
```bash
npm install
```

### 3. Configurar Variables de Entorno
Crear archivo `.env` en la raíz del proyecto:
```env
# Base de Datos
DB_HOST=localhost
DB_PORT=5432
DB_NAME=issuetracker_db
DB_USER=postgres
DB_PASSWORD=tuContraseña

# JWT
JWT_SECRET=tuSecretoMuySeguro123

# Server
PORT=3000
NODE_ENV=development
```

### 4. Crear Base de Datos
```bash
psql -U postgres -d issuetracker_db -f database/script.sql
```

### 5. Ejecutar el Servidor
```bash
node app.js
```

Debería ver:
```
✅ Conectado a PostgreSQL
🚀 Servidor corriendo en http://localhost:3000
```

---

## 📚 Endpoints de la API

### **Autenticación**

#### 📝 Registro
```
POST /api/auth/register
Content-Type: application/json

Body:
{
  "nombre": "Juan Pérez",
  "email": "juan@example.com",
  "password": "miContraseña123"
}

Response: 201 Created
{
  "id": 1,
  "nombre": "Juan Pérez",
  "email": "juan@example.com"
}
```

#### 🔐 Login
```
POST /api/auth/login
Content-Type: application/json

Body:
{
  "email": "juan@example.com",
  "password": "miContraseña123"
}

Response: 200 OK
{
  "token": "eyJhbGciOiJIUzI1NiIs...",
  "usuario": {
    "id": 1,
    "nombre": "Juan Pérez",
    "email": "juan@example.com"
  }
}
```

#### 🚪 Logout
```
POST /api/auth/logout
Authorization: Bearer <token>

Response: 200 OK
{
  "mensaje": "Sesión cerrada correctamente"
}
```

---

### **Proyectos**

#### 📋 Listar mis Proyectos
```
GET /api/proyectos
Authorization: Bearer <token>
```

#### ➕ Crear Proyecto
```
POST /api/proyectos
Authorization: Bearer <token>
Content-Type: application/json

Body:
{
  "nombre": "Nuevo Proyecto",
  "descripcion": "Descripción del proyecto"
}
```

#### 👁️ Obtener Detalle del Proyecto
```
GET /api/proyectos/:id
Authorization: Bearer <token>
```

#### ✏️ Editar Proyecto
```
PUT /api/proyectos/:id
Authorization: Bearer <token>
Content-Type: application/json

Body:
{
  "nombre": "Nombre actualizado",
  "descripcion": "Nueva descripción"
}
```

#### 👥 Agregar Miembro al Proyecto
```
POST /api/proyectos/:id/usuarios
Authorization: Bearer <token>
Content-Type: application/json

Body:
{
  "email": "usuario@example.com"
}
```

#### 🔍 Buscar Usuarios
```
GET /api/proyectos/buscar/usuarios?q=maria
Authorization: Bearer <token>
```

---

### **Tickets**

#### 📋 Listar Tickets del Proyecto
```
GET /api/proyectos/:proyecto_id/tickets
Authorization: Bearer <token>
```

#### ➕ Crear Ticket
```
POST /api/proyectos/:proyecto_id/tickets
Authorization: Bearer <token>
Content-Type: application/json

Body:
{
  "titulo": "Nueva funcionalidad",
  "descripcion": "Descripción detallada",
  "usuario_asignado_id": 2
}

⚠️ NOTA: usuario_asignado_id es obligatorio para mover a "en_progreso"
```

#### 👁️ Obtener Detalle del Ticket
```
GET /api/proyectos/:proyecto_id/tickets/:id
Authorization: Bearer <token>
```

#### ✏️ Editar Ticket
```
PUT /api/proyectos/:proyecto_id/tickets/:id
Authorization: Bearer <token>
Content-Type: application/json

Body:
{
  "titulo": "Título actualizado",
  "descripcion": "Descripción actualizada",
  "usuario_asignado_id": 2
}

⚠️ NOTA: NO se puede cambiar "estado" en PUT. Use PATCH.
```

#### 🔄 Cambiar Estado del Ticket
```
PATCH /api/proyectos/:proyecto_id/tickets/:id/estado
Authorization: Bearer <token>
Content-Type: application/json

Body:
{
  "nuevo_estado": "en_progreso"
}

Estados válidos: pendiente, en_progreso, completado

Transiciones permitidas:
- pendiente → en_progreso ✅
- en_progreso → completado ✅
- en_progreso → pendiente ✅
- completado → en_progreso ✅
```

#### 🗑️ Eliminar Ticket
```
DELETE /api/proyectos/:proyecto_id/tickets/:id
Authorization: Bearer <token>
```

---

## ✅ Validaciones de Negocio

| Regla | Validación |
|-------|-----------|
| **Campos obligatorios** | Título y descripción requeridos en tickets |
| **Usuario válido** | Usuario debe existir y pertenecer al proyecto |
| **Sin asignar a "en_progreso"** | No puede iniciar ticket sin responsable |
| **Transiciones de estado** | Solo transiciones permitidas según reglas |
| **Email único** | El email debe ser único en la base de datos |
| **Contraseña mínima** | Mínimo 6 caracteres |
| **Acceso a proyecto** | Usuario debe ser miembro del proyecto |
| **Cambio de estado en PUT** | ❌ No permitido, usar PATCH |
| **Usuario asignado en edición** | Debe pertenecer al proyecto si se cambia |

---

## 🔐 Autenticación y Autorización

- Todos los endpoints protegidos requieren token JWT en header `Authorization: Bearer <token>`
- Token expira en **8 horas**
- Las contraseñas se almacenan encriptadas con bcrypt
- Solo miembros del proyecto pueden acceder a sus datos

---

## 🎨 Vistas Frontend

| Ruta | Descripción |
|------|-------------|
| `/login` | Login de usuario |
| `/register` | Registro de nuevo usuario |
| `/proyectos` | Listado de proyectos |
| `/proyectos/:id` | Detalle del proyecto y tickets |
| `/proyectos/:id/tablero` | Vista Kanban por estados |
| `/proyectos/:id/tickets/:id` | Detalle y edición del ticket |

---

## 📊 Modelo de Datos

### Usuarios
```
id, nombre, email (único), password (hash), fecha_creacion
```

### Proyectos
```
id, nombre, descripcion, creador_id (FK), fecha_creacion
```

### Tickets
```
id, titulo, descripcion, estado, usuario_asignado_id (FK), 
proyecto_id (FK), fecha_creacion
```

### Proyecto_Usuarios (Relación N:N)
```
proyecto_id (FK), usuario_id (FK)
```

---

## 🧪 Prueba Rápida

1. **Registrarse**: `POST /api/auth/register`
2. **Login**: `POST /api/auth/login` → obtener token
3. **Crear proyecto**: `POST /api/proyectos`
4. **Crear ticket**: `POST /api/proyectos/:id/tickets`
5. **Ver tablero**: Acceder a `/proyectos/:id/tablero`

---

## 📝 Variables de Entorno

```env
DB_HOST=localhost              # Host PostgreSQL
DB_PORT=5432                   # Puerto (default 5432)
DB_NAME=issuetracker_db        # Nombre BD
DB_USER=postgres               # Usuario PostgreSQL
DB_PASSWORD=password           # Contraseña
JWT_SECRET=secretoMuySeguro123 # Clave JWT
PORT=3000                      # Puerto del servidor
NODE_ENV=development           # development/production
```

---

## 📄 Licencia

Proyecto educativo - Práctico 2, Web 2 (UdelaR)

**Versión:** 1.0.0  
**Última actualización:** 04/05/2026