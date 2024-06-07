import withPopup from '../../../hocs/withPopup/withPopup.jsx';
import imgSuccess from '../../../assets/img/success.svg';
import { Link } from 'react-router-dom';
import styles from './DocumentCreated.module.css';
import { ROUTE } from '../../../constants.js';

const DocumentCreated = ({ message, togglePopup }) => {
  // TODO: Add loading while the document is created by adding parameter setLoading and setting it true/false depending on the document status
  return (
    <div className={styles.popupContainer}>
      <img src={imgSuccess} alt="" />
      <h2>{message}</h2>
      <p>Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore
        magna aliqua. </p>
      <Link to={ROUTE.HOME}>
        <button onClick={togglePopup}>Return to homepage</button>
      </Link>
    </div>
  );
};

const DocumentCreatedPopup = withPopup(DocumentCreated);
export default DocumentCreatedPopup;
