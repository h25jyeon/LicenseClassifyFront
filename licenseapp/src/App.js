import React, { useState, useEffect  } from 'react';
import { Button } from 'react-bootstrap';
import Spinner from 'react-bootstrap/Spinner';
import './App.css';
import '../node_modules/bootstrap/dist/css/bootstrap.css'
import FileUploadModal from './FileUploadModal'; 
import EvidenceModal from './EvidenceModal'; 
import axios from 'axios';

function App() {
  const [modalShow, setModalShow] = useState(false); 
  const [workingSet, setWorkingSet] = useState([]);
  const [selectedWSId, setSelectedWSId] = useState('');
  const [selectedppList, setSelectedPPList] = useState([]);
  const [evidencesIsOpen, setEvidencesIsOpen] = useState(false);
  const [selectedEvidence, setSelectedEvidence] = useState(null);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    fetchWorkingSet();
  },[]);

  useEffect(() => {
    if (selectedWSId) {
      console.log("selectedWSId change ",selectedWSId);
      fetchProductPattern(selectedWSId);
    }
  }, [selectedWSId]);

  const fetchWorkingSet = ()  => {
    fetch('http://192.168.11.66:8080/working-set', {
      method: 'GET'
    })
    .then(response => {
      if (response.ok) return response.json();
      throw new Error('Network response was not ok.');
    })
    .then(data => {
      console.log('서버 응답:', data);
      setWorkingSet(data);
      setSelectedWSId(data[0].id)
    })
    .catch(error => {
      console.error('There was an error!', error);
    });
  };

  const fetchProductPattern = () => {
    console.log(selectedWSId);
    setLoading(true);
    fetch(`http://192.168.11.66:8080/product-pattern/${selectedWSId}`, {
      method: 'GET'
    })
      .then(response => response.json())
      .then(data => {
        console.log(data);
        setSelectedPPList(data);
      })
      .catch(error => {
        setSelectedPPList([]);
        console.error('Error fetching objects:', error);
      })
      .finally(() => {
        setLoading(false);
      });
  };

  const handleExportClick = () => {
    fetch(`http://192.168.11.66:8080/product-pattern/download/${selectedWSId}`)
      .then(response => response.blob())
      .then(blob => {
        const url = window.URL.createObjectURL(new Blob([blob]));
        const a = document.createElement('a');
        a.href = url;
        const selectedWSName = workingSet.find(item => item.id === selectedWSId)?.name || '라이선스_분류_data';
        a.download = selectedWSName + '.csv';

        document.body.appendChild(a);
        a.click();
        window.URL.revokeObjectURL(url);
      })
      .catch(error => console.error('Error downloading file', error));
  }

  const handleSelectChange = (event) => {
    const newValue = event.target.value;
    if (newValue !== selectedWSId) {
      setSelectedWSId(newValue);
    }
  }

  const handleLTypeChange = (event) => {
    sendLicenseTypeChange(event, event.target.id, event.target.value);
  };

  const sendLicenseTypeChange = async (event, id, newOption) => {
    const formData = new FormData();
        formData.append('newOption', newOption);
    try {
      const response = await axios.put(`http://192.168.11.66:8080/product-pattern/${id}`, formData, {
        headers: {
          'Content-Type': 'multipart/form-data'
        }
      });
      console.log('API Response:', response.data);
      event.target.value = response.data;
    } catch (error) {
      console.error('Error sending data to API:', error);
    } 
  };

  const openEvidenceModal = (item) => {
    console.log(item);
    setSelectedEvidence(item);
    setEvidencesIsOpen(true);
  };

  const closeEvidenceModal = () => {
    setEvidencesIsOpen(false);
    setSelectedEvidence(null);
  };

  return (
    <div className="App">

      {modalShow && (
        <FileUploadModal
          fileuploaded = {setSelectedWSId}
          show = {modalShow}
          onHide={() => setModalShow(false)}
        />
      )}

      {evidencesIsOpen && (
        <EvidenceModal
            evidence={selectedEvidence}
            show = {evidencesIsOpen}
            onHide={() => closeEvidenceModal()}
        />
      )}

      {selectedWSId && 
        <div className='workingSetBox'>
          <select className='selectBox' onChange={handleSelectChange} value={selectedWSId}>
            {workingSet.map(ws => (
              <option key={ws.id} value={ws.id}>{ws.name}</option>
            ))}
          </select>
          <Button className = 'exportBtn' onClick={handleExportClick}>CSV 내보내기</Button>
        </div>
      } 
      

      <Button className='uploadBtn' variant="primary" onClick={() => setModalShow(true)}>파일 업로드</Button>

      {loading && (
        <Spinner className='spinner' animation="border" role="status">
          <span className="visually-hidden"></span>
        </Spinner>
      )}

      { !loading && selectedppList.length > 0 && (
        <table className='dataTbl'>
          <thead>
            <tr>
              <th>#</th>
              <th>licenseType</th>
              <th>productName</th>
              <th>publisher</th>
              <th>exceptions</th>
              <th>fastText</th>
              <th>llm</th>
              <th>evidences</th>
            </tr>
          </thead>
          <tbody>
            {selectedppList.map((obj, index) => (
              <tr key={obj.id}>
                <td>{index + 1}</td> 
                <td className='licenseSelect'>
                    <select onChange={handleLTypeChange} id = {obj.id} value= {obj.licenseType ? obj.licenseType : "NONE"}>
                      <option value="FREE">FREE</option>
                      <option value="SHAREWARE">SHAREWARE</option>
                      <option value="COMMERCIAL">COMMERCIAL</option>
                      <option value="ETC">ETC</option>
                      <option value="NONE">NONE</option>
                    </select>
                </td>
                {obj.patterns && (
                  Object.entries(JSON.parse(obj.patterns)).map(([key, value]) => (
                    <React.Fragment key={key}>
                      {key === "productName" && (
                        <td key={key + "_productName"}>{value}</td>
                      )}
                      {key === "publisher" && (
                        <td key={key + "_publisher"}>{value}</td>
                      )}
                    </React.Fragment>
                  ))
                )}

                <td>{obj.exceptions ? 'Yes' : 'No'}</td>
                <td>{obj.fastText}</td>
                <td>{obj.llm}</td>
                <td>
                  {obj.evidences && obj.evidences !== "" && JSON.parse(obj.evidences).map((evidence, index) => (
                      <button className='evdBtn' key={index} onClick={() => openEvidenceModal(evidence)}>{evidence.title}</button>
                  ))}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      )}
    </div>
  );
}

export default App;