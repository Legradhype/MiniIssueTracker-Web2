const { z } = require('zod');

const validar = (schema) => (req, res, next) => {
  const result = schema.safeParse(req.body);
  if (!result.success) {
    const errores = result.error.errors.map(e => e.message);
    return res.status(400).json({ error: errores[0] });
  }
  req.body = result.data;
  next();
};

const schemas = {
  register: z.object({
    nombre: z.string().min(1, 'El nombre es requerido'),
    email: z.string().email('Email inválido'),
    password: z.string().min(6, 'La contraseña debe tener al menos 6 caracteres'),
  }),

  login: z.object({
    email: z.string().email('Email inválido'),
    password: z.string().min(1, 'La contraseña es requerida'),
  }),

  proyecto: z.object({
    nombre: z.string().min(1, 'El nombre es requerido'),
    descripcion: z.string().optional(),
  }),

  ticket: z.object({
    titulo: z.string().min(1, 'El título es requerido'),
    descripcion: z.string().min(1, 'La descripción es requerida'),
    usuario_asignado_id: z.number().int().positive().optional().nullable(),
  }),
};

module.exports = { validar, schemas };