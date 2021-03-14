import { useEffect, useState } from 'react';
import ChatRoom from "../pages/[roomId]";
import { createSignalProtocolManager, SignalServerStore } from "../signal/SignalGateway";

const Home = () => {
	const [isLoggedIn, setIsLoggedIn] = useState(false);
	const [roomName, setRoomName] = useState('');
	const [loggedInUserObj] = useState({
		name: 'Grace',
		_id: 'Gra123'
	});
	const [dummySignalServer] = useState(() => new SignalServerStore());
	const [signalProtocolManagerUser, setSignalProtocolManagerUser] = useState<any>();

	const handleRoomNameChange = (event: React.ChangeEvent<HTMLInputElement>) => {
		setRoomName(event.target.value);
	};

	useEffect(() => {
		// Initializing signal server here
		createSignalProtocolManager(loggedInUserObj._id, loggedInUserObj.name, dummySignalServer)
			.then(signalProtocolManagerUser => setSignalProtocolManagerUser(signalProtocolManagerUser));
	}, []);

	return (
		<div className="home-container">
			<input
				type="text"
				placeholder="Room"
				value={roomName}
				onChange={handleRoomNameChange}
				className="text-input-field"
			/>
			<a className="enter-room-button" onClick={() => setIsLoggedIn(!isLoggedIn)}>Join room</a>
			{isLoggedIn && <ChatRoom
				roomId={roomName}
				loggedInUserObj={loggedInUserObj}
				signalProtocolManagerUser={signalProtocolManagerUser}
			/>}
		</div>
	);
};

export default Home;
