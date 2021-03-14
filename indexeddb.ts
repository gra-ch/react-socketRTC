import { DBSchema } from 'idb';

export interface IMedia {
	fileName: string;
	type: string;
	src?: string;
}

export interface IMessage {
	msgId: string;
	formUser: string;
	toUser: string;
	// formUser: mongoose.Schema.Types.ObjectId;
	// toUser: mongoose.Schema.Types.ObjectId;
	content: string;
	media: IMedia[];
	sentByMe: boolean;
	time: number;
}

export interface IAppMessageDB extends DBSchema {
	appMessages: {
		value: IMessage[];
		key: string;
	};
}

const STORE_NAME = 'appMessages';

export { STORE_NAME };
