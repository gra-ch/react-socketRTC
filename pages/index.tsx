import Link from 'next/link';
import { useState } from 'react';

const Home = () => {
	const [ roomName, setRoomName ] = useState('');

	const handleRoomNameChange = (event: React.ChangeEvent<HTMLInputElement>) => {
		setRoomName(event.target.value);
	};

	return (
		<div className="home-container">
			<input
				type="text"
				placeholder="Room"
				value={roomName}
				onChange={handleRoomNameChange}
				className="text-input-field"
			/>
			<Link href={`/${roomName}`}>
				<a className="enter-room-button">Join room</a>
			</Link>
		</div>
	);
};

export default Home;
