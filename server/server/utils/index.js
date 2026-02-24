import { GraphQLError } from 'graphql';
import { createLogger, format, transports } from 'winston';
import rTracer from 'cls-rtracer';
import { ERROR_TYPES } from './constants';

const { combine, timestamp, printf } = format;

export const isTestEnv = () => process.env.ENVIRONMENT_NAME === 'test' || process.env.NODE_ENV === 'test';
export const isLocalEnv = () => process.env.ENVIRONMENT_NAME === 'local';

export const stringifyWithCheck = (message) => {
  if (!message) {
    return '';
  }
  try {
    return JSON.stringify(message);
  } catch (err) {
    if (message.data) {
      return stringifyWithCheck(message.data);
    }
    return `unable to unfurl message: ${message}`;
  }
};

export const logger = () => {
  const rTracerFormat = printf((info) => {
    const rid = rTracer.id();
    const infoSplat = info[Symbol.for('splat')] || [];
    const message = `${info.timestamp}: ${stringifyWithCheck(info.message)} ${stringifyWithCheck(...infoSplat)}`;
    if (rid) {
      return `[request-id:${rid}]: ${message}`;
    }
    return message;
  });

  return createLogger({
    format: combine(timestamp(), rTracerFormat),
    transports: [new transports.Console()]
  });
};

export const handleValidationError = (err) => {
  const error = new Error(`${ERROR_TYPES.VALIDATION_ERROR} - ${err}`);
  Object.assign(error, { code: ERROR_TYPES.VALIDATION_ERROR });
  throw error;
};

export const handleError = (err) => {
  const isCustomOrValidationError = err.code === ERROR_TYPES.CUSTOM_ERROR || err.code === ERROR_TYPES.VALIDATION_ERROR;
  const message = err.message || err;
  if (isCustomOrValidationError) {
    return new GraphQLError(message, { extensions: { code: err.code } });
  }
  logger().error('Internal server error:', message);
  return new GraphQLError(`${ERROR_TYPES.SERVER_ERROR} - Internal Server Error`);
};
