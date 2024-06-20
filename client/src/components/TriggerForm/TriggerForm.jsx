import styles from './TriggerForm.module.css';
import { useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import WorkflowTriggerResultPopup from '../Popups/WorkflowTriggerResult/WorkflowTriggerResult.jsx';

const TriggerForm = ({ definitionId }) => {
  const dispatch = useDispatch();
  const isOpened = useSelector(state => state.popup.isOpened);
  const [instanceName, setInstanceName] = useState('');
  const [signerName, setSignerName] = useState('');
  const [signerEmail, setSignerEmail] = useState('');
  const [ccName, setCcName] = useState('');
  const [ccEmail, setCcEmail] = useState('');

  const togglePopup = async () => {
    dispatch({ type: isOpened ? 'CLOSE_POPUP' : 'OPEN_POPUP' });
  };

  const handleSubmit = (event) => {
    // TODO: Add trigger workflow with data
    event.preventDefault();
    togglePopup();

    // Here you can handle form submission, e.g., send data to server or perform validation
    console.log({
      instanceName, signerName, signerEmail, ccName, ccEmail,
    });
    // Clear form fields after submission
    setInstanceName('');
    setSignerName('');
    setSignerEmail('');
    setCcName('');
    setCcEmail('');
  };

  return (<div className={styles.formContainer}>
    <h2>Fill in details</h2>
    <div className={styles.divider} />
    <form className={styles.triggerForm} onSubmit={handleSubmit}>
      <h3>Participant Information</h3>
      <div>
        <label>Instance Name *</label>
        <input type="text" value={instanceName} onChange={(e) => setInstanceName(e.target.value)} required={true} />
      </div>

      <div>
        <label>Signer Name *</label>
        <input type="text" value={signerName} onChange={(e) => setSignerName(e.target.value)} required={true} />
      </div>

      <div>
        <label>Signer Email *</label>
        <input type="text" value={signerEmail} onChange={(e) => setSignerEmail(e.target.value)} required={true} />
      </div>

      <div>
        <label>CC Name *</label>
        <input type="text" value={ccName} onChange={(e) => setCcName(e.target.value)} required={true} />
      </div>

      <div>
        <label>CC Email *</label>
        <input type="text" value={ccEmail} onChange={(e) => setCcEmail(e.target.value)} required={true} />
      </div>

      <div className={styles.divider} />
      <button type="submit">Continue</button>
    </form>
    {isOpened && (
      <WorkflowTriggerResultPopup
        togglePopup={togglePopup}
      />
    )}
  </div>);
};

export default TriggerForm;
