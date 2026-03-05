import mongoose, { Document, Model, Schema } from 'mongoose';

export interface IPersonDocument extends Document {
    name: string;
    email: string;
    department: string;
    role: string;
    type: 'Employee' | 'Contractor';
    status: 'Active' | 'On Leave' | 'Offboarded';
    joinDate: Date;
    color: string;
    createdAt: Date;
    updatedAt: Date;
}

const PersonSchema = new Schema<IPersonDocument>(
    {
        name: { type: String, required: true, trim: true },
        email: { type: String, required: true, trim: true, lowercase: true },
        department: { type: String, default: '' },
        role: { type: String, default: '' },
        type: {
            type: String,
            enum: ['Employee', 'Contractor'],
            default: 'Employee',
            required: true,
        },
        status: {
            type: String,
            enum: ['Active', 'On Leave', 'Offboarded'],
            default: 'Active',
            required: true,
        },
        joinDate: { type: Date, default: () => new Date() },
        color: { type: String, default: '#6366F1' },
    },
    { timestamps: true }
);

PersonSchema.index({ name: 'text', email: 'text', department: 'text' });
PersonSchema.index({ type: 1 });
PersonSchema.index({ status: 1 });

const Person: Model<IPersonDocument> =
    mongoose.models.Person || mongoose.model<IPersonDocument>('Person', PersonSchema);

export default Person;
