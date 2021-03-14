import mongoose from 'mongoose';

export interface IMessage extends mongoose.Document {
	msgId: string;
	formUser: mongoose.Schema.Types.ObjectId;
	toUser: mongoose.Schema.Types.ObjectId;
	content: string;
	sentByMe: boolean;
	time: number;
}

const MessageSchema = new mongoose.Schema(
	{
		msgId: String,
		formUser: { type: [ mongoose.Schema.Types.ObjectId ], ref: 'users' },
		toUser: { type: [ mongoose.Schema.Types.ObjectId ], ref: 'users' },
		content: String,
		sentByMe: Boolean,
		time: Number,
	},
	{ optimisticConcurrency: true }
);

const Message = mongoose.model<IMessage>('views', MessageSchema);
export default Message;
