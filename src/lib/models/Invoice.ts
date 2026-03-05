import mongoose, { Document, Model, Schema } from 'mongoose';

export interface IInvoiceDocument extends Document {
    invoiceNumber: string;
    client: string;
    project: string;
    amount: number;
    date: Date;
    dueDate: Date;
    status: 'Paid' | 'Pending' | 'Overdue';
    createdAt: Date;
    updatedAt: Date;
}

const InvoiceSchema = new Schema<IInvoiceDocument>(
    {
        invoiceNumber: { type: String, required: true, unique: true },
        client: { type: String, required: true, trim: true },
        project: { type: String, default: '' },
        amount: { type: Number, required: true, min: 0 },
        date: { type: Date, required: true },
        dueDate: { type: Date, required: true },
        status: {
            type: String,
            enum: ['Paid', 'Pending', 'Overdue'],
            default: 'Pending',
            required: true,
        },
    },
    { timestamps: true }
);

InvoiceSchema.index({ invoiceNumber: 1 });
InvoiceSchema.index({ client: 'text' });
InvoiceSchema.index({ status: 1 });

const Invoice: Model<IInvoiceDocument> =
    mongoose.models.Invoice || mongoose.model<IInvoiceDocument>('Invoice', InvoiceSchema);

export default Invoice;
