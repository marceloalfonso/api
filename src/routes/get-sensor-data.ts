import { FastifyInstance } from 'fastify';
import { ZodTypeProvider } from 'fastify-type-provider-zod';
import z from 'zod';
import { mysql } from '../lib/mysql';

export default async function getSensorData(app: FastifyInstance) {
  app.withTypeProvider<ZodTypeProvider>().get(
    '/data/:sensorId',
    {
      schema: {
        params: z.object({
          sensorId: z.string(),
        }),
      },
    },
    (request, reply) => {
      const { sensorId } = request.params;

      mysql.getConnection((databaseError, databaseConnection) => {
        if (databaseError) {
          return reply.code(500).send({ databaseError: databaseError });
        }

        databaseConnection.query(
          'SELECT * FROM readings WHERE sensor_id = ?',
          [sensorId],
          (queryError, sensorData) => {
            databaseConnection.release();

            if (queryError) {
              return reply.code(500).send({ queryError: queryError });
            }

            return reply.code(200).send(sensorData);
          }
        );
      });
    }
  );
}
