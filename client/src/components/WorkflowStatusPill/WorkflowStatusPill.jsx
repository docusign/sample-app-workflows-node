import styles from './WorkflowStatusPill.module.css';

const WorkflowStatusPill = ({ status }) => {
    return (
        <div className={`${styles.workflowStatusPill} ${styles[status?.replace(/\s/g, "")]}`}>
            {status}
        </div>
    );
}

export default WorkflowStatusPill;