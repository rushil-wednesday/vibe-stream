import { logger } from '@utils';

export const apolloServerContextResolver = async ({ req }) => {
  const internalSecret = process.env.GRAPHQL_INTERNAL_SECRET;
  const secret = req.headers['x-internal-secret'];
  const userId = req.headers['x-user-id'];

  if (!internalSecret || secret !== internalSecret) {
    logger().error('Invalid or missing internal secret');
    throw new Error('Unauthorized');
  }

  if (!userId) {
    logger().error('Missing x-user-id header');
    throw new Error('Unauthorized: no user ID');
  }

  return { userId };
};
