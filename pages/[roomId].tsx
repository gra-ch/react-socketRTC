import { useState } from 'react';
import { formatDistance } from 'date-fns';
import useChat from '../hooks/useChat';
import { IMessage } from '../indexeddb';

interface HTMLInputEvent extends React.ChangeEvent<HTMLInputElement> {
	target: HTMLInputElement & EventTarget;
}

const toBase64 = (file: File): Promise<any> => new Promise((resolve, reject) => {
	const reader = new FileReader();
	reader.readAsDataURL(file);
	reader.onload = () => resolve(reader.result);
	reader.onerror = error => reject(error);
});

const emptyObj = {
	msgId: '',
	formUser: '',
	toUser: '',
	content: '',
	media: [],
	sentByMe: false,
	time: 0,
};

const ChatRoom = (props: any) => {
	const { roomId, loggedInUserObj, signalProtocolManagerUser } = props;
	const { messages, sendMessage } = useChat(roomId as string); // Creates a websocket and manages messaging
	const [newMessage, setNewMessage] = useState<IMessage>(emptyObj); // Message to be sent
	const [selectedFile, setSelectedFile] = useState<any>();

	async function tranFileTo64(file: File) {
		return await toBase64(file);
	}

	const handleNewMessageChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
		setNewMessage({ ...newMessage, content: e.target.value });
	};

	const handleSendMessage = async () => {
		if(selectedFile) {
			const src = await tranFileTo64(selectedFile);
			newMessage.media.push({
				fileName: selectedFile.name,
				type: selectedFile.type,
				src,
			});
		}
		if(newMessage) {
			sendMessage(newMessage, signalProtocolManagerUser);
			setNewMessage(emptyObj);
		}
		console.log(newMessage);
	};

	const onEnterPress = (e: React.KeyboardEvent<HTMLTextAreaElement>) => {
		if(e.key === 'Enter' && e.shiftKey == false) {
			e.preventDefault();
			handleSendMessage();
		}
	};

	// On file select (from the pop up)
	const onFileChange = (event?: HTMLInputEvent) => {
		if(event?.target.files) {
			// Update the state
			setSelectedFile(event.target.files[0]);
		}
	};

	// File content to be displayed after file upload is complete
	const FileData = (): JSX.Element => {
		if(selectedFile) {
			return (
				<div>
					<h2>File Details:</h2>
					<p>File Name: {selectedFile.name}</p>
					<p>File Type: {selectedFile.type}</p>
					<p>Last Modified: {selectedFile.lastModifiedDate.toDateString()}</p>
				</div>
			);
		} else {
			return (
				<div>
					<br />
					<h4>Choose before Pressing the Upload button</h4>
				</div>
			);
		}
	};

	return (
		<div className="flex flex-col p-2">
			<h1 className="text-lg font-bold">Room: {roomId}</h1>
			<div className="w-3/4">
				<ol className="messages-list">
					{messages.map((message, i) => (
						<li key={i} className={`message-item ${message.sentByMe ? 'bg-blue-200' : 'bg-green-200'}`}>
							{message.msgId}
							{':'} {message.content}{' '}
							{formatDistance(new Date(), new Date(message.time)) !== 'less than a minute' ? (
								`${formatDistance(new Date(), new Date(message.time))} ago`
							) : (
								'now'
							)}
							{message.media && message.media.map((image, idx) => <img key={idx} src={image.src} width={100} />)}
						</li>
					))}
				</ol>
			</div>
			<div className="flex items-end w-2/5">
				<textarea
					value={newMessage?.content}
					onChange={handleNewMessageChange}
					placeholder="Write message..."
					className="text-grey-darkest flex-1 p-2 m-1 bg-transparent"
					onKeyDown={onEnterPress}
				/>
				<button
					onClick={handleSendMessage}
					className="focus:outline-none text-white text-sm py-2.5 px-5 rounded-md bg-blue-500 hover:bg-blue-600 hover:shadow-lg"
				>
					Send
				</button>
			</div>
			<div>
				<div>
					<input type="file" onChange={onFileChange} />
				</div>
				<FileData />
			</div>
		</div>
	);
};

export default ChatRoom;
