import { useNavigate } from 'react-router-dom';
import { useDispatch } from 'react-redux';
import styles from './WorkflowTriggerResult.module.css';
import withPopup from '../../../hocs/withPopup/withPopup.jsx';
import imgSuccess from '../../../assets/img/success.svg';
import textContent from '../../../assets/text.json';
import { ROUTE } from '../../../constants.js';
import { closePopupWindow } from '../../../store/actions';

const WorkflowTriggerResult = ({ workflowInstanceUrl }) => {
  const navigate = useNavigate();
  const dispatch = useDispatch();

  const handleFinishTrigger = async () => {
    dispatch(closePopupWindow());
    navigate(ROUTE.TRIGGER);
  };

  return (
    <div className={styles.popupContainer}>
      <img src={imgSuccess} alt="" />
      <h2>{textContent.popups.workflowTriggered.title}</h2>
      <p className={styles.popupMessageContainer} dangerouslySetInnerHTML={{ __html: textContent.popups.workflowTriggered.description }}></p>
      <a href={workflowInstanceUrl} target="_blank" rel="noreferrer" onClick={handleFinishTrigger}>
        {textContent.buttons.continue}
      </a>
    </div >
  );
};
const WorkflowTriggerResultPopup = withPopup(WorkflowTriggerResult);
export default WorkflowTriggerResultPopup;
