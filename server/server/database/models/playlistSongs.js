import mongoose from 'mongoose';
import { composeMongoose } from 'graphql-compose-mongoose';
import { schemaComposer } from 'graphql-compose';

const playlistSongSchema = new mongoose.Schema(
  {
    playlistId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'playlists',
      required: true
    },
    songData: {
      trackId: { type: Number, required: true },
      trackName: { type: String, required: true },
      artistName: { type: String, required: true },
      collectionName: { type: String },
      artworkUrl100: { type: String },
      previewUrl: { type: String },
      trackTimeMillis: { type: Number },
      primaryGenreName: { type: String },
      releaseDate: { type: String }
    },
    position: {
      type: Number,
      required: true,
      default: 0
    }
  },
  {
    timestamps: true,
    collection: 'playlist_songs'
  }
);

playlistSongSchema.index({ playlistId: 1, position: 1 });

const PlaylistSong = mongoose.models.playlist_songs || mongoose.model('playlist_songs', playlistSongSchema);
const PlaylistSongTC = composeMongoose(PlaylistSong, { schemaComposer });

export { PlaylistSong, PlaylistSongTC, playlistSongSchema };
