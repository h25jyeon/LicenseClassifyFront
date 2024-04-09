import React, { useState, useEffect  } from 'react';
import Spinner from 'react-bootstrap/Spinner';
import axios from 'axios';
import Pagination from 'react-js-pagination'

import { PiExportBold } from "react-icons/pi";
import { LuFilePlus2 } from "react-icons/lu";
import { MdCheckBox } from "react-icons/md";
import { MdCheckBoxOutlineBlank } from "react-icons/md";

import FileUploadModal from './modal/FileUploadModal'; 
import EvidenceModal from './modal/EvidenceModal'; 
import CustomSelect from './custom/CustomSelect';
import { useDarkMode } from './DarkMode';
import CustomButton from "./custom/CustomButton"
import DataTable from './DataTable';
// import StarComponent from './StarComponent';

import '../node_modules/bootstrap/dist/css/bootstrap.css'
import './css/Pagination.css';
import './css/MainApp.css';
import './css/Toggle.css';

function MainApp() {
  const { darkMode, toggleDarkMode } = useDarkMode();

  const [modalShow, setModalShow] = useState(false); 
  const [workingSet, setWorkingSet] = useState([]);
  const [selectedWSId, setSelectedWSId] = useState('');
  const [selectedppList, setSelectedPPList] = useState([]);
  const [licenseTypeMap, setLicenseTypeMap] = useState(new Map());

  const [isScrolledToTop, setIsScrolledToTop] = useState(true);
  const [AIClassifiedFilter, setAIClassifiedFilter] = useState(false);
  const [reviewNeededFilter, setReviewNeededFilter] = useState(false);
  const [exceptionFilter, setExceptionFilter] = useState(false);

  const [evidencesIsOpen, setEvidencesIsOpen] = useState(false);
  const [selectedEvidence, setSelectedEvidence] = useState(null);
  const [loading, setLoading] = useState(false);
  const [currentPage, setCurrentPage] = useState(1);
  const [itemsPerPage, setItemsPerPage] = useState(10);
  const [totalItemsCount, setTotalItemsCount] = useState(0);
  const [controlColor, setControlColor] = useState('#fff');


  useEffect(() => {
    fetchWorkingSet();
  },[]);

  useEffect(() => {
    if (selectedWSId) {
      console.log("selectedWSId change",selectedWSId);
      fetchProductPattern(selectedWSId);
    }
  }, [selectedWSId, currentPage, itemsPerPage, AIClassifiedFilter, reviewNeededFilter, exceptionFilter]);


  useEffect(() => {
    if (darkMode) {
      setControlColor('#fff');
    } else {
      setControlColor('#1d2023');
    }
  }, [darkMode]);

  
  useEffect(() => {
    function handleScroll() {
      const scrollTop = window.pageYOffset;
      setIsScrolledToTop(scrollTop === 0);
    }

    window.addEventListener("scroll", handleScroll);

    return () => {
      window.removeEventListener("scroll", handleScroll);
    };
  }, []);


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
    setLoading(true);
    const queryParams = new URLSearchParams({
      page: currentPage,
      size: itemsPerPage,
      classified: AIClassifiedFilter,
      reviewNeeded: reviewNeededFilter,
      isException: exceptionFilter
    });

    fetch(`http://192.168.11.66:8080/product-pattern/${selectedWSId}?${queryParams}`, {
      method: 'GET'
    })
      .then(response => response.json())
      .then(data => {
        setSelectedPPList(data.data);
        setTotalItemsCount(data.pageInfo.totalElements);
        
        setLicenseTypeMap(new Map(data.data.map(obj => [obj.id, obj.licenseType || 'NONE'])));
      })
      .catch(error => {
        setSelectedPPList([]);
        setLicenseTypeMap(new Map());
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

  const handleSelectChange = (id, value) => {
    if (value !== selectedWSId) {
      setCurrentPage(1);
      setSelectedWSId(value);
    }
  }
  
  const handlePageChange = pageNumber => {
    console.log(pageNumber);
    setCurrentPage(pageNumber);
  };
  
  const handleLTypeChange = (id, newOption ) => {
    console.log(id);
    console.log(newOption);
    sendLicenseTypeChange(id, newOption);
  };
  
  const sendLicenseTypeChange = async (id, newOption) => {
    const formData = new FormData();
        formData.append('newOption', newOption);
    try {
      const response = await axios.put(`http://192.168.11.66:8080/product-pattern/${id}`, formData, {
        headers: {
          'Content-Type': 'multipart/form-data'
        }
      });
      console.log('API Response:', response.data);
      licenseTypeMap.set(id, response.data);
      console.log('licenseTypeMap :', licenseTypeMap.get(id) )
    } catch (error) {
      console.error('Error sending data to API:', error);
    } 
  };

  const handleDelete = (objId) => {
    axios.delete(`http://192.168.11.66:8080/product-pattern/${objId}`)
      .then(response => {
        alert('삭제되었습니다.'); 
        console.log(response.data); 
        fetchProductPattern();
      })
      .catch(error => {
        alert('삭제에 실패했습니다.'); 
        console.error('삭제 중 오류 발생:', error);
      });
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

  const options = workingSet.map(ws => {
    const label = ws.name.replace(/\t/g, '    '); 
    return { value: ws.id, label: label };
  });

  return (
    <div className="MainApp">
      {/* <div className='starts'>
        <StarComponent/>
      </div> */}

      <div className={`filterBox ${isScrolledToTop ? '' : 'scrolled'}`}>
        <div onClick={() => {
          setAIClassifiedFilter(!AIClassifiedFilter);
          setCurrentPage(1); 
        }}>
          {AIClassifiedFilter ? <MdCheckBox /> : <MdCheckBoxOutlineBlank />}
          <span>AI Classified</span>
        </div>

        <div onClick={() => {
          setReviewNeededFilter(!reviewNeededFilter);
          setCurrentPage(1); 
        }}>
          {reviewNeededFilter ? <MdCheckBox /> : <MdCheckBoxOutlineBlank />}
          <span>Review Needed</span>
        </div>

        <div onClick={() => {
          setExceptionFilter(!exceptionFilter);
          setCurrentPage(1); 
        }}>
          {exceptionFilter ? <MdCheckBox /> : <MdCheckBoxOutlineBlank />}
          <span>NonException</span>
        </div>
      </div>

      <div className='darkModeToggleBox'>
        <label>
          <input onChange={toggleDarkMode} type='checkbox' id='toggle'></input>
          <div className='toggle-wrapper'><span className='selector'></span></div>
        </label>
      </div>


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

      <div className='menuBox'>
      {selectedWSId && (
        <CustomSelect 
          {...console.log(workingSet.map(ws => ({ value: ws.id, label: ws.name})))}
          options={options} 
          myFontSize="14px" 
          handleSelectChange={handleSelectChange} 
          selectedValue={selectedWSId} 
          fontColor="#1d2023" 
          backgroundColor= {'var(--white)'}
          selectedBackgroundColor="#1d2023"
          selectedColor= {'var(--white)'}
          hoverColor = {'var(--white)'}
          hoverBackgroundColor = {'rgba(29, 32, 35, 0.5)'}
          controlColor = {'var(--default-text-color)'}
          controlBackgroundColor = {'0)'}
          width = {400}
          menuPlacement = {"bottom"}
        />
      )}
        <div className = 'uploadBtn'>
          <CustomButton
            handleOnClick = {() => setModalShow(true)}
            icon = {LuFilePlus2}
            text = {"Csv Upload"}
          />
        </div>
        {selectedWSId && 
          <div className = 'exportBtn'>
            <div className = 'btnBox'>
              <CustomButton
                handleOnClick = {handleExportClick}
                icon = {PiExportBold}
                text = {"Csv Export"}
              />
            </div>
          </div>
        } 
      </div>
      
      {loading && (
        <div className='spinnerBox'>
          <Spinner animation="border" role="status">
            <span className="visually-hidden"></span>
          </Spinner>
        </div>
      )}

      { !loading && selectedppList.length > 0 && (
        <div>
          <DataTable
            selectedppList={selectedppList}
            currentPage={currentPage}
            itemsPerPage={itemsPerPage}
            handleLTypeChange={handleLTypeChange}
            licenseTypeMap={licenseTypeMap}
            openEvidenceModal={openEvidenceModal}
            handleDelete = {handleDelete}
          />
          <Pagination
            activePage={currentPage}
            itemsCountPerPage={itemsPerPage}
            totalItemsCount={totalItemsCount}
            pageRangeDisplayed={5}
            onChange={handlePageChange}
            prevPageText={"<"}
            nextPageText={">"}
          />
         
          <div className='seletItemCnt'>
            <CustomSelect 
              options={[
                { value: 10, label: 10 },
                { value: 30, label: 30 },
                { value: 50, label: 50 },
                { value: 100, label: 100 },
                { value: 200, label: 200 }
              ]}
              myFontSize="14px" 
              handleSelectChange={(id, value) => setItemsPerPage(value)} 
              selectedValue={itemsPerPage} 
              fontColor="#1d2023" 
              backgroundColor="#fff" 
              selectedBackgroundColor="#1d2023"
              selectedColor="#fff"
              hoverColor = "#fff"
              hoverBackgroundColor = {'rgba(29, 32, 35, 0.5)'}
              width={90}
              controlColor = {controlColor}
              controlBackgroundColor = {'rgba(29, 32, 35, 0)'}
              menuPlacement = {"top"}
            />
          </div>
          <p className = "pageNum">{currentPage} of {Math.ceil(totalItemsCount / itemsPerPage)}</p>
        </div>
      )}
    </div>
  );
}

export default MainApp;