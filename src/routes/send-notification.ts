// import { FastifyInstance } from 'fastify';
// import { ZodTypeProvider } from 'fastify-type-provider-zod';
// import { getMessaging } from 'firebase-admin/messaging';
// import { RowDataPacket } from 'mysql2';
// import { z } from 'zod';
// import { mysql } from '../lib/mysql';

// export default async function sendNotification(app: FastifyInstance) {
//   app.withTypeProvider<ZodTypeProvider>().post(
//     '/notifications',
//     {
//       schema: {
//         body: z.object({
//           title: z.string(),
//           body: z.string(),
//         }),
//       },
//     },
//     (request, reply) => {
//       const { title, body } = request.body;

//       mysql.getConnection((databaseError, databaseConnection) => {
//         if (databaseError) {
//           return reply.code(500).send({ databaseError: databaseError });
//         }

//         databaseConnection.query(
//           'SELECT * FROM devices',
//           async (queryError, devices) => {
//             databaseConnection.release();

//             if (queryError) {
//               return reply.code(500).send({ queryError: queryError });
//             }

//             devices = devices as RowDataPacket[];

//             if (devices.length === 0) {
//               return reply.code(404).send('No devices found.');
//             }

//             try {
//               await getMessaging().sendMulticast({
//                 notification: {
//                   title,
//                   body,
//                 },
//                 tokens: devices.map((device) => device.token),
//               });

//               reply.code(200).send('Notification sent successfully.');
//             } catch (notificationError) {
//               return reply
//                 .code(500)
//                 .send({ notificationError: notificationError });
//             }
//           }
//         );
//       });
//     }
//   );
// }
