import React, { useState, useEffect } from 'react';
import { Modal } from 'react-bootstrap';
import { FaRegStar } from "react-icons/fa6";
import { FaStar } from "react-icons/fa6";

const styles = {
  evidencesBtn: {
  maxWidth: '100%', 
  overflow: 'hidden', 
  textOverflow: 'ellipsis', 
  whiteSpace: 'nowrap',
  paddingBottom: '10px',
  cursor: 'pointer',
  },
  likeBox: {
    display: 'flex',
    width: '100%',
    justifyContent: 'center',
  },
  likeBtn: {
    display: 'block',
    paddingRight:'3px',
    cursor: 'pointer',
  },
}

function EvidenceModal(props) {
  const [evidence, setEvidence] = useState(null);
  const [ppId, setPpId] = useState('');
  
  useEffect(() => {
    setEvidence(props.evidence);
    console.log(evidence);
    setPpId(props.id);
  }, [props.evidence, props.id]);

  const handleCloseModal = () => {
    props.onHide();
  };

  const handleEviScoreClick = (star) => {
    const updatedEvidence = {
      ...evidence,
      score: star,
    };
    setEvidence(updatedEvidence); 
    props.handleScoreChange(ppId, props.index, star);
  };

  return (
    <Modal {...props} className='evi' centered onHide={handleCloseModal}>
        <Modal.Header closeButton className="custom-close-button evd-modal-header">
            <Modal.Title>{evidence ? evidence.title : ''}</Modal.Title>
        </Modal.Header>
        <Modal.Body className='modal-body evd-modal-body'>
          {evidence && (
            <div>
              <p>
                {evidence.summary}
              </p>
            </div>
          )}
        </Modal.Body>
        <Modal.Footer>
          
          {evidence && 
            <>
              <a style = {{...styles.evidencesBtn}} target='_blank' rel="noreferrer" href={evidence.url}>{evidence.url}</a>
              <div style={{...styles.likeBox}}>
              {[1, 2, 3, 4, 5].map(star => (
                <span key={star} onClick={() => handleEviScoreClick(star)} style={{...styles.likeBtn}}>
                  {evidence.score && evidence.score >= star ? <FaStar /> : <FaRegStar />}
                </span>
              ))}
            </div>
            </>
          }
          
        </Modal.Footer>
    </Modal>
  );
}

export default EvidenceModal;
