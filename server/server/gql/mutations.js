import { schemaComposer } from 'graphql-compose';
import './models/playlists';
import './models/playlistSongs';

export const MutationRoot = schemaComposer.Mutation;
