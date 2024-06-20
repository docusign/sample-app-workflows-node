import { useNavigate } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import styles from './Hero.module.css';
import Footer from '../../components/Footer/Footer.jsx';
import Header from '../../components/Header/Header.jsx';
import textContent from '../../assets/text.json';
import PopupLoginForm from '../../components/LoginForm/LoginForm.jsx';
import { LoginStatus, ROUTE } from '../../constants.js';
import { api } from '../../api';

const Hero = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const isOpened = useSelector(state => state.popup.isOpened);
  const authType = useSelector(state => state.auth.authType);

  const togglePopup = async () => {
    if (!authType) {
      dispatch({ type: isOpened ? 'CLOSE_POPUP' : 'OPEN_POPUP' });
      return;
    }

    if (authType === LoginStatus.ACG) {
      const isLoggedIn = await api.acg.loginStatus();
      isLoggedIn && navigate(ROUTE.HOME);
    }
    if (authType === LoginStatus.JWT) {
      const isLoggedIn = await api.jwt.loginStatus();
      isLoggedIn && navigate(ROUTE.HOME);
    }
  };

  return (
    <div className="page-box">
      <Header />
      <div className={styles.heroContent}>
        <div className={styles.messageBox}>
          <h1>{textContent.hero.title}</h1>
          <p>{textContent.hero.paragraph}</p>
        </div>
        <div className={styles.buttonGroup}>
          <button className="btn btn-secondary" onClick={togglePopup}>
            {textContent.hero.tryButton}
          </button>
          {isOpened && (
            <PopupLoginForm
              togglePopup={togglePopup}
              title={textContent.loader.title}
              paragraph={textContent.loader.paragraph}
            />
          )}
        </div>
      </div>
      <Footer />
    </div>
  );
};

export default Hero;
