export const MUTATION_TYPE = {
  CREATE: 'create',
  DELETE: 'delete',
  UPDATE: 'update'
};

export const ERROR_TYPES = {
  VALIDATION_ERROR: 'VALIDATION_ERROR',
  SERVER_ERROR: 'SERVER_ERROR',
  CUSTOM_ERROR: 'CUSTOM_ERROR'
};

export const HTTP_STATUS_CODES = Object.freeze({
  SUCCESS: 200,
  UNAUTHORIZED: 401,
  ERROR: 500
});

export const MAX_PLAYLISTS_PER_USER = 20;
export const MAX_SONGS_PER_PLAYLIST = 50;
