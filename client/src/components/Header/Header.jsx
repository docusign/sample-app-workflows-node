import { Link } from 'react-router-dom';
import logo from '../../assets/img/logo.svg';
import source from '../../assets/img/github-source.svg';

import textContent from '../../assets/text.json';
import styles from './Header.module.css';

const Header = () => {

  return (
    <header className={styles.Header} role="banner">
      <nav className={styles.navBar}>
        <Link className={styles.logo} to="/">
          <img src={logo} alt="logo" />
        </Link>
        <a className={styles.navLink} href={textContent.links.github} rel="noopener noreferrer" target="_blank">
          <img src={source} alt={('Github Icon')} />
        </a>
      </nav>
    </header>
  );
};

export default Header;
