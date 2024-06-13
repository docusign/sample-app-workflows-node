import styles from './ErrorPopup.module.css';

const ErrorPopup = (errorMessage, errorResolveAction, buttonMessage) => {
  return (
    <div className={styles.promptContainer}>
      <h2>{errorMessage}</h2>
      {
        errorResolveAction ? <button onClick={errorResolveAction}>{buttonMessage}</button> : null
      }
    </div>
  );
};

export default ErrorPopup;