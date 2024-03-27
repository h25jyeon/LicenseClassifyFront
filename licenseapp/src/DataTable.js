import React, { useEffect, useState } from 'react';
import { Motion, spring } from 'react-motion';
import CustomSelect from './CustomSelect';

const styles = {
  dataTbl: {
    boxShadow: '5px 5px 10px var(--btn-shadow-color)',
    margin: '20px auto',
    width: '100%',
    backgroundColor: 'var(--gray-background-color)',
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
    width: '8%',
    textAlign: 'center',
  },
  productName: {
    width:'28%',
  },
  publisher: {
    width:'12%',
  },
  evidences: {
    flexGrow: '1',
  },
};

const DataTable = ({ selectedppList, currentPage, itemsPerPage, handleLTypeChange, licenseTypeMap, openEvidenceModal }) => {
  const [displayedRows, setDisplayedRows] = useState([]);

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

  return (
    <div style={styles.dataTbl}>
      <div style={styles.tableHeader}>
        <div style={{ ...styles.tableHeaderCell, ...styles.index }}>#</div>
        <div style={{ ...styles.tableHeaderCell, ...styles.licenseType }}>licenseType</div>
        <div style={{ ...styles.tableHeaderCell, ...styles.productName }}>productName</div>
        <div style={{ ...styles.tableHeaderCell, ...styles.publisher }}>publisher</div>
        <div style={{ ...styles.tableHeaderCell, ...styles.licenseType }}>exceptions</div>
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
                <div style={{ ...styles.tableCell, ...styles.index }}>{(currentPage - 1) * itemsPerPage + index + 1}</div>
                <div style={{ ...styles.tableCell, ...styles.licenseType }}>
                  <CustomSelect
                    id={obj.id}
                    options={[
                      { value: "FREE", label: "FREE" },
                      { value: "SHAREWARE", label: "SHAREWARE" },
                      { value: "COMMERCIAL", label: "COMMERCIAL" },
                      { value: "ETC", label: "ETC" },
                      { value: "NONE", label: "NONE" }
                    ]}
                    myFontSize="14px"
                    handleSelectChange={handleLTypeChange}
                    selectedValue={licenseTypeMap.get(obj.id)}
                    fontColor="#1d2023"
                    backgroundColor={'var(--white)'}
                    selectedBackgroundColor="#1d2023"
                    selectedColor={'var(--white)'}
                    hoverColor={'var(--white)'}
                    hoverBackgroundColor={'rgba(29, 32, 35, 0.5)'}
                    width={100}
                    controlColor={'var(--default-text-color)'}
                    controlBackgroundColor={'rgba(0)'}
                    menuPlacement={"bottom"}
                  />
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
                <div style={{ ...styles.tableCell, ...styles.licenseType }}>{obj.exceptions ? 'Yes' : 'No'}</div>
                <div style={{ ...styles.tableCell, ...styles.licenseType }}>{obj.exceptions ? "-" : obj.fastText}</div>
                <div style={{ ...styles.tableCell, ...styles.licenseType }}>{obj.exceptions ? "-" : obj.llm}</div>
                <div style={{ ...styles.tableCell, ...styles.evidences }}>
                  { !obj.exceptions  && obj.evidences && obj.evidences !== "" && JSON.parse(obj.evidences).map((evidence, index) => (
                    <button className='evdBtn' key={index} onClick={() => openEvidenceModal(evidence)}>{evidence.title}</button>
                  ))}
                </div>
              </div>
            )}
          </Motion>
        ))}
      </div>
    </div>
  );
};

export default DataTable;
