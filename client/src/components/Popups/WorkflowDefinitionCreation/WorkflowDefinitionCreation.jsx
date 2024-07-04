import { useDispatch, useSelector } from 'react-redux';
import styles from './WorkflowDefinitionCreation.module.css';
import withPopup from '../../../hocs/withPopup/withPopup.jsx';
import imgError from '../../../assets/img/workflow-trigger.svg';
import imgSuccess from '../../../assets/img/success.svg';
import textContent from '../../../assets/text.json';
import { api } from '../../../api';
import {
  closeLoadingCircleInPopup,
  openLoadingCircleInPopup,
  showErrorTextInPopup,
  publishCreatedWorkflow,
} from '../../../store/actions';

const WorkflowDefinitionCreation = ({ message }) => {
  const dispatch = useDispatch();
  const errorMessage = useSelector(state => state.popup.errorMessage);
  const errorHeader = useSelector(state => state.popup.errorHeader);
  const templateName = useSelector(state => state.popup.templateName);
  const lastCreatedWorkflow = useSelector(state => state.workflows.lastCreatedWorkflow);

  const handleDownloadTemplate = async () => {
    await api.workflows.downloadWorkflowTemplate(templateName);
  };

  const handlePublishWorkflow = async () => {
    if (!lastCreatedWorkflow.id) return;

    dispatch(openLoadingCircleInPopup());
    const workflow = await api.workflows.publishWorkflow(lastCreatedWorkflow.id);

    if (workflow?.status === 200) {
      dispatch(publishCreatedWorkflow());
      dispatch(closeLoadingCircleInPopup());
      return;
    }

    if (workflow?.status === 400 && workflow?.data?.errorMessage.includes('limit (5)')) {
      dispatch(
        showErrorTextInPopup(
          'Publish workflow was unsuccessful',
          "You've used all your 5 available workflows on the account. Delete active workflows to make space.",
          null
        )
      );
      dispatch(closeLoadingCircleInPopup());
      return;
    }

    dispatch(
      showErrorTextInPopup(
        'Publish workflow was unsuccessful',
        'The Docusign server returned an error during the workflow publishing. Try again later.',
        null
      )
    );
    dispatch(closeLoadingCircleInPopup());
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

  if (errorMessage) {
    return (
      <div className={styles.popupContainer}>
        <img src={imgError} alt="" />
        <h2>{errorHeader ?? textContent.popups.workflowDefinitionCreated.error.title}</h2>
        <p>{errorMessage}</p>
        {templateName && (
          <button onClick={handleDownloadTemplate}>{textContent.popups.workflowDefinitionCreated.error.button}</button>
        )}
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
