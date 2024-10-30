import { FastifyInstance } from 'fastify';
import { ZodTypeProvider } from 'fastify-type-provider-zod';
import { z } from 'zod';
import { mysql } from '../lib/mysql';

const parsedReadingsSchema = z.record(z.number());

export default async function uploadData(app: FastifyInstance) {
  app.withTypeProvider<ZodTypeProvider>().get(
    '/data/upload',
    {
      schema: {
        querystring: z.object({
          sensorId: z.number(),
          readings: z.string(),
        }),
      },
    },
    (request, reply) => {
      const { sensorId, readings } = request.query;

      mysql.getConnection((databaseError, databaseConnection) => {
        if (databaseError) {
          return reply.code(500).send({ databaseError: databaseError });
        }

        const parsedReadings = JSON.parse(readings);

        if (!parsedReadingsSchema.safeParse(parsedReadings).success) {
          return reply.code(400).send('Invalid readings format.');
        }

        for (const [physicalQuantity, magnitude] of Object.entries(
          parsedReadings
        )) {
          databaseConnection.query(
            'INSERT INTO readings (sensor_id, physical_quantity, magnitude) VALUES (?, ?, ?)',
            [sensorId, physicalQuantity, magnitude],
            (queryError) => {
              if (queryError) {
                return reply.code(501).send({ queryError: queryError });
              }
            }
          );
        }

        databaseConnection.release();
        return reply.code(200).send('Data inserted successfully.');
      });
    }
  );
}
