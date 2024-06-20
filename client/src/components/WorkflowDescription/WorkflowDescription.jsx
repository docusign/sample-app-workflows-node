import { Link } from 'react-router-dom';
import styles from './WorkflowDescription.module.css';

const WorkflowDescription = ({ title, behindTheScenesComponent, backRoute }) => {
  return (
    <div className={styles.descriptionContainer}>
      <Link to={backRoute}>
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
