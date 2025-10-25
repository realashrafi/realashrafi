// models/Roundtable.ts
import mongoose, { Document, Model, Schema } from 'mongoose';

interface IRoundtable extends Document {
    title: string;
    creatorId: Schema.Types.ObjectId;
    participants: Schema.Types.ObjectId[];
    createdAt: Date;
}

const roundtableSchema = new mongoose.Schema<IRoundtable>(
    {
        title: { type: String, required: true },
        creatorId: { type: Schema.Types.ObjectId, ref: 'User', required: true },
        participants: [{ type: Schema.Types.ObjectId, ref: 'User' }],
    },
    { timestamps: true }
);

const Roundtable: Model<IRoundtable> =
    mongoose.models.Roundtable || mongoose.model<IRoundtable>('Roundtable', roundtableSchema);

export default Roundtable;