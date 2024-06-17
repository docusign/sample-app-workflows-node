import { Link } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';

import logo from '../../assets/img/logo.svg';
import source from '../../assets/img/github-source.svg';
import styles from './Header.module.css';
import textContent from '../../assets/text.json';
import { LoginStatus, ROUTE } from '../../constants.js';
import { api } from '../../api';

const Header = () => {
  const dispatch = useDispatch();
  const isAuthenticated = useSelector(state => state.auth.isAuthenticated);
  const userName = useSelector(state => state.auth.userName);
  const userEmail = useSelector(state => state.auth.userEmail);
  const authType = useSelector(state => state.auth.authType);

  const handleLogOut = async e => {
    e.preventDefault();
    if (authType === LoginStatus.ACG) {
      await api.acg.logout();
    }
    if (authType === LoginStatus.JWT) {
      await api.jwt.logout();
    }

    dispatch({ type: 'CLEAR_STATE' });
  };

  return (
    <header className={styles.Header} role="banner">
      <nav className={styles.navBar}>
        <Link className={styles.logo} to={ROUTE.ROOT}>
          <img src={logo} alt="logo" />
        </Link>
        <div className={styles.headerEnd}>
          <a className={styles.navLink} href={textContent.links.github} rel="noopener noreferrer" target="_blank">
            <img src={source} alt={'Github Icon'} />
          </a>
          {isAuthenticated ? (
            <div className={`dropdown ${styles.dropDown}`}>
              <button
                className="btn btn-secondary dropdown-toggle"
                type="button"
                id="dropdownMenuButton"
                data-toggle="dropdown"
                aria-haspopup="true"
                aria-expanded="false"
              >
                {userEmail}
              </button>
              <div className={`dropdown-menu ${styles.dropDownMenu}`} aria-labelledby="dropdownMenuButton">
                <h4>{userName}</h4>
                <p>{userEmail}</p>
                <button className="dropdown-item" type="button" onClick={handleLogOut}>
                  Log out
                </button>
              </div>
            </div>
          ) : null}
        </div>
      </nav>
    </header>
  );
};

export default Header;
