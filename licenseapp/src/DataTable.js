import React, { useEffect, useState } from 'react';
import { Motion, spring } from 'react-motion';
import CustomSelect from './CustomSelect';
import './DataTable.css'; 

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
              <tr style={{
                opacity: style.opacity,
                transform: `translateY(${style.translateY}px)` 
              }}>
                <td>{(currentPage - 1) * itemsPerPage + index + 1}</td>
                <td className='licenseSelect'>
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
                    width={150}
                    controlColor={'var(--default-text-color)'}
                    controlBackgroundColor={'rgba(0)'}
                  />
                </td>
                {Object.entries(JSON.parse(obj.patterns)).map(([key, value]) => (
                  <React.Fragment key={key}>
                    {key === "productName" && (
                      <td key={key + "_productName"}>{value}</td>
                    )}
                    {key === "publisher" && (
                      <td key={key + "_publisher"}>{value}</td>
                    )}
                  </React.Fragment>
                ))}
                <td>{obj.exceptions ? 'Yes' : 'No'}</td>
                <td>{obj.fastText}</td>
                <td>{obj.llm}</td>
                <td>
                  {obj.evidences && obj.evidences !== "" && JSON.parse(obj.evidences).map((evidence, index) => (
                    <button className='evdBtn' key={index} onClick={() => openEvidenceModal(evidence)}>{evidence.title}</button>
                  ))}
                </td>
              </tr>
            )}
          </Motion>
        ))}
      </tbody>
    </table>
  );
};

export default DataTable;
