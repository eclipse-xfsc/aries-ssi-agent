import Joi from 'joi';

export const validationSchema = Joi.object({
  HTTP_HOSTNAME: Joi.string(),
  HTTP_PORT: Joi.number(),

  NATS_URL: Joi.string().uri(),
  NATS_USER: Joi.string().optional(),
  NATS_PASSWORD: Joi.string().optional(),
  NATS_MONITORING_URL: Joi.string().uri(),
});
