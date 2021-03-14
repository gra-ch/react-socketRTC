import express, { Express, Request, Response } from 'express';
import http from 'http';
import next, { NextApiHandler } from 'next';
import socketIo from 'socket.io';

const port: number = parseInt(process.env.PORT || '3000', 10);
const dev: boolean = process.env.NODE_ENV !== 'production';
const nextApp = next({ dev });
const nextHandler: NextApiHandler = nextApp.getRequestHandler();

const NEW_CHAT_MESSAGE_EVENT = 'newChatMessage';

nextApp.prepare().then(async () => {
	const app: Express = express();
	const server: http.Server = http.createServer(app);
	const io: socketIo.Server = new socketIo.Server();
	io.attach(server, {
		cors: {
			origin: 'http://localhost:3000',
		},
	});

	app.get('/api/hello', async (_: Request, res: Response) => {
		res.send('Hello World');
	});

	io.on('connection', (socket: socketIo.Socket) => {
		// Join a conversation
		const { roomId } = socket.handshake.query;
		socket.join(roomId!);

		// Listen for new messages
		socket.on(NEW_CHAT_MESSAGE_EVENT, (data) => {
			io.in(roomId as string).emit(NEW_CHAT_MESSAGE_EVENT, data);
		});

		// Leave the room if the user closes the socket
		socket.on('disconnect', () => {
			socket.leave(roomId as string);
		});
	});

	app.get('/api/message', async (_: Request, res: Response) => {
		res.send('Hello World');
	});

	app.all('*', (req: any, res: any) => nextHandler(req, res));

	server.listen(port, () => {
		console.log(`> Ready on http://localhost:${port}`);
	});
});
