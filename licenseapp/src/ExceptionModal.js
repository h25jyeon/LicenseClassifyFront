import React, { useState } from 'react';
import { Modal, Spinner } from 'react-bootstrap';
import './App.css';
import './CustomModal.css';
import CustomSelect from './CustomSelect';

function ExceptionModal(props) {
  const [selectedFile, setSelectedFile] = useState(null);
  const [exceptionType, setExceptionType] = useState('');
  const [loading, setLoading] = useState(false); 
  const [responseData, setResponseData] = useState(null);

  const handleFileChange = (event) => {
    const file = event.target.files[0];
    if (file && file.type === 'text/csv') {
      setSelectedFile(file);
    } else {
      alert('올바른 형식의 CSV 파일을 선택해주세요.');
    }
  };

  const handleUpload = async () => {
    if (selectedFile) {
        setLoading(true); 
        const formData = new FormData();
        formData.append('file', selectedFile);
        formData.append('type', exceptionType);

        try {
            const response = await fetch('http://192.168.11.66:8080/Exception', {
                method: 'POST',
                body: formData
            });
            if (!response.ok) {
                throw new Error('Network response was not ok.');
            }
            const data = await response.json();
            setResponseData(data); 
        } catch (error) {
            console.error('There was an error!', error);
        } finally {
            setLoading(false); 
        }
    } else {
        alert('파일을 선택해주세요.');
    }
};

  const handleCloseModal = () => {
    setExceptionType('');
    props.onHide();
  };

  const handleSelectChange = (id, value) => {
    console.log("value : ",value);
    setExceptionType(value);
  }
  
  const options = [
    { label: "저작권사, 제품명 완전 일치", value: "PUBLISHER_PRODUCT_EXACT_MATCH" },
    { label: "저작권사 완전 일치", value: "PUBLISHER_EXACT_MATCH" },
    { label: "제품명 포함", value: "PRODUCT_MATCH" },
    { label: "저작권사 포함", value: "PUBLISHER_MATCH" }
  ];

  return (
    <Modal {...props} className='uploadModal' centered onHide={handleCloseModal}>
      <Modal.Header className='modal-header' closeButton>
        <Modal.Title>Exception Keyword CSV Uploader</Modal.Title>
      </Modal.Header>
      <Modal.Body className='modal-body'>
        <label>
            업로드할 예외 키워드 파일을 선택하세요.
            <br/>
            <span style={{color:'red'}}>* </span>"저작권사" / "제어판 이름"  CSV Header 필수
        </label>
        <input type="file" onChange={handleFileChange} accept=".csv" />
        <label>이 키워드의 타입을 선택하세요.</label>
        
        <CustomSelect 
          options={options} 
          myFontSize="14px" 
          handleSelectChange={handleSelectChange}
          selectedValue={"A"} 
          fontColor="#1d2023" 
          backgroundColor= {'var(--white)'}
          selectedBackgroundColor="#1d2023"
          selectedColor= {'var(--white)'}
          hoverColor = {'var(--white)'}
          hoverBackgroundColor = {'rgba(29, 32, 35, 0.5)'}
          controlColor = {'#000'}
          controlBackgroundColor = {'0)'}
          width = {400}
          menuPlacement = {"bottom"}
        />

      </Modal.Body>
      <Modal.Footer className='modal-footer'>
        {loading ? (
            <Spinner animation="border" role="status">
            <span className="sr-only"></span>
            </Spinner>
        ) : (
            <>
            {responseData ? (
                <div>
                <p>Added: {responseData.added}</p>
                <p>Duplicate: {responseData.duplicate}</p>
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

export default ExceptionModal;
