import styles from './Loader.module.css';

const Loader = ({ visible, title, paragraph }) => {
  return (
    visible && (
      <div className={styles.wrapper}>
        <span className={styles.loader}></span>
        {title ?
          <div>
            <h2 className={styles.Header}>{title}</h2>
            <div className={styles.Text}>{paragraph}</div>
          </div>
          : null
        }
      </div>
    )
  );
};

export default Loader;