import mongoose, { Document, Model, Schema } from 'mongoose';

export type DealStage = 'Lead' | 'Qualified' | 'Proposal' | 'Negotiation' | 'Closed Won';

export interface IDealDocument extends Document {
    name: string;
    client: string;
    value: number;
    stage: DealStage;
    probability: number;
    expectedCloseDate?: Date;
    createdAt: Date;
    updatedAt: Date;
}

const DealSchema = new Schema<IDealDocument>(
    {
        name: { type: String, required: true, trim: true },
        client: { type: String, required: true, trim: true },
        value: { type: Number, required: true, min: 0 },
        stage: {
            type: String,
            enum: ['Lead', 'Qualified', 'Proposal', 'Negotiation', 'Closed Won'],
            default: 'Lead',
            required: true,
        },
        probability: { type: Number, min: 0, max: 100, default: 20 },
        expectedCloseDate: { type: Date },
    },
    { timestamps: true }
);

DealSchema.index({ name: 'text', client: 'text' });
DealSchema.index({ stage: 1 });
DealSchema.index({ createdAt: -1 });

const Deal: Model<IDealDocument> =
    mongoose.models.Deal || mongoose.model<IDealDocument>('Deal', DealSchema);

export default Deal;
