import mongoose, { Document, Model, Schema } from 'mongoose';

export type ApprovalContext = 'dashboard' | 'client-portal';
export type ApprovalStatus = 'Pending' | 'Approved' | 'Rejected';
export type ApprovalType = 'Timesheet' | 'Invoice' | 'Leave';

export interface IApprovalDocument extends Document {
    context: ApprovalContext;
    type: ApprovalType;
    title: string;
    dueDate: Date;
    freelancer?: string;
    project?: string;
    week?: string;
    hours?: number;
    amount?: number;
    status: ApprovalStatus;
    createdAt: Date;
    updatedAt: Date;
}

const ApprovalSchema = new Schema<IApprovalDocument>(
    {
        context: {
            type: String,
            enum: ['dashboard', 'client-portal'],
            default: 'dashboard',
            required: true,
        },
        type: {
            type: String,
            enum: ['Timesheet', 'Invoice', 'Leave'],
            required: true,
        },
        title: { type: String, required: true, trim: true },
        dueDate: { type: Date, required: true },
        freelancer: { type: String, trim: true },
        project: { type: String, trim: true },
        week: { type: String, trim: true },
        hours: { type: Number, min: 0 },
        amount: { type: Number, min: 0 },
        status: {
            type: String,
            enum: ['Pending', 'Approved', 'Rejected'],
            default: 'Pending',
            required: true,
        },
    },
    { timestamps: true }
);

ApprovalSchema.index({ context: 1, status: 1, dueDate: 1 });

const Approval: Model<IApprovalDocument> =
    mongoose.models.Approval || mongoose.model<IApprovalDocument>('Approval', ApprovalSchema);

export default Approval;
