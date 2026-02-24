import mongoose from 'mongoose';
import { composeMongoose } from 'graphql-compose-mongoose';
import { schemaComposer } from 'graphql-compose';

const playlistSchema = new mongoose.Schema(
  {
    userId: {
      type: String,
      required: true,
      index: true
    },
    name: {
      type: String,
      required: true,
      trim: true
    }
  },
  {
    timestamps: true,
    collection: 'playlists'
  }
);

playlistSchema.index({ userId: 1, createdAt: -1 });

const Playlist = mongoose.models.playlists || mongoose.model('playlists', playlistSchema);
const PlaylistTC = composeMongoose(Playlist, { schemaComposer });

export { Playlist, PlaylistTC, playlistSchema };
