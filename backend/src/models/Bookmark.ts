import mongoose, { Schema, Document, Model } from 'mongoose';

/** Bookmark document interface. */
export interface IBookmark extends Document {
  _id: mongoose.Types.ObjectId;
  user: mongoose.Types.ObjectId;
  blog: mongoose.Types.ObjectId;
  createdAt: Date;
}

const bookmarkSchema = new Schema<IBookmark>(
  {
    user: {
      type: Schema.Types.ObjectId,
      ref: 'User',
      required: true,
    },
    blog: {
      type: Schema.Types.ObjectId,
      ref: 'Blog',
      required: true,
    },
  },
  {
    timestamps: true,
    toJSON: {
      transform(_doc, ret) {
        delete (ret as any).__v;
        return ret;
      },
    },
  },
);

// Ensure one bookmark per user per blog
bookmarkSchema.index({ user: 1, blog: 1 }, { unique: true });

export const Bookmark: Model<IBookmark> = mongoose.model<IBookmark>('Bookmark', bookmarkSchema);
