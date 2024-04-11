import React, { useState, useEffect } from 'react';
import { Modal } from 'react-bootstrap';

const styles = {
  evidencesBtn: {
  maxWidth: '100%', 
  overflow: 'hidden', 
  textOverflow: 'ellipsis', 
  whiteSpace: 'nowrap',
  paddingBottom: '10px',
  cursor: 'pointer',
  },
}

function EvidenceModal(props) {
  const [evidence, setEvidence] = useState(null);
  
  useEffect(() => {
    setEvidence(props.evidence);
  }, [props.evidence]);

  const handleCloseModal = () => {
    props.onHide();
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
            <a style = {{...styles.evidencesBtn}} target='_blank' rel="noreferrer" href={evidence.url}>{evidence.url}</a>
          }
        </Modal.Footer>
    </Modal>
  );
}

export default EvidenceModal;
