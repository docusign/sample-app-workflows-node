import withPopup from '../../../hocs/withPopup/withPopup.jsx';
import styles from './AcgPrompt.module.css';

const AcgPrompt = () => {
  return (
    <div className={styles.promptContainer}>
      <h2>To use this feature, please Log in using ACG</h2>
    </div>
  );
};

const WrappedAcgPrompt = withPopup(AcgPrompt);
export default WrappedAcgPrompt;