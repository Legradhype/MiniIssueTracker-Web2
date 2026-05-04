const { z } = require('zod');


const validar = (schema) => (req, res, next) => {

  console.log('🔍 [VALIDADOR] URL:', req.originalUrl);
  console.log('🔍 [VALIDADOR] Content-Type:', req.get('content-type'));
  console.log('🔍 [VALIDADOR] req.body:', req.body);
  console.log('🔍 [VALIDADOR] req.body tipo:', typeof req.body);
  
  const result = schema.safeParse(req.body || {});

  if (!result.success) {
    const errores = (result.error && result.error.issues) 
      ? result.error.issues.map(e => `${e.path.join('.')}: ${e.message}`) 
      : ["Datos de entrada inválidos"];
    
    console.error('❌ [VALIDADOR] Errores de validación:', errores);
    

    const isApiRequest = req.originalUrl.startsWith('/api/');

    if (isApiRequest) {
      return res.status(400).json({
        success: false,
        error: errores[0],
        detalles: errores
      });
    } else {
      return res.status(400).send(`
        <div style="font-family: sans-serif; text-align: center; margin-top: 50px;">
          <h3 style="color: #e06c75;">Error de validación</h3>
          <p>${errores[0]}</p>
          <a href="javascript:history.back()" style="color: #61afef;">Volver a intentar</a>
        </div>
      `);
    }
  }

  console.log('✅ [VALIDADOR] Datos validados correctamente');
  req.body = result.data;
  next();
};



const schemas = {
  register: z.object({
    nombre: z.string().trim().min(1, 'El nombre es requerido'),
    email: z.string().trim().email('Email inválido'),
    password: z.string().min(6, 'La contraseña debe tener al menos 6 caracteres'),
  }),

  login: z.object({
    email: z.string().trim().email('Email inválido'),
    password: z.string().min(1, 'La contraseña es requerida'),
  }),

  proyecto: z.object({
    nombre: z.string().trim().min(1, 'El nombre es requerido'),
    descripcion: z.string().trim().optional().or(z.literal('')),
  }),

  ticket: z.object({
    titulo: z.string().trim().min(1, 'El título es requerido'),
    descripcion: z.string().trim().min(1, 'La descripción es requerida'),
    usuario_asignado_id: z.preprocess((val) => {
      if (val === '' || val === null || val === undefined) return undefined;
      const parsed = Number(val);
      return isNaN(parsed) ? undefined : parsed;
    }, z.number().int().positive().optional()).nullable(),
  }),
};

module.exports = { validar, schemas };  