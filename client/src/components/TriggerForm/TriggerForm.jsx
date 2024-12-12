import { useState, useEffect } from 'react';
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
  const i9Form = [
    { fieldHeader: triggerForm.fieldsI9.field1, fieldName: 'preparerName', value: '' },
    { fieldHeader: triggerForm.fieldsI9.field2, fieldName: 'preparerEmail', value: '' },
    { fieldHeader: triggerForm.fieldsI9.field3, fieldName: 'employeeName', value: '' },
    { fieldHeader: triggerForm.fieldsI9.field4, fieldName: 'employeeEmail', value: '' },
    { fieldHeader: triggerForm.fieldsI9.field5, fieldName: 'hrApproverName', value: '' },
    { fieldHeader: triggerForm.fieldsI9.field6, fieldName: 'hrApproverEmail', value: '' },
  ];
  const offerLetterForm = [
    { fieldHeader: triggerForm.fieldsOffer.field1, fieldName: 'hrManagerName', value: '' },
    { fieldHeader: triggerForm.fieldsOffer.field2, fieldName: 'hrManagerEmail', value: '' },
    { fieldHeader: triggerForm.fieldsOffer.field3, fieldName: 'Company', value: '' },
  ];
  const ndaForm = [
    { fieldHeader: triggerForm.fieldsNda.field1, fieldName: 'hrManagerName', value: '' },
    { fieldHeader: triggerForm.fieldsNda.field2, fieldName: 'hrManagerEmail', value: '' },
  ];

  let [relevantFormFields, setRelevantFormFields] = useState([]);

  useEffect(() => {
    switch (templateType) {
      case TemplateType.I9.type:
        setRelevantFormFields(i9Form);
        break;
      case TemplateType.OFFER.type:
        setRelevantFormFields(offerLetterForm);
        break;
      case TemplateType.NDA.type:
        setRelevantFormFields(ndaForm);
        break;
      case "-":
        try {
          api.workflows.getWorkflowTriggerRequirements(workflowId).then(data => {
            setRelevantFormFields(generateDynamicForm(data.data.trigger_input_schema, 'Custom'));
          });
        } catch (error) {
          console.error("Failed to fetch trigger requirements:", error);
        }
        break;
    }
  }, [])

  const generateDynamicForm = (fieldNames) => {
    return fieldNames.map((field) => ({
      fieldHeader: field.field_name,
      fieldName: field.field_name,
      value: '',
    }));
  };

  const handleChange = (idx, event) => {
    const newRelevantForm = [...relevantFormFields];
    newRelevantForm[idx].value = event.target.value;
    setRelevantFormFields(newRelevantForm);
  };

  const handleCloseTriggerPopup = () => {
    dispatch(closePopupWindow());
    navigate(ROUTE.TRIGGER);
  };

  const handleSubmit = async event => {
    event.preventDefault();

    const body = relevantFormFields.reduce((acc, current) => {
      acc[current.fieldName] = current.value;
      return acc;
    }, {});

    if (!Object.keys(body).length) {
      navigate(ROUTE.TRIGGER);
      return;
    }

    setDataSending(true);
    const { data: triggeredWorkflow } = await api.workflows.triggerWorkflow(workflowId, templateType, body);
    setWorkflowInstanceUrl(triggeredWorkflow.instance_url);

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
  if (!relevantFormFields.length)
    return (
      <div className={styles.formContainer}>
      <h2>{triggerForm.formTitleWithoutInputs}</h2>
      
      <form className={styles.triggerForm} onSubmit={handleSubmit}>
        <button className="btn btn-primary" type="submit" disabled={isDataSending}>
          <span className="sr-only">{buttons.triggerWorkflow}</span>
          {isDataSending ? <span className="spinner-border spinner-border-sm" /> : null}
        </button>
      </form>
      {isPopupOpened && (
        <WorkflowTriggerResultPopup workflowInstanceUrl={workflowInstanceUrl} togglePopup={handleCloseTriggerPopup} />
      )}
    </div>
    );

  return (
    <div className={styles.formContainer}>
      <h2>{triggerForm.formTitle}</h2>
      <div className={styles.divider} />
      <form className={styles.triggerForm} onSubmit={handleSubmit}>
        <h3>{triggerForm.formName}</h3>

        {relevantFormFields.map((formItem, idx) => (
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
