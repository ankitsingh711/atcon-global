import mongoose, { Document, Model, Schema } from 'mongoose';

export type ContactStatus = 'Active' | 'Inactive';

export interface IContactDocument extends Document {
    name: string;
    email: string;
    phone: string;
    company: string;
    role: string;
    status: ContactStatus;
    createdAt: Date;
    updatedAt: Date;
}

const ContactSchema = new Schema<IContactDocument>(
    {
        name: { type: String, required: true, trim: true },
        email: { type: String, required: true, trim: true, lowercase: true },
        phone: { type: String, default: '' },
        company: { type: String, default: '' },
        role: { type: String, default: '' },
        status: {
            type: String,
            enum: ['Active', 'Inactive'],
            default: 'Active',
            required: true,
        },
    },
    { timestamps: true }
);

ContactSchema.index({ name: 'text', email: 'text', company: 'text' });
ContactSchema.index({ status: 1 });

const Contact: Model<IContactDocument> =
    mongoose.models.Contact || mongoose.model<IContactDocument>('Contact', ContactSchema);

export default Contact;
