import { useState } from 'react';
import Footer from '../../components/Footer/Footer.jsx';
import Header from '../../components/Header/Header.jsx';

import textContent from '../../assets/text.json';
import styles from './Hero.module.css';
import PopupLoginForm from '../../components/LoginForm/LoginForm.jsx';

const Hero = () => {
  const [isPopupOpen, togglePopupState] = useState(false);

  const togglePopup = () => {
    togglePopupState(!isPopupOpen);
  };

  return (
    <div className="page-box">
      <Header />
      <div className={styles.heroContent}>
        <div className={styles.messageBox}>
          <h1> {textContent.hero.title} </h1>
          <p> {textContent.hero.paragraph} </p>
        </div>
        <div className={styles.buttonGroup}>
          <button className="btn btn-secondary" onClick={togglePopup}>{textContent.hero.tryButton}</button>
          {isPopupOpen ? <PopupLoginForm togglePopup={togglePopup} title={textContent.loader.title}
                                         paragraph={textContent.loader.paragraph} /> : null}
        </div>
      </div>
      <Footer />
    </div>
  );
};

export default Hero;
