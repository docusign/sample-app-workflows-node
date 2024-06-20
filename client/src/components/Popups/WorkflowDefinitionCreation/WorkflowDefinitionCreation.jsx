import { useDispatch, useSelector } from 'react-redux';
import styles from './WorkflowDefinitionCreation.module.css';
import withPopup from '../../../hocs/withPopup/withPopup.jsx';
import imgError from '../../../assets/img/workflow-trigger.svg';
import imgSuccess from '../../../assets/img/success.svg';
import { api } from '../../../api';

const WorkflowDefinitionCreation = ({ message }) => {
  const dispatch = useDispatch();
  const errorMessage = useSelector(state => state.popup.errorMessage);
  const templateName = useSelector(state => state.popup.templateName);
  const lastCreatedWorkflowId = useSelector(state => state.workflows.lastCreatedWorkflowId);
  const lastCreatedWorkflowPublished = useSelector(state => state.workflows.lastCreatedWorkflowPublished);

  const handleDownloadPrerequisites = async () => {
    await api.workflows.downloadWorkflowPrerequisites(templateName);
  };

  const handleDownloadTemplate = async () => {
    await api.workflows.downloadWorkflowTemplate(templateName);
  };

  const handlePublishWorkflow = async () => {
    if (!lastCreatedWorkflowId) return;

    dispatch({ type: 'LOADING_POPUP' });
    const workflow = await api.workflows.publishWorkflow(lastCreatedWorkflowId);

    if (workflow.status === 200) {
      dispatch({ type: 'UPDATE_WORKFLOW', payload: { lastCreatedWorkflowPublished: true } });
    }

    dispatch({ type: 'LOADED_POPUP' });
  };

  if (lastCreatedWorkflowPublished) {
    return (
      <div>
        <div className={styles.popupContainer}>
          <img src={imgSuccess} alt="" />
          <h2>Done</h2>
          <p>Workflow successfully published</p>
        </div>
      </div>
    );
  }

  if (errorMessage && templateName) {
    return (
      <div className={styles.popupContainer}>
        <img src={imgError} alt="" />
        <h2>Workflow creation was unsuccessful</h2>
        <p>{errorMessage}</p>
        <button onClick={handleDownloadTemplate}>Download Template</button>
      </div>
    );
  }

  return (
    <div className={styles.popupContainer}>
      <img src={imgSuccess} alt="" />
      <h2>{message}</h2>
      <p>To publish the workflow, proceed with the button below</p>
      <button onClick={handlePublishWorkflow}>Publish the workflow</button>
    </div>
  );
};

const WorkflowCreationPopup = withPopup(WorkflowDefinitionCreation);
export default WorkflowCreationPopup;
