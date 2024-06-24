import { useState } from 'react';
import { Link } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import styles from './Card.module.css';
import Dropdown from '../Dropdown/Dropdown.jsx';
import { WorkflowOptions } from '../../constants.js';
import CreateWorkflowMoreinfoPopup from '../Popups/CreateWorkflowMoreInfo/CreateWorkflowMoreInfo.jsx';
import textContent from '../../assets/text.json';

const Card = ({ img, title, description, linkTo, dropDown, moreInfo }) => {
  const [isBtsOpened, setBtsOpened] = useState(false);
  const dispatch = useDispatch();
  const isOpened = useSelector(state => state.popup.isOpened);

  const togglePopup = async () => {
    setBtsOpened(!isBtsOpened);
    dispatch({ type: isOpened ? 'CLOSE_POPUP' : 'OPEN_POPUP' });
  };

  return (
    <div className={styles.cardBody}>
      <div className={styles.cardContainer}>
        <img src={img} alt="" />
        <h4>{title}</h4>
        <h5>{description}</h5>
        {!dropDown ? (
          <Link to={linkTo}>
            <button className="btn btn-secondary" type="button">
              {textContent.buttons.getStarted}
            </button>
          </Link>
        ) : (
          <div>
            <div className={styles.buttonGroup}>
              {moreInfo && (
                <button className={styles.moreInfo} onClick={togglePopup}>
                  {textContent.buttons.moreInfo}
                </button>
              )}
              <Dropdown options={WorkflowOptions} />
            </div>
            {isBtsOpened && <CreateWorkflowMoreinfoPopup togglePopup={togglePopup} />}
          </div>
        )}
      </div>
    </div>
  );
};

export default Card;
