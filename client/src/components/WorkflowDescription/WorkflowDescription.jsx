import { Link } from 'react-router-dom';
import styles from './WorkflowDescription.module.css';
import { ROUTE } from '../../constants.js';

const WorkflowDescription = ({ title, behindTheScenesComponent }) => {
  return (
    <div className={styles.descriptionContainer}>
      <Link to={ROUTE.HOME}>
        <button className={styles.backButton}>&#129028; Back</button>
      </Link>
      <h2>{title}</h2>
      <div className={`dropdown ${styles.dropDown}`}>
        <button
          className="btn btn-secondary dropdown-toggle"
          type="button"
          id="dropdownMenuButton"
          data-toggle="dropdown"
          aria-haspopup="true"
          aria-expanded="false"
        >
          Behind the scenes
        </button>
        {behindTheScenesComponent}
      </div>
    </div>
  );
};

export default WorkflowDescription;
