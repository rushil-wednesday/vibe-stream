import { schemaComposer } from 'graphql-compose';
import './models/playlists';
import './models/playlistSongs';

schemaComposer.Query.addFields({
  health: {
    type: 'String',
    resolve: () => 'API is healthy'
  }
});

export const QueryRoot = schemaComposer.Query;
