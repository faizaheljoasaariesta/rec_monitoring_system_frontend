import type { Schema } from 'joi';

export const validateSchema = (schema: Schema, data: unknown): string | null => {
  const { error } = schema.validate(data, { abortEarly: false });
  if (error) {
    return error.details.map((err) => err.message).join(', ');
  }
  return null;
};
