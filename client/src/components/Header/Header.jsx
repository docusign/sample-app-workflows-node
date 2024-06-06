import { Link } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';

import logo from '../../assets/img/logo.svg';
import source from '../../assets/img/github-source.svg';

import styles from './Header.module.css';
import textContent from '../../assets/text.json';

const Header = () => {
  const isAuthenticated = useSelector((state) => state.auth.isAuthenticated);
  const dispatch = useDispatch();

  const handleLogOut = async e => {
    e.preventDefault();
    try {
      dispatch({ type: 'LOGOUT' });
    } catch (error) {
      console.log(error);
    }
  };

  return (
    <header className={styles.Header} role="banner">
      <nav className={styles.navBar}>
        <Link className={styles.logo} to="/">
          <img src={logo} alt="logo" />
        </Link>
        <div className={styles.headerEnd}>
        <a className={styles.navLink} href={textContent.links.github} rel="noopener noreferrer" target="_blank">
          <img src={source} alt={('Github Icon')} />
        </a>
        {isAuthenticated ?
          <div className={`dropdown ${styles.dropDown}`}>
            <button className="btn btn-secondary dropdown-toggle" type="button" id="dropdownMenuButton"
                    data-toggle="dropdown" aria-haspopup="true" aria-expanded="false">
              username_a@gmail.com
            </button>
            <div className={`dropdown-menu ${styles.dropDownMenu}`} aria-labelledby="dropdownMenuButton">
              <h4>Username Curtis</h4>
              <p>Username_a@gmail.com</p>
              <button className="dropdown-item" type="button" onClick={handleLogOut}>Log out</button>
            </div>
          </div>
          :
          null
        }
        </div>
      </nav>
    </header>
  );
};

export default Header;
