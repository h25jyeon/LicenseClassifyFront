import React, { useEffect, useState } from 'react';
import { Motion, spring } from 'react-motion';
import { MdCheckBox } from "react-icons/md";
import { MdCheckBoxOutlineBlank } from "react-icons/md";
import { RiDeleteBin6Line } from "react-icons/ri";
import ExceptionModal from './modal/ExceptionModal'; 
import CustomTootip from './custom/CustomTootip';

const styles = {
  dataTbl: {
    boxShadow: '5px 5px 10px var(--btn-shadow-color)',
    margin: '20px auto',
    width: '100%',
    backgroundColor: 'var(--gray-background-color)',
    cursor:'default',
  },
  tableHeader: {
    display: 'flex',
    fontWeight: 'bold',
  },
  tableHeaderCell: {
    flexShrink:'0',
    padding: '10px',
    backgroundColor: 'var(--light-gray-background-color)',
    borderBottom: '1px solid var(--border-color)',
  },
  tableBody: {
    display: 'flex',
    flexDirection: 'column',
  },
  tableRow: {
    display: 'flex',
    alignItems: 'center',
  },
  tableCell: {
    flexShrink:'0',
    padding: '10px',
  },
  oddRow: {
    backgroundColor: 'var(--light-gray-background-color)',
  },
  index: {
    width: '3%',
    textAlign: 'center',
  },
  licenseType: {
    width: '7%',
    textAlign: 'center',
    wordWrap:'break-word',
  },
  productName: {
    width:'28%',
  },
  publisher: {
    width:'12%',
  },
  evidences: {
    width:'25%',
  },
  evidencesBtn: {
    maxWidth: '100%', 
    overflow: 'hidden', 
    textOverflow: 'ellipsis', 
    whiteSpace: 'nowrap',
    paddingBottom: '10px',
    cursor: 'pointer',
  },
  exception: {
    cursor: 'pointer',
    color: 'var(--btn-default-color)',
  },

};

const DataTable = ({ selectedppList, currentPage, itemsPerPage, handleLTypeChange, licenseTypeMap, openEvidenceModal, handleDelete }) => {
  const [displayedRows, setDisplayedRows] = useState([]);
  const [selectedLicenseTypes, setSelectedLicenseTypes] = useState({});
  const [isHovered, setIsHovered] = useState(false);
  const [modalShow, setModalShow] = useState(false);
  const [deleteHover, setDeleteHover] = useState(false);
  const [hoverIndex, setHoverIndex] = useState(null);
  const [isTooltipVisible, setIsTooltipVisible] = useState(false);

  useEffect(() => {
    const timer = setTimeout(() => {
      if (displayedRows.length < selectedppList.length) {
        setDisplayedRows(prevRows => {
          const nextRowIndex = prevRows.length;
          return [...prevRows, selectedppList[nextRowIndex]];
        });
      }
    }, 40);

    return () => clearTimeout(timer);
  }, [displayedRows, selectedppList]);

  useEffect(() => {
    const initialSelectedLicenseTypes = {};
    selectedppList.forEach(obj => {
      initialSelectedLicenseTypes[obj.id] = licenseTypeMap.get(obj.id);
    });
    setSelectedLicenseTypes(initialSelectedLicenseTypes);
  }, [selectedppList, licenseTypeMap]);

  const handleLicenseTypeClick = (id, type) => {
    setSelectedLicenseTypes(prevState => ({
      ...prevState,
      [id]: type
    }));
    handleLTypeChange(id, type);
  };

  const handleMouseEnter = (index) => {
    setIsTooltipVisible(true);
    setHoverIndex(index); 
  };

  const handleMouseLeave = () => {
    setIsTooltipVisible(false);
    setHoverIndex(null); 
  };

  const handleIndexMouseEnter = (index) => { 
    setDeleteHover(true);
    setHoverIndex(index); 
  };

  const handleIndexMouseLeave = () => {
    setDeleteHover(false);
    setHoverIndex(null); 
  };

  const handleDeleteConfirmation = (objId, dataIndex) => {
    if (window.confirm(`"${dataIndex}"번째 데이터를 삭제하시겠습니까?`)) {
      handleDelete(objId);
    }
  };

  const changeExceptionTypeToLabel = (exceptionType) => {
    const exceptionContents = {
      'PRODUCT_MATCH' : 'A',
      'PUBLISHER_MATCH' : 'B',
      'PUBLISHER_EXACT_MATCH' : 'C',
      'PUBLISHER_PRODUCT_EXACT_MATCH' : 'D'
    };
  
    return exceptionContents[exceptionType];
  }

  return (
    <div style={styles.dataTbl}>
      {modalShow && 
        <ExceptionModal
          show = {modalShow}
          onHide={() => setModalShow(false)}
      />}
      <div style={styles.tableHeader}>
        <div style={{ ...styles.tableHeaderCell, ...styles.index }}>#</div>
        <div style={{ ...styles.tableHeaderCell, width: '11%'}}>licenseType</div>
        <div style={{ ...styles.tableHeaderCell, ...styles.productName }}>productName</div>
        <div style={{ ...styles.tableHeaderCell, ...styles.publisher }}>publisher</div>
        <div style={{ ...styles.tableHeaderCell, ...styles.licenseType, ...(isHovered && styles.exception) }}
          onMouseEnter={() => setIsHovered(true)}
          onMouseLeave={() => setIsHovered(false)}
          onClick={() => setModalShow(true)}
          >exception</div>
        <div style={{ ...styles.tableHeaderCell, ...styles.licenseType }}>fastText</div>
        <div style={{ ...styles.tableHeaderCell, ...styles.licenseType }}>llm</div>
        <div style={{ ...styles.tableHeaderCell, ...styles.evidences }}>evidences</div>
      </div>
      <div style={styles.tableBody}>
        {displayedRows.map((obj, index) => (
          <Motion
            key={obj.id}
            defaultStyle={{ opacity: 0, translateY: -40 }}
            style={{
              opacity: spring(1, { stiffness: 300, damping: 10 }),
              translateY: spring(0, { stiffness: 350, damping: 15 })
            }}
          >
            {style => (
              <div
                style={{
                  ...styles.tableRow,
                  ...(index % 2 === 0 ? styles.evenRow : styles.oddRow),
                  opacity: style.opacity,
                  transform: `translateY(${style.translateY}px)`
                }}
              >
                <div
                  style={{
                    ...styles.tableCell,
                    ...styles.index,
                    cursor: 'pointer'
                  }}
                  onMouseEnter={() => handleIndexMouseEnter((currentPage - 1) * itemsPerPage + index + 1)} 
                  onMouseLeave={handleIndexMouseLeave}
                  onClick={() => handleDeleteConfirmation(obj.id, (currentPage - 1) * itemsPerPage + index + 1)}
                >
                  {deleteHover && hoverIndex === (currentPage - 1) * itemsPerPage + index + 1 ? (
                    <RiDeleteBin6Line/>
                  ) : (
                    (currentPage - 1) * itemsPerPage + index + 1
                  )}
                </div>
                <div style={{ ...styles.tableCell, cursor: 'pointer', width: '11%'}}>
                  <div style={{textAlign:'left'}}>
                    <div onClick={() => handleLicenseTypeClick(obj.id, 'FREE')}>
                      {selectedLicenseTypes[obj.id] === 'FREE' ? <MdCheckBox /> : <MdCheckBoxOutlineBlank />}
                      <span>FREE</span>
                    </div>
                    <div onClick={() => handleLicenseTypeClick(obj.id, 'SHAREWARE')}>
                      {selectedLicenseTypes[obj.id] === 'SHAREWARE' ? <MdCheckBox /> : <MdCheckBoxOutlineBlank />}
                      SHAREWARE
                    </div>
                    <div onClick={() => handleLicenseTypeClick(obj.id, 'COMMERCIAL')}>
                      {selectedLicenseTypes[obj.id] === 'COMMERCIAL' ? <MdCheckBox /> : <MdCheckBoxOutlineBlank />}
                      COMMERCIAL
                    </div>
                    <div onClick={() => handleLicenseTypeClick(obj.id, 'ETC')}>
                      {selectedLicenseTypes[obj.id] === 'ETC' ? <MdCheckBox /> : <MdCheckBoxOutlineBlank />}
                      ETC
                    </div>
                    <div onClick={() => handleLicenseTypeClick(obj.id, 'NONE')}>
                      {selectedLicenseTypes[obj.id] === 'NONE' ? <MdCheckBox /> : <MdCheckBoxOutlineBlank />}
                      NONE
                    </div>
                  </div>
                </div>
                {Object.entries(JSON.parse(obj.patterns)).map(([key, value]) => (
                  <React.Fragment key={key}>
                    {key === "productName" && (
                      <div style={{ ...styles.tableCell, ...styles.productName }}>{value}</div>
                    )}
                    {key === "publisher" && (
                      <div style={{ ...styles.tableCell, ...styles.publisher }}>{value}</div>
                    )}
                  </React.Fragment>
                ))}
                <div 
                  style={{ ...styles.tableCell, ...styles.licenseType }}
                  onMouseEnter={() => handleMouseEnter(index)}
                  onMouseLeave={handleMouseLeave}
                >
                  {obj.exceptions && obj.exceptionKeyword ? 
                    (obj.exceptionKeyword.publisher && obj.exceptionKeyword.product ? 
                      `${changeExceptionTypeToLabel(obj.exceptionKeyword.type)} (${obj.exceptionKeyword.publisher} / ${obj.exceptionKeyword.product})` :
                      (obj.exceptionKeyword.publisher ? 
                        `${changeExceptionTypeToLabel(obj.exceptionKeyword.type)} (${obj.exceptionKeyword.publisher})` :
                        (obj.exceptionKeyword.product ? 
                          `${changeExceptionTypeToLabel(obj.exceptionKeyword.type)} (${obj.exceptionKeyword.product})` :
                          changeExceptionTypeToLabel(obj.exceptionKeyword.type)
                        )
                      )
                    )
                    : 'No'
                  }
                  {obj.exceptionKeyword && isTooltipVisible  && hoverIndex === index && (
                    <CustomTootip exceptionType={obj.exceptionKeyword.type} /> 
                  )}
                </div>
                <div style={{ ...styles.tableCell, ...styles.licenseType }}>{obj.exceptions ? "-" : obj.fastText}</div>
                <div style={{ ...styles.tableCell, ...styles.licenseType }}>{obj.exceptions ? "-" : obj.llm}</div>
                <ul style={{ ...styles.tableCell, ...styles.evidences }}>
                  { !obj.exceptions  && obj.evidences && obj.evidences !== "" && JSON.parse(obj.evidences).map((evidence, index) => (
                    <li className='evdBtn' style={{ ...styles.evidencesBtn }} key={index} onClick={() => openEvidenceModal(evidence)}>{evidence.title}</li>
                  ))}
                </ul>
              </div>
            )}
          </Motion>
        ))}
      </div>
    </div>
  );
};

export default DataTable;
