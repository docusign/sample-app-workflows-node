import { useState } from "react";
import Footer from "../../components/Footer/Footer.jsx";
import Header from "../../components/Header/Header.jsx";
import LoginForm from "../../components/LoginForm/LoginForm.jsx";

import textContent from "../../assets/text.json";
import styles from "./Hero.module.css";

const Hero = () => {
    const [isPopupOpen, togglePopupState] = useState(false);

    const togglePopup = () => {
        togglePopupState(!isPopupOpen);
    };
    
    return (
        <div className={styles.Home}>
            <Header/>
            <div className={styles.HeroContent}>
                <div className={styles.MessageBox}>
                    <h1> {textContent.hero.title} </h1>
                    <p> {textContent.hero.paragraph} </p>
                </div>
                <div className={styles.ButtonGroup}>
                    <button onClick={togglePopup}>{textContent.hero.tryButton}</button>
                    {isPopupOpen ? <LoginForm togglePopup={togglePopup} /> : null}
                </div>
            </div>
            <Footer/>
        </div>
    );
}

export default Hero;
