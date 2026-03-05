import mongoose, { Document, Model, Schema } from 'mongoose';

export interface ISupportTicketDocument extends Document {
    ticketId: string;
    title: string;
    client: string;
    priority: 'High' | 'Medium' | 'Low';
    status: 'Open' | 'In Progress' | 'Resolved';
    assignee: string;
    createdAt: Date;
    updatedAt: Date;
}

const SupportTicketSchema = new Schema<ISupportTicketDocument>(
    {
        ticketId: { type: String, required: true, unique: true },
        title: { type: String, required: true, trim: true },
        client: { type: String, required: true, trim: true },
        priority: {
            type: String,
            enum: ['High', 'Medium', 'Low'],
            default: 'Medium',
            required: true,
        },
        status: {
            type: String,
            enum: ['Open', 'In Progress', 'Resolved'],
            default: 'Open',
            required: true,
        },
        assignee: { type: String, default: 'Unassigned' },
    },
    { timestamps: true }
);

SupportTicketSchema.index({ title: 'text', client: 'text' });
SupportTicketSchema.index({ status: 1 });
SupportTicketSchema.index({ priority: 1 });

const SupportTicket: Model<ISupportTicketDocument> =
    mongoose.models.SupportTicket ||
    mongoose.model<ISupportTicketDocument>('SupportTicket', SupportTicketSchema);

export default SupportTicket;
