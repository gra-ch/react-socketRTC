import { useState } from 'react';
import axios from 'axios';

interface HTMLInputEvent extends React.ChangeEvent<HTMLInputElement> {
	target: HTMLInputElement & EventTarget;
}

const FileUploader = () => {
	const [ selectedFile, setSelectedFile ] = useState<any>();

	// On file select (from the pop up)
	const onFileChange = (event?: HTMLInputEvent) => {
		if (event?.target.files) {
			// Update the state
			setSelectedFile(event.target.files[0]);
		}
	};

	// On file upload (click the upload button)
	const onFileUpload = () => {
		// Create an object of formData
		const formData = new FormData();

		// Update the formData object
		formData.append('myFile', selectedFile, selectedFile.name);

		// Details of the uploaded file
		console.log(selectedFile);

		// Request made to the backend api
		// Send formData object
		axios.post('api/uploadfile', formData);
	};

	// File content to be displayed after file upload is complete
	const FileData = (): JSX.Element => {
		if (selectedFile) {
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
		<div>
			<div>
				<input type="file" onChange={onFileChange} />
				<button onClick={onFileUpload}>Upload!</button>
			</div>
			<FileData />
		</div>
	);
};

export default FileUploader;
