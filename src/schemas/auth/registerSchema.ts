import Joi from 'joi';

const registerSchema = Joi.object({
  name: Joi.string()
    .min(3)
    .max(100)
    .required()
    .messages({
      'string.base': 'Nama harus berupa teks.',
      'string.min': 'Nama minimal terdiri dari 3 karakter.',
      'string.max': 'Nama tidak boleh lebih dari 100 karakter.',
      'any.required': 'Nama wajib diisi.',
    }),
  email: Joi.string()
    .email({ tlds: false })
    .regex(/^[^@]+@(mail\.ugm\.ac\.id|ugm\.ac\.id)$/)
    .required()
    .messages({
      'string.base': 'Email harus berupa karakter.',
      'string.email': 'Email harus dalam format yang valid.',
      'string.pattern.base': 'Email hanya diperbolehkan dengan domain @mail.ugm.ac.id atau @ugm.ac.id.',
      'any.required': 'Email wajib diisi.',
    }),
  password: Joi.string()
    .min(4)
    .max(16)
    .required()
    .messages({
      'string.base': 'Password harus berupa karakter.',
      'string.min': 'Password minimal 4 karakter.',
      'string.max': 'Password maksimal 16 karakter.',
      'any.required': 'Password wajib diisi.',
    }),
  confirmPassword: Joi.any()
    .valid(Joi.ref('password'))
    .required()
    .messages({
      'string.base': 'Password harus berupa karakter.',
      'string.min': 'Password minimal 4 karakter.',
      'string.max': 'Password maksimal 16 karakter.',
      'any.only': 'Konfirmasi password tidak cocok.',
      'any.required': 'Konfirmasi Password wajib diisi.',
    }),
});

export default registerSchema;
