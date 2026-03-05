import mongoose, { Document, Model, Schema } from 'mongoose';

export interface IFormEntryDocument extends Document {
    name: string;
    type: string;
    submissions: number;
    status: 'Active' | 'Draft' | 'Closed';
    completion: number;
    lastSubmission: Date | null;
    createdAt: Date;
    updatedAt: Date;
}

const FormEntrySchema = new Schema<IFormEntryDocument>(
    {
        name: { type: String, required: true, trim: true },
        type: { type: String, required: true, trim: true },
        submissions: { type: Number, default: 0, min: 0 },
        status: {
            type: String,
            enum: ['Active', 'Draft', 'Closed'],
            default: 'Active',
            required: true,
        },
        completion: { type: Number, default: 0, min: 0, max: 100 },
        lastSubmission: { type: Date, default: null },
    },
    { timestamps: true }
);

FormEntrySchema.index({ name: 'text' });
FormEntrySchema.index({ status: 1 });

const FormEntry: Model<IFormEntryDocument> =
    mongoose.models.FormEntry || mongoose.model<IFormEntryDocument>('FormEntry', FormEntrySchema);

export default FormEntry;
