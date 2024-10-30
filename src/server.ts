import cors from '@fastify/cors';
import { fastify } from 'fastify';
import {
  serializerCompiler,
  validatorCompiler,
} from 'fastify-type-provider-zod';
import createDevice from './routes/create-device';
import getData from './routes/get-data';
import getSensorData from './routes/get-sensor-data';
import uploadData from './routes/upload-data';

const app = fastify();

app.register(cors, {
  origin: '*',
});

app.setValidatorCompiler(validatorCompiler);
app.setSerializerCompiler(serializerCompiler);

app.register(uploadData);
app.register(getData);
app.register(getSensorData);
// app.register(sendNotification);
app.register(createDevice);

app
  .listen({
    host: 'RENDER' in process.env ? '0.0.0.0' : 'localhost',
    port: process.env.PORT ? Number(process.env.PORT) : 4000,
  })
  .then(() => {
    console.log('Server running!');
  });
