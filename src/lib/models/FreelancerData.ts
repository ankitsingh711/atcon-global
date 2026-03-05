import mongoose, { Document, Model, Schema } from 'mongoose';

interface ITimesheetRow {
    project: string;
    task: string;
    hours: number[];
}

export interface IFreelancerDataDocument extends Document {
    name: string;
    role: string;
    weekStart: Date;
    weekEnd: Date;
    timesheetStatus: 'Draft' | 'Submitted' | 'Approved';
    rows: ITimesheetRow[];
    createdAt: Date;
    updatedAt: Date;
}

const TimesheetRowSchema = new Schema<ITimesheetRow>(
    {
        project: { type: String, required: true, trim: true },
        task: { type: String, required: true, trim: true },
        hours: {
            type: [Number],
            required: true,
            validate: {
                validator: (value: number[]) =>
                    Array.isArray(value) &&
                    value.length === 7 &&
                    value.every((hours) => typeof hours === 'number' && hours >= 0 && hours <= 24),
                message: 'hours must contain 7 values between 0 and 24',
            },
        },
    },
    { _id: false }
);

const FreelancerDataSchema = new Schema<IFreelancerDataDocument>(
    {
        name: { type: String, required: true, trim: true },
        role: { type: String, required: true, trim: true },
        weekStart: { type: Date, required: true },
        weekEnd: { type: Date, required: true },
        timesheetStatus: {
            type: String,
            enum: ['Draft', 'Submitted', 'Approved'],
            default: 'Draft',
            required: true,
        },
        rows: { type: [TimesheetRowSchema], default: [] },
    },
    { timestamps: true }
);

const FreelancerData: Model<IFreelancerDataDocument> =
    mongoose.models.FreelancerData ||
    mongoose.model<IFreelancerDataDocument>('FreelancerData', FreelancerDataSchema);

export default FreelancerData;
