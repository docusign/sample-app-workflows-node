import { useNavigate } from 'react-router-dom';
import { useDispatch } from 'react-redux';
import styles from './WorkflowTriggerResult.module.css';
import withPopup from '../../../hocs/withPopup/withPopup.jsx';
import imgSuccess from '../../../assets/img/success.svg';
import { ROUTE } from '../../../constants.js';
import textContent from '../../../assets/text.json';

const WorkflowTriggerResult = ({ workflowInstanceUrl }) => {
  const navigate = useNavigate();
  const dispatch = useDispatch();

  const handleFinishTrigger = async () => {
    dispatch({ type: 'CLOSE_POPUP' });
    navigate(ROUTE.HOME);
  };

  return (
    <div className={styles.popupContainer}>
      <img src={imgSuccess} alt="" />
      <h2>{textContent.popups.workflowTriggered.title}</h2>
      <p>{textContent.popups.workflowTriggered.description}</p>
      <a href={workflowInstanceUrl} target="_blank" rel="noreferrer" onClick={handleFinishTrigger}>{textContent.buttons.continue}</a>
    </div>
  );
};
const WorkflowTriggerResultPopup = withPopup(WorkflowTriggerResult);
export default WorkflowTriggerResultPopup;
