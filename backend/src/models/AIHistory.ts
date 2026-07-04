import mongoose, { Schema, Document, Model } from 'mongoose';

/** AI History document interface for tracking AI usage. */
export interface IAIHistory extends Document {
  _id: mongoose.Types.ObjectId;
  user: mongoose.Types.ObjectId;
  blog?: mongoose.Types.ObjectId;
  action: string;
  input: string;
  output: string;
  aiModel: string;
  tokens: number;
  latencyMs: number;
  createdAt: Date;
}

const aiHistorySchema = new Schema<IAIHistory>(
  {
    user: {
      type: Schema.Types.ObjectId,
      ref: 'User',
      required: true,
      index: true,
    },
    blog: {
      type: Schema.Types.ObjectId,
      ref: 'Blog',
    },
    action: {
      type: String,
      required: true,
      enum: [
        'grammar_fix',
        'rewrite',
        'expand',
        'shorten',
        'continue',
        'generate_title',
        'generate_tags',
        'generate_seo',
        'generate_intro',
        'generate_conclusion',
        'summarize',
        'key_takeaways',
      ],
    },
    input: {
      type: String,
      required: true,
    },
    output: {
      type: String,
      required: true,
    },
    aiModel: {
      type: String,
      required: true,
    },
    tokens: {
      type: Number,
      default: 0,
    },
    latencyMs: {
      type: Number,
      default: 0,
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

aiHistorySchema.index({ user: 1, createdAt: -1 });

export const AIHistory: Model<IAIHistory> = mongoose.model<IAIHistory>(
  'AIHistory',
  aiHistorySchema,
);
