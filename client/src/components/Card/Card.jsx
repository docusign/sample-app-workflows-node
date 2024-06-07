import { useState } from 'react';
import styles from './Card.module.css';
import { Link } from 'react-router-dom';
import Dropdown from '../Dropdown/Dropdown.jsx';
import { LoginStatus, WorkflowOptions } from '../../constants.js';
import { useSelector } from 'react-redux';
import WrappedAcgPrompt from '../Popups/AcgPrompt/AcgPrompt.jsx';

const Card = (props) => {
  const authType = useSelector((state) => state.auth.authType);
  const [isPopupOpen, togglePopupState] = useState(false);

  const togglePopup = (e) => {
    e.preventDefault();
    togglePopupState(!isPopupOpen);
  };

  return (
    <div className={styles.cardBody}>
      <div className={styles.cardContainer}>
        <img src={props.img} alt="" />
        <h4>{props.title}</h4>
        <h5>{props.description}</h5>
        {!props.dropDown ? (
          <Link to={props.linkTo}>
            <button className="btn btn-secondary" type="button">
              Get Started
            </button>
          </Link>
          ) :
          (
            <div>
            { authType !== LoginStatus.ACG
              ?
              <div>
              <button className="btn btn-secondary" type="button" onClick={togglePopup}>
                Get Started
              </button>
              {isPopupOpen ? <WrappedAcgPrompt togglePopup={togglePopup} /> : null}
              </div>
              :
              <Dropdown options={WorkflowOptions} />
            }
            </div>
          )}
      </div>
    </div>
  );
};

export default Card;
