import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import styles from './TriggerForm.module.css';
import WorkflowTriggerResultPopup from '../Popups/WorkflowTriggerResult/WorkflowTriggerResult.jsx';
import { triggerForm, buttons } from '../../assets/text.json';
import { ROUTE, TemplateType } from '../../constants.js';
import { api } from '../../api';
import { openPopupWindow, closePopupWindow, updateWorkflowDefinitions } from '../../store/actions';

const TriggerForm = ({ workflowId, templateType }) => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const isPopupOpened = useSelector(state => state.popup.isOpened);
  const workflows = useSelector(state => state.workflows.workflows);
  const [isDataSending, setDataSending] = useState(false);
  const [workflowInstanceUrl, setWorkflowInstanceUrl] = useState('');
  const [i9Form, setI9Form] = useState([
    { fieldHeader: 'Preparer Name', fieldName: 'preparerName', value: '' },
    { fieldHeader: 'Preparer Email', fieldName: 'preparerEmail', value: '' },
    { fieldHeader: 'Employee Name', fieldName: 'employeeName', value: '' },
    { fieldHeader: 'Employee Email', fieldName: 'employeeEmail', value: '' },
    { fieldHeader: 'HR Approver Name', fieldName: 'hrApproverName', value: '' },
    { fieldHeader: 'HR Approver Email', fieldName: 'hrApproverEmail', value: '' },
  ]);
  const [offerLetterForm, setOfferLetterForm] = useState([
    { fieldHeader: 'HR Manager Name', fieldName: 'hrManagerName', value: '' },
    { fieldHeader: 'HR Manager Email', fieldName: 'hrManagerEmail', value: '' },
    { fieldHeader: 'Company', fieldName: 'Company', value: '' },
  ]);
  const [ndaForm, setNdaForm] = useState([
    { fieldHeader: 'HR Manager Name', fieldName: 'hrManagerName', value: '' },
    { fieldHeader: 'HR Manager Email', fieldName: 'hrManagerEmail', value: '' },
  ]);

  let relevantForm = [];
  let relevantSetter = null;
  switch (templateType) {
    case TemplateType.I9.type:
      relevantForm = i9Form;
      relevantSetter = setI9Form;
      break;
    case TemplateType.OFFER.type:
      relevantForm = offerLetterForm;
      relevantSetter = setOfferLetterForm;
      break;
    case TemplateType.NDA.type:
      relevantForm = ndaForm;
      relevantSetter = setNdaForm;
      break;
  }

  const handleChange = (idx, event) => {
    const newRelevantForm = [...relevantForm];
    newRelevantForm[idx].value = event.target.value;
    relevantSetter(newRelevantForm);
  };

  const handleCloseTriggerPopup = () => {
    dispatch(closePopupWindow());
    navigate(ROUTE.HOME);
  };

  const handleSubmit = async event => {
    event.preventDefault();

    const body = relevantForm.reduce((acc, current) => {
      acc[current.fieldName] = current.value;
      return acc;
    }, {});

    if (!Object.keys(body).length) {
      navigate(ROUTE.TRIGGER);
      return;
    }

    setDataSending(true);
    const { data: triggeredWorkflow } = await api.workflows.triggerWorkflow(workflowId, templateType, body);
    setWorkflowInstanceUrl(triggeredWorkflow.workflowInstanceUrl);

    // Update workflowDefinitions. "...workflow" creates new workflow-object to avoid mutation in redux
    const updatedWorkflowDefinitions = workflows.map(w => {
      if (w.id !== workflowId) return { ...w };

      return {
        ...w,
        instanceId: triggeredWorkflow.instanceId,
        isTriggered: true,
      };
    });

    dispatch(updateWorkflowDefinitions(updatedWorkflowDefinitions));
    setDataSending(false);
    dispatch(openPopupWindow());
  };

  return (
    <div className={styles.formContainer}>
      <h2>{triggerForm.formTitle}</h2>
      <div className={styles.divider} />
      <form className={styles.triggerForm} onSubmit={handleSubmit}>
        <h3>{triggerForm.formName}</h3>

        {relevantForm.map((formItem, idx) => (
          <div key={formItem.fieldHeader}>
            <label>{formItem.fieldHeader}</label>
            <input type="text" value={formItem.value} onChange={e => handleChange(idx, e)} required={true} />
          </div>
        ))}

        <div className={styles.divider} />
        <button className="btn btn-primary" type="submit" disabled={isDataSending}>
          <span className="sr-only">{buttons.continue}</span>
          {isDataSending ? <span className="spinner-border spinner-border-sm" /> : null}
        </button>
      </form>
      {isPopupOpened && (
        <WorkflowTriggerResultPopup workflowInstanceUrl={workflowInstanceUrl} togglePopup={handleCloseTriggerPopup} />
      )}
    </div>
  );
};

export default TriggerForm;
