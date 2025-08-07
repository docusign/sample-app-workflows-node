import styles from './StatusLoader.module.css';

const StatusLoader = () => {
    return (
        <div className={styles.loader}>
            <div></div>
            <div></div>
            <div></div>
            <div></div>
            <div></div>
        </div>
    );
};

export default StatusLoader;