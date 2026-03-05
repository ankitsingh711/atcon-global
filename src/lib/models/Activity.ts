import mongoose, { Document, Model, Schema } from 'mongoose';

export interface IActivityDocument extends Document {
    user: string;
    action: string;
    color: string;
    occurredAt: Date;
    createdAt: Date;
    updatedAt: Date;
}

const ActivitySchema = new Schema<IActivityDocument>(
    {
        user: { type: String, required: true, trim: true },
        action: { type: String, required: true, trim: true },
        color: { type: String, default: '#6366F1' },
        occurredAt: { type: Date, default: () => new Date() },
    },
    { timestamps: true }
);

ActivitySchema.index({ occurredAt: -1 });

const Activity: Model<IActivityDocument> =
    mongoose.models.Activity || mongoose.model<IActivityDocument>('Activity', ActivitySchema);

export default Activity;
