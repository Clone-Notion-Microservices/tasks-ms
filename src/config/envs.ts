import 'dotenv/config';

import * as joi from 'joi';
import * as process from 'node:process';

interface EnvVariables {
  PORT: number;
  DATABASE_URL: string;
}

const envsSchema = joi.object({
  PORT: joi.number().required(),
  DATABASE_URL: joi.string().required(),
})
  .unknown(true);

const { error, value } = envsSchema.validate(process.env);

if (error) {
  throw new Error(`Validation error: ${error.message}`);
}

const envVariables: EnvVariables = value;
export const envs = {
  port: envVariables.PORT,
  databaseUrl: envVariables.DATABASE_URL
};