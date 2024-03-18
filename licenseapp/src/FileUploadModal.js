import React, { useState,useEffect } from 'react';
import { Modal, Button, Spinner } from 'react-bootstrap';
import './App.css';

function FileUploadModal(props) {
  const [selectedFile, setSelectedFile] = useState(null);
  const [taskName, setTaskName] = useState('');
  const [loading, setLoading] = useState(false); 
  const [uuid, setUuid] = useState('');

  useEffect(() => {
    if (uuid !== '') handleFileUploaded();
  }, [uuid]);

  const handleFileChange = (event) => {
    const file = event.target.files[0];
    if (file && file.type === 'text/csv') {
      setSelectedFile(file);
      const fileName = file.name.split('.')[0];
      setTaskName(fileName);
    } else {
      alert('올바른 형식의 CSV 파일을 선택해주세요.');
    }
  };

  async function handleUpload() {
    if (selectedFile) {
      setLoading(true); 
      console.log('선택된 파일:', selectedFile);
      const formData = new FormData();
      formData.append('file', selectedFile);
      formData.append('fileName', taskName);

      try {
        const response = await fetch('http://192.168.11.66:8080/working-set', {
          method: 'POST',
          body: formData
        });
        if (!response.ok) {
          throw new Error('Network response was not ok.');
        }
        const data = await response.json();
        setUuid(data);
        console.log('서버 응답:', data);
      } catch (error) {
        console.error('There was an error!', error);
      } finally {
        setLoading(false); 
      }
    } else {
      alert('파일을 선택해주세요.');
    }
  };

  const handleFileUploaded = () => {
    props.fileuploaded(uuid);
    handleCloseModal();
  }

  const handleCloseModal = () => {
    setTaskName('');
    props.onHide();
  };

  return (
    <Modal {...props} centered onHide={handleCloseModal}>
      <Modal.Header className='modal-header' closeButton>
        <Modal.Title>CSV Uploader</Modal.Title>
      </Modal.Header>
      <Modal.Body className='modal-body'>
        <label>업로드할 수집DB 파일을 선택하세요.</label>
        <input type="file" onChange={handleFileChange} accept=".csv" />
        <label>이 CSV 파일의 작업명을 입력하세요.</label>
        <input type='text' value={taskName} onChange={(e) => setTaskName(e.target.value)} />
      </Modal.Body>
      <Modal.Footer className='modal-footer'>
        {loading ? (
          <Spinner animation="border" role="status">
            <span className="sr-only"></span>
          </Spinner>
        ) : (
          <Button variant="primary" onClick={handleUpload}>Upload</Button>
        )}
      </Modal.Footer>
    </Modal>
  );
}

export default FileUploadModal;
