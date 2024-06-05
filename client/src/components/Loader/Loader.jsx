import styles from './Loader.module.css';

function Loader({ visible, title, paragraph }) {
  return (
    visible && (
      <div className={styles.wrapper}>
        <span className={styles.loader}></span>
        <div>
          <h2 className={styles.Header}>{title}</h2>
          <div className={styles.Text}>{paragraph}</div>
        </div>
      </div>
    )
  );
}

export default Loader;