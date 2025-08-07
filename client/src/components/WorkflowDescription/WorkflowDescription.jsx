import { Link } from 'react-router-dom';
import styles from './WorkflowDescription.module.css';
import textContent from '../../assets/text.json';

const WorkflowDescription = ({ title, behindTheScenesComponent, backRoute, backText }) => {
  return (
    <div className={styles.descriptionContainer}>
      {backRoute && (
        <Link to={backRoute}>
          <button className={styles.backButton}>{backText}</button>
        </Link>
      )}

      <h2>{title}</h2>
      <div className={`dropdown ${styles.dropDown}`}>
        <button
          className="btn btn-secondary dropdown-toggle"
          type="button"
          id="dropdownMenuButton"
          data-bs-toggle="dropdown"
          aria-haspopup="true"
          aria-expanded="false"
        >
          {textContent.buttons.behindTheScenes}
        </button>
        {behindTheScenesComponent}
      </div>
    </div>
  );
};

export default WorkflowDescription;
