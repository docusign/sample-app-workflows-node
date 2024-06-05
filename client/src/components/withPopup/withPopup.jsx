import { useState } from 'react';
import Loader from '../Loader/Loader.jsx';

import styles from './withPopup.module.css';

const withPopup = (WrappedComponent) => {
  const PopupHOC = (props) => {
    const [loading, setLoading] = useState(false);

    return (
      <div className={styles.popup}>
        <div className={styles.inner}>
          <button className={styles.close} onClick={props.togglePopup} type="button" aria-label="Close">
          <span className={styles.closeLabel} aria-hidden="true">
            &times;
          </span>
          </button>
          {loading ? (
            <Loader visible={loading} />
          ) : (
            <WrappedComponent {...props} setLoading={setLoading} />
          )}
        </div>
      </div>
    );
  };

  return PopupHOC;
};

export default withPopup;
