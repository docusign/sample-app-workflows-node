import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useDispatch } from 'react-redux';
import styles from './LoginForm.module.css';
import withPopup from '../../hocs/withPopup/withPopup.jsx';
import textContent from '../../assets/text.json';
import { LoginStatus, ROUTE } from '../../constants.js';
import { api } from '../../api';
import {
  authorizeUser,
  closeLoadingCircleInPopup,
  closePopupWindow,
  openLoadingCircleInPopup,
} from '../../store/actions';

const LoginForm = ({ togglePopup }) => {
  const [authType, setAuthType] = useState(LoginStatus.ACG);
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const handleSubmit = async e => {
    e.preventDefault();
    dispatch(openLoadingCircleInPopup());

    try {
      if (authType === LoginStatus.JWT) {
        const { data: userInfo } = await api.jwt.login();
        dispatch(authorizeUser(authType, userInfo.name, userInfo.email));
        navigate(ROUTE.HOME);
        dispatch(closePopupWindow());
        dispatch(closeLoadingCircleInPopup());
      }
      if (authType === LoginStatus.ACG) {
        api.acg.login();
      }
    } catch (error) {
      dispatch(closeLoadingCircleInPopup());
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
              {textContent.login.acg}
            </label>
            <label className={styles.subLabel}>{textContent.login.acgDescription}</label>
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
              {textContent.login.jwt}
            </label>
            <label className={styles.subLabel}>{textContent.login.jwtDescription}</label>
          </div>
        </div>
        <div className={styles.formButtons}>
          <button type="submit">{textContent.buttons.login}</button>
          <button className={styles.cancel} type="button" onClick={togglePopup}>
            {textContent.buttons.cancel}
          </button>
        </div>
      </form>
    </div>
  );
};

const PopupLoginForm = withPopup(LoginForm);
export default PopupLoginForm;
