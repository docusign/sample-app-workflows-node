import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useDispatch } from 'react-redux';
import styles from './LoginForm.module.css';
import withPopup from '../../hocs/withPopup/withPopup.jsx';
import { LoginStatus, ROUTE } from '../../constants.js';
import { api } from '../../api';

const LoginForm = ({ togglePopup, setLoading }) => {
  const [authType, setAuthType] = useState(LoginStatus.ACG);
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const handleSubmit = async e => {
    e.preventDefault();
    dispatch({ type: 'LOADING_POPUP' });

    try {
      if (authType === LoginStatus.JWT) {
        const res = await api.jwt.login();
        dispatch({ type: 'LOGIN', payload: { authType, userName: res.data.name, userEmail: res.data.email } });
        navigate(ROUTE.HOME);
        dispatch({ type: 'CLOSE_POPUP' });
        dispatch({ type: 'LOADED_POPUP' });
      }
      if (authType === LoginStatus.ACG) {
        api.acg.login();
      }
    } catch (error) {
      setLoading(false);
      console.log(error);
    }
  };

  const handleChange = e => {
    const value = e.target.value;
    setAuthType(value);
  };

  return (
    <div>
      <h2>Log in</h2>
      <form className={styles.form} onSubmit={handleSubmit}>
        <h3>Select authentication type</h3>
        <div className={styles.authVariants}>
          <div className={styles.radioButtonWrapper}>
            <label className={styles.label}>
              <input
                type="radio"
                name="Auth"
                value={LoginStatus.ACG}
                checked={authType === LoginStatus.ACG}
                onChange={handleChange}
              />
              {LoginStatus.ACG}
            </label>
            <label className={styles.subLabel}>This authentication type provides functionality of creating, triggering
              and managing workflows.</label>
          </div>
          <div className={styles.radioButtonWrapper}>
            <label className={styles.label}>
              <input
                type="radio"
                name="Auth"
                value={LoginStatus.JWT}
                checked={authType === LoginStatus.JWT}
                onChange={handleChange}
              />
              {LoginStatus.JWT}
            </label>
            <label className={styles.subLabel}>This authentication type provides functionality of only triggering and managing workflows.</label>
          </div>
        </div>
        <div className={styles.formButtons}>
          <button type="submit">Log in</button>
          <button className={styles.cancel} type="button" onClick={togglePopup}>
            Cancel
          </button>
        </div>
      </form>
    </div>
  );
};

const PopupLoginForm = withPopup(LoginForm);
export default PopupLoginForm;
