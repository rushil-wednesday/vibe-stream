import { schemaComposer } from 'graphql-compose';
import { Playlist, PlaylistTC } from '@database/models/playlists';
import { PlaylistSong } from '@database/models/playlistSongs';
import { MAX_PLAYLISTS_PER_USER } from '@utils/constants';
import { handleError, handleValidationError } from '@utils';

// --- Queries ---

PlaylistTC.addResolver({
  name: 'myPlaylists',
  type: [PlaylistTC],
  resolve: async ({ context }) => {
    try {
      return await Playlist.find({ userId: context.userId }).sort({ createdAt: -1 });
    } catch (err) {
      throw handleError(err);
    }
  }
});

// --- Mutations ---

PlaylistTC.addResolver({
  name: 'createPlaylist',
  type: PlaylistTC,
  args: { name: 'String!' },
  resolve: async ({ args, context }) => {
    try {
      const count = await Playlist.countDocuments({ userId: context.userId });
      if (count >= MAX_PLAYLISTS_PER_USER) {
        handleValidationError(`Maximum of ${MAX_PLAYLISTS_PER_USER} playlists reached`);
      }
      return await Playlist.create({ userId: context.userId, name: args.name });
    } catch (err) {
      throw handleError(err);
    }
  }
});

PlaylistTC.addResolver({
  name: 'renamePlaylist',
  type: PlaylistTC,
  args: { id: 'MongoID!', name: 'String!' },
  resolve: async ({ args, context }) => {
    try {
      const playlist = await Playlist.findOneAndUpdate(
        { _id: args.id, userId: context.userId },
        { name: args.name },
        { new: true }
      );
      if (!playlist) {
        handleValidationError('Playlist not found or not owned by user');
      }
      return playlist;
    } catch (err) {
      throw handleError(err);
    }
  }
});

PlaylistTC.addResolver({
  name: 'deletePlaylist',
  type: PlaylistTC,
  args: { id: 'MongoID!' },
  resolve: async ({ args, context }) => {
    try {
      const playlist = await Playlist.findOneAndDelete({ _id: args.id, userId: context.userId });
      if (!playlist) {
        handleValidationError('Playlist not found or not owned by user');
      }
      // Cascade delete songs
      await PlaylistSong.deleteMany({ playlistId: args.id });
      return playlist;
    } catch (err) {
      throw handleError(err);
    }
  }
});

// --- Wire to schema ---

schemaComposer.Query.addFields({
  myPlaylists: PlaylistTC.getResolver('myPlaylists')
});

schemaComposer.Mutation.addFields({
  createPlaylist: PlaylistTC.getResolver('createPlaylist'),
  renamePlaylist: PlaylistTC.getResolver('renamePlaylist'),
  deletePlaylist: PlaylistTC.getResolver('deletePlaylist')
});

export { PlaylistTC };
