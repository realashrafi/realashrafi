// models/Message.ts
import mongoose, { Document, Model, Schema } from 'mongoose';

interface IMessage extends Document {
    content: string;
    userId: Schema.Types.ObjectId;
    roundtableId: Schema.Types.ObjectId;
    createdAt: Date;
}

const messageSchema = new mongoose.Schema<IMessage>(
    {
        content: { type: String, required: true },
        userId: { type: Schema.Types.ObjectId, ref: 'User', required: true },
        roundtableId: { type: Schema.Types.ObjectId, ref: 'Roundtable', required: true },
    },
    { timestamps: true }
);

const Message: Model<IMessage> =
    mongoose.models.Message || mongoose.model<IMessage>('Message', messageSchema);

export default Message;