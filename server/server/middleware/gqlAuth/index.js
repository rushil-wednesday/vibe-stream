import { logger } from '@utils';

export const apolloServerContextResolver = async ({ req }) => {
  const internalSecret = process.env.GRAPHQL_INTERNAL_SECRET;
  const secret = req.headers['x-internal-secret'];
  const rawUserId = req.headers['x-user-id'];

  if (!internalSecret || secret !== internalSecret) {
    logger().error('Invalid or missing internal secret');
    throw new Error('Unauthorized');
  }

  const userId = Array.isArray(rawUserId) ? rawUserId[0] : rawUserId;

  if (!userId) {
    logger().error('Missing x-user-id header');
    throw new Error('Unauthorized');
  }

  return { userId };
};
