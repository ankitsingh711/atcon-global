import mongoose, { Document, Model, Schema } from 'mongoose';

export interface ITalentDocument extends Document {
    name: string;
    role: string;
    skills: string[];
    experience: string;
    rate: string;
    availability: 'Available' | 'On Project';
    rating: number;
    color: string;
    createdAt: Date;
    updatedAt: Date;
}

const TalentSchema = new Schema<ITalentDocument>(
    {
        name: { type: String, required: true, trim: true },
        role: { type: String, required: true, trim: true },
        skills: [{ type: String, trim: true }],
        experience: { type: String, default: '' },
        rate: { type: String, default: '' },
        availability: {
            type: String,
            enum: ['Available', 'On Project'],
            default: 'Available',
            required: true,
        },
        rating: { type: Number, default: 4.5, min: 0, max: 5 },
        color: { type: String, default: '#6366F1' },
    },
    { timestamps: true }
);

TalentSchema.index({ name: 'text', role: 'text' });
TalentSchema.index({ availability: 1 });

const Talent: Model<ITalentDocument> =
    mongoose.models.Talent || mongoose.model<ITalentDocument>('Talent', TalentSchema);

export default Talent;
