import mongoose, { Schema, Document, Model } from 'mongoose';

/** Like document interface. */
export interface ILike extends Document {
  _id: mongoose.Types.ObjectId;
  user: mongoose.Types.ObjectId;
  blog: mongoose.Types.ObjectId;
  createdAt: Date;
}

const likeSchema = new Schema<ILike>(
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

// Ensure one like per user per blog
likeSchema.index({ user: 1, blog: 1 }, { unique: true });

export const Like: Model<ILike> = mongoose.model<ILike>('Like', likeSchema);
