import { useDispatch, useSelector } from 'react-redux';
import styles from './WorkflowDefinitionCreation.module.css';
import withPopup from '../../../hocs/withPopup/withPopup.jsx';
import imgError from '../../../assets/img/workflow-trigger.svg';
import imgSuccess from '../../../assets/img/success.svg';
import { api } from '../../../api';
import textContent from '../../../assets/text.json';

const WorkflowDefinitionCreation = ({ message }) => {
  const dispatch = useDispatch();
  const errorMessage = useSelector(state => state.popup.errorMessage);
  const templateName = useSelector(state => state.popup.templateName);
  const lastCreatedWorkflow = useSelector(state => state.workflows.lastCreatedWorkflow);

  const handleDownloadTemplate = async () => {
    await api.workflows.downloadWorkflowTemplate(templateName);
  };

  const handlePublishWorkflow = async () => {
    if (!lastCreatedWorkflow.id) return;

    dispatch({ type: 'LOADING_POPUP' });
    const workflow = await api.workflows.publishWorkflow(lastCreatedWorkflow.id);

    if (workflow?.status === 200) {
      dispatch({ type: 'PUBLISHED_LAST_WORKFLOW' });
    }

    dispatch({ type: 'LOADED_POPUP' });
  };

  if (lastCreatedWorkflow?.isPublished) {
    return (
      <div>
        <div className={styles.popupContainer}>
          <img src={imgSuccess} alt="" />
          <h2>{textContent.popups.workflowDefinitionCreated.published.title}</h2>
          <p>{textContent.popups.workflowDefinitionCreated.published.description}</p>
        </div>
      </div>
    );
  }

  if (errorMessage && templateName) {
    return (
      <div className={styles.popupContainer}>
        <img src={imgError} alt="" />
        <h2>{textContent.popups.workflowDefinitionCreated.error.title}</h2>
        <p>{errorMessage}</p>
        <button onClick={handleDownloadTemplate}>{textContent.popups.workflowDefinitionCreated.error.button}</button>
      </div>
    );
  }

  return (
    <div className={styles.popupContainer}>
      <img src={imgSuccess} alt="" />
      <h2>{message}</h2>
      <p>{textContent.popups.workflowDefinitionCreated.publish.description}</p>
      <button onClick={handlePublishWorkflow}>{textContent.popups.workflowDefinitionCreated.publish.button}</button>
    </div>
  );
};

const WorkflowCreationPopup = withPopup(WorkflowDefinitionCreation);
export default WorkflowCreationPopup;
