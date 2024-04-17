import React, { useState, useEffect, useCallback } from 'react';
import { Modal, Spinner } from 'react-bootstrap';
import '../css/App.css';
import '../css/CustomModal.css';

function FileUploadModal(props) {
  const [selectedFile, setSelectedFile] = useState(null);
  const [taskName, setTaskName] = useState('');
  const [loading, setLoading] = useState(false); 
  const [uuid, setUuid] = useState('');
  const [responseData, setResponseData] = useState(null);

  const handleCloseModal = useCallback(() => {
    setTaskName('');
    props.onHide();
  }, [props]);

  const handleFileUploaded = useCallback(() => {
    props.fileuploaded(uuid);
    handleCloseModal();
  }, [uuid, handleCloseModal, props]);

  useEffect(() => {
    if (uuid !== '') {
      handleFileUploaded();
    }
  }, [uuid, handleFileUploaded]);

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
        setUuid(data.id);
        setResponseData(data);
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

  return (
    <Modal {...props} className='uploadModal' centered onHide={handleCloseModal}>
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
        ) :(
              <>
              {responseData ? (
                  <div>
                  <p>Added: {responseData.added}</p>
                  <p>Ignored: {responseData.ignored}</p>
                  </div>
              ) : (
                  <div className='btnSubmit' onClick={handleUpload}>Upload</div>
              )}
              </>
          )}
      </Modal.Footer>
    </Modal>
  );
}

export default FileUploadModal;
