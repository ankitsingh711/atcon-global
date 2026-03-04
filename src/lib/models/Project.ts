import mongoose, { Schema, Document, Model } from 'mongoose';

export interface IProjectDocument extends Document {
    name: string;
    client: string;
    status: 'Planning' | 'In Progress' | 'Completed' | 'On Hold' | 'Cancelled';
    projectManager: string;
    description: string;
    startDate: Date;
    endDate: Date;
    billingType: 'Fixed Price' | 'Hourly' | 'Retainer';
    budget: number;
    spent: number;
    progress: number;
    requireTimesheets: boolean;
    clientTimesheetApproval: boolean;
    tags: string[];
}

const ProjectSchema = new Schema<IProjectDocument>(
    {
        name: { type: String, required: true, trim: true },
        client: { type: String, required: true, trim: true },
        status: {
            type: String,
            enum: ['Planning', 'In Progress', 'Completed', 'On Hold', 'Cancelled'],
            default: 'Planning',
            required: true,
        },
        projectManager: { type: String, required: true, trim: true },
        description: { type: String, default: '' },
        startDate: { type: Date, required: true },
        endDate: { type: Date, required: true },
        billingType: {
            type: String,
            enum: ['Fixed Price', 'Hourly', 'Retainer'],
            default: 'Fixed Price',
        },
        budget: { type: Number, default: 0, min: 0 },
        spent: { type: Number, default: 0, min: 0 },
        progress: { type: Number, default: 0, min: 0, max: 100 },
        requireTimesheets: { type: Boolean, default: false },
        clientTimesheetApproval: { type: Boolean, default: false },
        tags: [{ type: String, trim: true }],
    },
    {
        timestamps: true,
        toJSON: { virtuals: true },
        toObject: { virtuals: true },
    }
);

// Index for search & filtering
ProjectSchema.index({ name: 'text', client: 'text', projectManager: 'text' });
ProjectSchema.index({ status: 1 });
ProjectSchema.index({ createdAt: -1 });

const Project: Model<IProjectDocument> =
    mongoose.models.Project || mongoose.model<IProjectDocument>('Project', ProjectSchema);

export default Project;
