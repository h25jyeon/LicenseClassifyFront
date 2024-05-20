import React, { useEffect, useState } from 'react';
import { Motion, spring } from 'react-motion';
import { MdCheckBox } from "react-icons/md";
import { MdCheckBoxOutlineBlank } from "react-icons/md";
import { RiDeleteBin6Line } from "react-icons/ri";
import { PiSealCheckFill } from "react-icons/pi";
import { FaRegStar } from "react-icons/fa6";
import { FaStar } from "react-icons/fa6";

import ExceptionModal from './modal/ExceptionModal';
import CustomTootip from './custom/CustomTootip';


const styles = {
  dataTbl: {
    boxShadow: '5px 5px 10px var(--btn-shadow-color)',
    margin: '20px auto',
    width: '100%',
    backgroundColor: 'var(--gray-background-color)',
    cursor: 'default',
  },
  tableHeader: {
    display: 'flex',
    fontWeight: 'bold',
  },
  tableHeaderCell: {
    flexShrink: '0',
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
    flexShrink: '0',
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
    wordWrap: 'break-word',
  },
  licenseTypes: {
    width: '14%',
    wordWrap: 'break-word',
    textAlign: 'left',
  },
  iconBox: {
    width: '40px',
    height: '40px',
    float: 'left',
    margin: '1% 10px 0% 0px',
    lineHeight: '50px',
    textAlign: 'center',
    float: 'left',
  },
  dataBox: {
    width: '30%',
    padding: '10px',
  },
  dataInnerBox: {
    float: 'left',
  },
  itemData: {
    display: 'block',
    margin: '0px',
    overflow: 'hidden',
    textOverflow: 'ellipsis',
    whiteSpace: 'nowrap',
    cursor: 'grab',
    color: 'var(--gray-text-color)',
  },
  btnSearch: {
    display: 'inline-block',
    fontSize: '0.75rem',
    marginRight: '15px',
    marginTop: '10px',
  },
  textBold: {
    fontFamily: 'var(--font-SpoqaHanSansNeo-Medium)',
    color: 'var(--default-text-color)',
  },
  evidences: {
    width: '42%',
  },
  evidenceLi: {
    clear: 'both',
  },
  evidencesBtn: {
    display: 'block',
    float: 'left',
    maxWidth: '70%',
    overflow: 'hidden',
    textOverflow: 'ellipsis',
    whiteSpace: 'nowrap',
    paddingLeft: '18px',
    paddingBottom: '10px',
    cursor: 'pointer',
  },
  likeBox: {
    display: 'flex',
    float: 'right',
    width: '30%',
    justifyContent: 'center',
  },
  likeBtn: {
    display: 'block',
    float: 'left',
    paddingRight: '3px',
    cursor: 'pointer',
  },
  exception: {
    cursor: 'pointer',
    color: 'var(--btn-default-color)',
  },
  officialMark: {
    display: 'inline-block',
    textIndent: '-18px',
  },
  evidencesLisence: {
    width: '80px',
    display: 'inline-block',
    marginRight: '10px',
    fontSize: '12px',
    padding: '2px 0',
    borderRadius: '8px',
    textAlign: 'center',
    fontFamily: 'var(--font-SpoqaHanSansNeo-Medium)',
  },
  freeLicense: {
    backgroundColor: 'var(--free)',
  },
  sharewareLicense: {
    backgroundColor: 'var(--shareware)',
  },
  commercialLicense: {
    backgroundColor: 'var(--commercial)',
  },
  etcLicense: {
    backgroundColor: 'var(--etc)',
  },
  exceptionLicense: {
    backgroundColor: 'var(--exception)',
  },
  unknownLicense: {
    backgroundColor: 'var(--unknown)',
  },
  noneLicense: {
    backgroundColor: 'var(--none)',
  },
};

const DataTable = ({ selectedppList, currentPage, itemsPerPage, handleLTypeChange, licenseTypeMap,
  openEvidenceModal, handleDelete, handleScoreChange, evidencesMap }) => {
  const [displayedRows, setDisplayedRows] = useState([]);
  const [selectedLicenseTypes, setSelectedLicenseTypes] = useState({});
  const [isHovered, setIsHovered] = useState(false);
  const [modalShow, setModalShow] = useState(false);
  const [deleteHover, setDeleteHover] = useState(false);
  const [hoverIndex, setHoverIndex] = useState(null);
  const [isTooltipVisible, setIsTooltipVisible] = useState(false);
  const [eviScoreMap, setEviScoreMap] = useState({});

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
      const licenseType = licenseTypeMap.get(obj.id);
      initialSelectedLicenseTypes[obj.id] = licenseType !== undefined ? licenseType : null;
      if (licenseType === undefined) {
        console.log(`No license type found for ID: ${obj.id}`);
      } else {
        console.log(`licenseTypeMap[${obj.id}]`, licenseType);
      }
    });
    setSelectedLicenseTypes(initialSelectedLicenseTypes);
  }, [selectedppList, licenseTypeMap]);

  useEffect(() => {
    const initialEviScoreMap = {};
    selectedppList.forEach(obj => {
      const evidenceScore = evidencesMap.get(obj.id);
      initialEviScoreMap[obj.id] = evidenceScore !== undefined ? evidenceScore : null;
      if (evidenceScore === undefined) {
        console.log(`No evidence score found for ID: ${obj.id}`);
      } else {
        console.log(`evidencesMap[${obj.id}]`, evidenceScore);
      }
    });
    setEviScoreMap(initialEviScoreMap);
  }, [selectedppList, evidencesMap]);
  

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

  const copyToClipboard = async (text) => {
    try {
      await navigator.clipboard.writeText(text);
      alert("클립보드에 링크가 복사되었습니다.");
    } catch (err) {
      console.log(err);
    }
  }

  const handleEviScoreClick = (ppId, eviIdx, score) => {
    const evidenceArray = eviScoreMap[ppId];
    const specificEvidence = evidenceArray[eviIdx];

    const updatedEvidence = {
      ...specificEvidence,
      score: score
    };

    setEviScoreMap(prevState => ({
      ...prevState,
      [ppId]: [
        ...evidenceArray.slice(0, eviIdx),
        updatedEvidence,
        ...evidenceArray.slice(eviIdx + 1)
      ]
    }));

    handleScoreChange(ppId, eviIdx, score);
  };

  const getLicenseTypeStyle = (licenseType) => {
    switch (licenseType) {
      case "FREE":
        return styles.freeLicense;
      case "SHAREWARE":
        return styles.sharewareLicense;
      case "COMMERCIAL":
        return styles.commercialLicense;
      case "ETC":
        return styles.etcLicense;
      case "EXCEPTION":
        return styles.exceptionLicense;
      case "NONE":
        return styles.noneLicense;
      case "UNKNOWN":
        return styles.unknownLicense;
      default:
        return styles.noneLicense;
    }
  };

  const getCopilotQ = (pattern) => {
    let pub = null;
    let prod = null;
    Object.entries(JSON.parse(pattern)).forEach(([key, value]) => {
      if (key === "productName") {
        prod = value;
      }
      if (key === "publisher") {
        pub = value;
      }
    });

    if (pub && prod) {
      return `https://www.bing.com/chat?iscopilotedu=1&sendquery=1&q=${encodeURIComponent(`${pub}의 ${prod}의 라이선스 유형이 뭐야?`)}`;
    } else if (pub) {
      return `https://www.bing.com/chat?iscopilotedu=1&sendquery=1&q=${encodeURIComponent(`${pub}의 라이선스 유형이 뭐야?`)}`;
    } else if (prod) {
      return `https://www.bing.com/chat?iscopilotedu=1&sendquery=1&q=${encodeURIComponent(`${prod}의 라이선스 유형이 뭐야?`)}`;
    } else {
      return "https://www.bing.com";
    }
  };

  const getgoogleQ = (pattern) => {
    let pub = null;
    let prod = null;
    Object.entries(JSON.parse(pattern)).forEach(([key, value]) => {
      if (key === "productName") {
        prod = value;
      }
      if (key === "publisher") {
        pub = value;
      }
    });

    if (pub && prod) {
      return `https://www.google.com/search?q=${encodeURIComponent(`${pub} ${prod}`)}`;
    } else if (pub) {
      return `https://www.google.com/search?q=${encodeURIComponent(`${pub}`)}`;
    } else if (prod) {
      return `https://www.google.com/search?q=${encodeURIComponent(`${prod}`)}`;
    } else {
      return "https://www.google.com";
    }
  };


  const changeExceptionTypeToLabel = (exceptionType) => {
    const exceptionContents = {
      'PRODUCT_MATCH': 'A',
      'PUBLISHER_MATCH': 'B',
      'PUBLISHER_EXACT_MATCH': 'C',
      'PUBLISHER_PRODUCT_EXACT_MATCH': 'D'
    };

    return exceptionContents[exceptionType];
  }

  const changeLicenseTypeToLabel = (licenseType) => {
    const licenseContents = {
      'FREE': '프리',
      'SHAREWARE': '셰어',
      'COMMERCIAL': '상용',
      'ETC': '기타',
      'EXCEPTION': '예외',
      'NONE': '미정',
      'UNKNOWN': '없음',
    };

    return licenseContents[licenseType];
  }

  return (
    <div style={styles.dataTbl}>
      {modalShow &&
        <ExceptionModal
          show={modalShow}
          onHide={() => setModalShow(false)}
        />}
      <div style={styles.tableHeader}>
        <div style={{ ...styles.tableHeaderCell, ...styles.index }}>#</div>
        <div style={{ ...styles.tableHeaderCell, width: '11%' }}>저작권 종류</div>
        <div style={{ ...styles.tableHeaderCell, ...styles.dataBox }}>수집Data</div>
        <div style={{ ...styles.tableHeaderCell, ...styles.licenseTypes, ...(isHovered && styles.exception) }}
          onMouseEnter={() => setIsHovered(true)}
          onMouseLeave={() => setIsHovered(false)}
          onClick={() => setModalShow(true)}
        >저작권 분류(예외)</div>
        <div style={{ ...styles.tableHeaderCell, ...styles.evidences }}>근거 자료</div>
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
                    <RiDeleteBin6Line />
                  ) : (
                    (currentPage - 1) * itemsPerPage + index + 1
                  )}
                </div>
                <div style={{ ...styles.tableCell, cursor: 'pointer', width: '11%' }}>
                  <div style={{ textAlign: 'left' }}>
                    <div onClick={() => handleLicenseTypeClick(obj.id, 'FREE')}>
                      {selectedLicenseTypes[obj.id] === 'FREE' ? <MdCheckBox /> : <MdCheckBoxOutlineBlank />}
                      <span> 무료</span>
                    </div>
                    <div onClick={() => handleLicenseTypeClick(obj.id, 'SHAREWARE')}>
                      {selectedLicenseTypes[obj.id] === 'SHAREWARE' ? <MdCheckBox /> : <MdCheckBoxOutlineBlank />}
                      <span> 셰어</span>
                    </div>
                    <div onClick={() => handleLicenseTypeClick(obj.id, 'COMMERCIAL')}>
                      {selectedLicenseTypes[obj.id] === 'COMMERCIAL' ? <MdCheckBox /> : <MdCheckBoxOutlineBlank />}
                      <span> 상용</span>
                    </div>
                    <div onClick={() => handleLicenseTypeClick(obj.id, 'ETC')}>
                      {selectedLicenseTypes[obj.id] === 'ETC' ? <MdCheckBox /> : <MdCheckBoxOutlineBlank />}
                      <span> 기타</span>
                    </div>
                    <div onClick={() => handleLicenseTypeClick(obj.id, 'EXCEPTION')}>
                      {selectedLicenseTypes[obj.id] === 'EXCEPTION' ? <MdCheckBox /> : <MdCheckBoxOutlineBlank />}
                      <span> 예외</span>
                    </div>
                    <div onClick={() => handleLicenseTypeClick(obj.id, 'NONE')}>
                      {selectedLicenseTypes[obj.id] === 'NONE' ? <MdCheckBox /> : <MdCheckBoxOutlineBlank />}
                      <span> 미정</span>
                    </div>
                  </div>
                </div>
                <div style={{ ...styles.dataBox }}>
                  <div>
                    <div className='icon' style={{ ...styles.iconBox }}></div>
                    <div style={{ ...styles.dataInnerBox }}>
                      {Object.entries(JSON.parse(obj.patterns)).map(([key, value]) => (
                        <React.Fragment key={key}>
                          {key === "publisher" &&
                            <p style={styles.itemData} onClick={() => copyToClipboard(value)}>{value}</p>
                          }
                        </React.Fragment>
                      ))}
                      {Object.entries(JSON.parse(obj.patterns)).map(([key, value]) => (
                        <React.Fragment key={key}>
                          {key === "productName" &&
                            <p style={{ ...styles.itemData, ...styles.textBold }} onClick={() => copyToClipboard(value)}>{value}</p>
                          }
                          {key === "collectedCount" && <p style={{ ...styles.itemData }}>수집량 : {value}</p>}
                        </React.Fragment>
                      ))}

                      <a style={{ ...styles.itemData, ...styles.btnSearch }} target='_blank'
                        href={getCopilotQ(obj.patterns)}>
                        Copliot
                      </a>
                      <a style={{ ...styles.itemData, ...styles.btnSearch }} target='_blank'
                        href={getgoogleQ(obj.patterns)}>
                        Google
                      </a>
                    </div>
                  </div>
                </div>
                <div
                  style={{ ...styles.tableCell, ...styles.licenseTypes }}
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
                    : (
                      <>
                        <p>1차 : {obj.exceptions ? "-" : changeLicenseTypeToLabel(obj.fastText)}</p>
                        <p>2차 : {obj.exceptions ? "-" : changeLicenseTypeToLabel(obj.llm)}</p>
                      </>
                    )
                  }
                  {obj.exceptionKeyword && isTooltipVisible && hoverIndex === index && (
                    <CustomTootip exceptionType={obj.exceptionKeyword.type} />
                  )}
                </div>
                <ul style={{ ...styles.tableCell, ...styles.evidences }}>
                  {!obj.exceptions && obj.evidences && obj.evidences !== "" && obj.evidences.map((evidence, index) => (
                    <li key={index}>
                      <div style={{ ...styles.evidenceLi }}>
                        <span style={{ ...styles.evidencesBtn }} className='evdBtn' onClick={() => openEvidenceModal(obj.id, eviScoreMap[obj.id][index], index)} >
                          {evidence.official_site && <div style={{ ...styles.officialMark }}><PiSealCheckFill /></div>}
                          {evidence.license && evidence.license.license_type && evidence.license.certainty != null &&
                            <span style={{ ...styles.evidencesLisence, ...(getLicenseTypeStyle(evidence.license.license_type)) }}>
                              {changeLicenseTypeToLabel(evidence.license.license_type)} | {evidence.license.certainty * 100}%
                            </span>
                          }
                          {evidence.title}
                        </span>
                        <div style={{ ...styles.likeBox }}>
                          {[1, 2, 3, 4, 5].map(star => (
                            <span key={star} onClick={() => handleEviScoreClick(obj.id, index, star)} style={{ ...styles.likeBtn }}>
                              {eviScoreMap[obj.id] && eviScoreMap[obj.id][index] && eviScoreMap[obj.id][index].score && eviScoreMap[obj.id][index].score >= star ? 
                                <FaStar /> : <FaRegStar />}
                            </span>
                          ))}
                        </div>
                      </div>
                    </li>
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
