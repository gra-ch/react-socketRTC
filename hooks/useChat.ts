import { useEffect, useRef, useState } from 'react';
import socketIOClient from 'socket.io-client';
import { openDB } from 'idb';
import { STORE_NAME, IMessage } from '../indexeddb';

const NEW_CHAT_MESSAGE_EVENT = 'newChatMessage'; // Name of the event
const SOCKET_SERVER_URL = 'http://localhost:3000';

const user1 = 'Grace';
const user2 = 'Jessie';
const rmId = 'GJ';

const useFetch = () => {
	const [value, setValue] = useState<any>();
	useEffect(
		() => {
			async function fetchData() {
				const db = await openDB<IMessage>('socaves', 1, {
					upgrade(db) {
						db.createObjectStore(STORE_NAME);
					},
				});
				setValue(db);
			}
			fetchData();
		},
		[] // executed on component mount
	);
	return [value, setValue];
};

const useChat = (roomId: string) => {
	const [messages, setMessages] = useState<IMessage[]>([]); // Sent and received messages
	const socketRef = useRef<socketIOClient.Socket>();
	const [indexDB] = useFetch();

	async function saveMsgToApp(incomingMessage: IMessage) {
		const { msgId, content, sentByMe, time, media } = incomingMessage;
		const msg = {
			msgId,
			formUser: sentByMe ? user1 : user2,
			toUser: sentByMe ? user2 : user1,
			content,
			media,
			sentByMe,
			time,
		};
		const data = await indexDB.get(STORE_NAME, rmId);
		data?.push(msg);

		if(data) {
			await indexDB.put(STORE_NAME, data, rmId);
		} else {
			await indexDB.put(STORE_NAME, [msg], rmId);
		}
	}

	useEffect(
		() => {
			if(indexDB) {
				async function getMsgInApp() {
					if(indexDB) {
						const res: IMessage[] = await indexDB.get(STORE_NAME, rmId);
						if(res) {
							setMessages(res);
						}
					}
				}

				// Creates a WebSocket connection
				socketRef.current = socketIOClient.io(SOCKET_SERVER_URL, {
					query: { roomId },
				});
				console.log(socketRef.current);
				getMsgInApp();
				// const res = axios.get('message');

				// Listens for incoming messages
				socketRef.current.on(NEW_CHAT_MESSAGE_EVENT, (message: IMessage) => {
					const incomingMessage = {
						...message,
						sentByMe: message.msgId === socketRef.current!.id,
						time: Date.now(),
					};
					setMessages((messages) => [...messages, incomingMessage]);
					saveMsgToApp(incomingMessage);
				});

				// Destroys the socket reference when the connection is closed
				return () => {
					socketRef.current!.disconnect();
				};
			}

		},
		[roomId]
	);

	// Sends a message to the server that forwards it to all users in the same room
	const sendMessage = (newMessage: IMessage) => {
		socketRef.current!.emit(NEW_CHAT_MESSAGE_EVENT, {
			content: newMessage.content,
			media: newMessage.media,
			msgId: socketRef.current!.id,
		});
	};

	return { messages, sendMessage };
};

export default useChat;
