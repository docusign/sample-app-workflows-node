import { useState } from 'react';
import Loader from '../Loader/Loader.jsx';
import { LoginStatus } from '../../constants.js';

import styles from './LoginForm.module.css';

const LoginForm = ({ togglePopup }) => {
  const [loading, setLoading] = useState(false);
  const [authType, setAuthType] = useState(LoginStatus.ACG);

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      setLoading(true);
      // TODO: Add login functionality
      //await login(authType);
      setLoading(false);
    } catch (error) {
      setLoading(false);
      console.log("handleSubmit error");
      console.log(error);
    }
  };

  const handleChange = (e) => {
    const value = e.target.value;
    setAuthType(value);
  };

  return (
    <div className={styles.popup}>
      <div className={styles.inner}>
        <button className={styles.close} onClick={togglePopup} type="button" aria-label="Close">
          <span aria-hidden="true">&times;</span>
        </button>
        {loading ? <Loader visible={loading} /> :
          <div>
            <h2>Log in</h2>
            <form className={styles.form} onSubmit={handleSubmit}>
              <h3>Select authentication type</h3>
              <div className={styles.authVariants}>
                <div className={styles.radioButtonWrapper}>
                  <label className={styles.label}>
                    <input type="radio"
                           name="Auth"
                           value={LoginStatus.ACG}
                           checked={authType === LoginStatus.ACG}
                           onChange={handleChange} />
                    Authorization Token Grant
                  </label>
                  <label className={styles.subLabel}>
                    Web Apps
                  </label>
                </div>
                <div className={styles.radioButtonWrapper}>
                  <label className={styles.label}>
                    <input type="radio"
                           name="Auth"
                           value={LoginStatus.JWT}
                           checked={authType === LoginStatus.JWT}
                           onChange={handleChange} />
                    JWT Grant
                  </label>
                  <label className={styles.subLabel}>
                    System integrations
                  </label>
                </div>
              </div>
              <div className={styles.formButtons}>
                <button type="submit">Log in</button>
                <button className={styles.cancel} type="button" onClick={togglePopup}>Cancel</button>
              </div>
            </form>
          </div>
        }
      </div>
    </div>
  );
};

export default LoginForm;
