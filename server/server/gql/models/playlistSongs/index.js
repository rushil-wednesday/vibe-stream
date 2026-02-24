import { schemaComposer } from 'graphql-compose';
import { Playlist } from '@database/models/playlists';
import { PlaylistSong, PlaylistSongTC } from '@database/models/playlistSongs';
import { MAX_SONGS_PER_PLAYLIST } from '@utils/constants';
import { handleError, handleValidationError } from '@utils';

// --- Queries ---

PlaylistSongTC.addResolver({
  name: 'playlistSongs',
  type: [PlaylistSongTC],
  args: { playlistId: 'MongoID!' },
  resolve: async ({ args, context }) => {
    try {
      // Verify ownership
      const playlist = await Playlist.findOne({ _id: args.playlistId, userId: context.userId });
      if (!playlist) {
        handleValidationError('Playlist not found or not owned by user');
      }
      return await PlaylistSong.find({ playlistId: args.playlistId }).sort({ position: 1 });
    } catch (err) {
      throw handleError(err);
    }
  }
});

// --- Mutations ---

PlaylistSongTC.addResolver({
  name: 'addSongToPlaylist',
  type: PlaylistSongTC,
  args: {
    playlistId: 'MongoID!',
    songData: schemaComposer.createInputTC({
      name: 'SongDataInput',
      fields: {
        trackId: 'Int!',
        trackName: 'String!',
        artistName: 'String!',
        collectionName: 'String',
        artworkUrl100: 'String',
        previewUrl: 'String',
        trackTimeMillis: 'Int',
        primaryGenreName: 'String',
        releaseDate: 'String'
      }
    })
  },
  resolve: async ({ args, context }) => {
    try {
      const playlist = await Playlist.findOne({ _id: args.playlistId, userId: context.userId });
      if (!playlist) {
        handleValidationError('Playlist not found or not owned by user');
      }

      const songCount = await PlaylistSong.countDocuments({ playlistId: args.playlistId });
      if (songCount >= MAX_SONGS_PER_PLAYLIST) {
        handleValidationError(`Maximum of ${MAX_SONGS_PER_PLAYLIST} songs per playlist reached`);
      }

      // Auto-position at end
      const lastSong = await PlaylistSong.findOne({ playlistId: args.playlistId }).sort({ position: -1 });
      const nextPosition = lastSong ? lastSong.position + 1 : 0;

      return await PlaylistSong.create({
        playlistId: args.playlistId,
        songData: args.songData,
        position: nextPosition
      });
    } catch (err) {
      throw handleError(err);
    }
  }
});

PlaylistSongTC.addResolver({
  name: 'removeSongFromPlaylist',
  type: PlaylistSongTC,
  args: { songId: 'MongoID!' },
  resolve: async ({ args, context }) => {
    try {
      const song = await PlaylistSong.findById(args.songId);
      if (!song) {
        handleValidationError('Song not found');
      }

      // Verify ownership via playlist
      const playlist = await Playlist.findOne({ _id: song.playlistId, userId: context.userId });
      if (!playlist) {
        handleValidationError('Playlist not owned by user');
      }

      await PlaylistSong.findByIdAndDelete(args.songId);

      // Close position gaps left by the deleted song
      await PlaylistSong.updateMany(
        { playlistId: song.playlistId, position: { $gt: song.position } },
        { $inc: { position: -1 } }
      );

      return song;
    } catch (err) {
      throw handleError(err);
    }
  }
});

PlaylistSongTC.addResolver({
  name: 'reorderSong',
  type: 'Boolean',
  args: {
    playlistId: 'MongoID!',
    songId: 'MongoID!',
    newPosition: 'Int!'
  },
  resolve: async ({ args, context }) => {
    try {
      const playlist = await Playlist.findOne({ _id: args.playlistId, userId: context.userId });
      if (!playlist) {
        handleValidationError('Playlist not found or not owned by user');
      }

      const songs = await PlaylistSong.find({ playlistId: args.playlistId }).sort({ position: 1 });
      const currentIndex = songs.findIndex((s) => s._id.toString() === args.songId);
      if (currentIndex === -1) {
        handleValidationError('Song not found in playlist');
      }

      if (args.newPosition < 0 || args.newPosition >= songs.length) {
        handleValidationError('Invalid new position');
      }

      // Remove and reinsert at new position
      const reordered = [...songs];
      const [moved] = reordered.splice(currentIndex, 1);
      reordered.splice(args.newPosition, 0, moved);

      // Bulk update positions
      const bulkOps = reordered.map((song, index) => ({
        updateOne: {
          filter: { _id: song._id },
          update: { $set: { position: index } }
        }
      }));

      await PlaylistSong.bulkWrite(bulkOps);
      return true;
    } catch (err) {
      throw handleError(err);
    }
  }
});

// --- Wire to schema ---

schemaComposer.Query.addFields({
  playlistSongs: PlaylistSongTC.getResolver('playlistSongs')
});

schemaComposer.Mutation.addFields({
  addSongToPlaylist: PlaylistSongTC.getResolver('addSongToPlaylist'),
  removeSongFromPlaylist: PlaylistSongTC.getResolver('removeSongFromPlaylist'),
  reorderSong: PlaylistSongTC.getResolver('reorderSong')
});

export { PlaylistSongTC };
