import express from 'express';
import dotenv from 'dotenv';
import { ApolloServer } from 'apollo-server-express';
import { createServer } from 'http';
import { apolloServerContextResolver } from '@middleware/gqlAuth';
import rTracer from 'cls-rtracer';
import cors from 'cors';
import bodyParser from 'body-parser';
import { connectDB } from '@database';
import { logger } from '@utils/index';
import depthLimit from 'graphql-depth-limit';
import { schemaComposer } from 'graphql-compose';
import '@gql/queries';
import '@gql/mutations';

let app;

export const init = async () => {
  dotenv.config({
    path: `.env.${process.env.ENVIRONMENT_NAME || 'local'}`
  });

  await connectDB();

  const schema = schemaComposer.buildSchema();

  if (!app) {
    app = express();
  }

  app.use(rTracer.expressMiddleware());
  app.use(cors({ origin: true }));
  app.use(bodyParser.json({ limit: '10mb' }));
  app.use(bodyParser.urlencoded({ extended: true }));

  app.get('/health', (req, res) => {
    res.json({ status: 'healthy', timestamp: new Date().toISOString() });
  });

  const httpServer = createServer(app);

  const server = new ApolloServer({
    schema,
    plugins: [
      {
        requestDidStart() {
          return {
            didEncounterErrors(ctx) {
              if (!ctx.operation) return;
              for (const err of ctx.errors) {
                logger().error('GraphQL Error', {
                  message: err.message,
                  path: err.path
                });
              }
            }
          };
        }
      }
    ],
    validationRules: [depthLimit(10)],
    context: apolloServerContextResolver,
    introspection: process.env.ENVIRONMENT_NAME !== 'production'
  });

  await server.start();
  server.applyMiddleware({ app, path: '/graphql' });

  const PORT = process.env.PORT || 9000;
  httpServer.listen(PORT, () => {
    logger().info(`Server ready at http://localhost:${PORT}/graphql`);
  });
};

if (process.env.NODE_ENV !== 'test') {
  init().catch((error) => {
    logger().error('Failed to start server:', error);
    process.exit(1);
  });
}

export { app };
