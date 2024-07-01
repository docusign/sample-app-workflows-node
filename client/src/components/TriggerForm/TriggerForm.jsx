import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import styles from './TriggerForm.module.css';
import WorkflowTriggerResultPopup from '../Popups/WorkflowTriggerResult/WorkflowTriggerResult.jsx';
import textContent from '../../assets/text.json';
import { ROUTE } from '../../constants.js';
import { api } from '../../api';
import { openPopupWindow, closePopupWindow, updateWorkflowDefinitions } from '../../store/actions';

const TriggerForm = ({ workflowId }) => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const isPopupOpened = useSelector(state => state.popup.isOpened);
  const workflows = useSelector(state => state.workflows.workflows);
  const [instanceName, setInstanceName] = useState('');
  const [signerName, setSignerName] = useState('');
  const [signerEmail, setSignerEmail] = useState('');
  const [ccName, setCcName] = useState('');
  const [ccEmail, setCcEmail] = useState('');
  const [isDataSending, setDataSending] = useState(false);
  const [workflowInstanceUrl, setWorkflowInstanceUrl] = useState('');

  const handleCloseTriggerPopup = () => {
    dispatch(closePopupWindow());
    navigate(ROUTE.HOME);
  };

  const handleSubmit = async event => {
    event.preventDefault();

    const body = {
      instanceName,
      signerEmail,
      signerName,
      ccEmail,
      ccName,
    };

    setDataSending(true);
    const { data: triggeredWorkflow } = await api.workflows.triggerWorkflow(workflowId, body);
    setWorkflowInstanceUrl(triggeredWorkflow.workflowInstanceUrl);

    // Update workflowDefinitions. "...workflow" creates new workflow-object to avoid mutation in redux
    const updatedWorkflowDefinitions = workflows.map(workflow => {
      if (workflow.id === workflowId) {
        return {
          ...workflow,
          instanceId: triggeredWorkflow.instanceId,
          isTriggered: true,
        };
      }

      return { ...workflow };
    });

    dispatch(updateWorkflowDefinitions(updatedWorkflowDefinitions));
    setDataSending(false);

    setInstanceName('');
    setSignerName('');
    setSignerEmail('');
    setCcName('');
    setCcEmail('');
    dispatch(openPopupWindow());
  };

  return (
    <div className={styles.formContainer}>
      <h2>{textContent.triggerForm.formTitle}</h2>
      <div className={styles.divider} />
      <form className={styles.triggerForm} onSubmit={handleSubmit}>
        <h3>{textContent.triggerForm.formName}</h3>
        <div>
          <label>{textContent.triggerForm.fields.instanceName}</label>
          <input type="text" value={instanceName} onChange={e => setInstanceName(e.target.value)} required={true} />
        </div>

        <div>
          <label>{textContent.triggerForm.fields.signerName}</label>
          <input type="text" value={signerName} onChange={e => setSignerName(e.target.value)} required={true} />
        </div>

        <div>
          <label>{textContent.triggerForm.fields.signerEmail}</label>
          <input type="text" value={signerEmail} onChange={e => setSignerEmail(e.target.value)} required={true} />
        </div>

        <div>
          <label>{textContent.triggerForm.fields.ccName}</label>
          <input type="text" value={ccName} onChange={e => setCcName(e.target.value)} required={true} />
        </div>

        <div>
          <label>{textContent.triggerForm.fields.ccEmail}</label>
          <input type="text" value={ccEmail} onChange={e => setCcEmail(e.target.value)} required={true} />
        </div>

        <div className={styles.divider} />
        <button type="submit" disabled={isDataSending}>
          {textContent.buttons.continue}
        </button>
      </form>
      {isPopupOpened && (
        <WorkflowTriggerResultPopup workflowInstanceUrl={workflowInstanceUrl} togglePopup={handleCloseTriggerPopup} />
      )}
    </div>
  );
};

export default TriggerForm;
