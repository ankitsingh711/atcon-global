import mongoose, { Schema, Document, Model } from 'mongoose';

export interface IClientDocument extends Document {
    name: string;
    email: string;
    company: string;
    industry: string;
    contact: string;
    status: 'Active' | 'Inactive' | 'Prospect';
}

const ClientSchema = new Schema<IClientDocument>(
    {
        name: { type: String, required: true },
        email: { type: String, required: true },
        company: { type: String, required: true },
        industry: { type: String, default: '' },
        contact: { type: String, default: '' },
        status: {
            type: String,
            enum: ['Active', 'Inactive', 'Prospect'],
            default: 'Active',
            required: true,
        },
    },
    { timestamps: true }
);

const Client: Model<IClientDocument> =
    mongoose.models.Client || mongoose.model<IClientDocument>('Client', ClientSchema);

export default Client;
