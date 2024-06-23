import { useState } from 'react';
import { Link } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import styles from './Card.module.css';
import Dropdown from '../Dropdown/Dropdown.jsx';
import { WorkflowOptions } from '../../constants.js';
import CreateWorkflowMoreinfoPopup from '../Popups/CreateWorkflowMoreInfo/CreateWorkflowMoreInfo.jsx';

const Card = props => {
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
        <img src={props.img} alt="" />
        <h4>{props.title}</h4>
        <h5>{props.description}</h5>
        {!props.dropDown ? (
          <Link to={props.linkTo}>
            <button className="btn btn-secondary" type="button">
              Get Started
            </button>
          </Link>
        ) : (
          <div>
            <div className={styles.buttonGroup}>
              {props.moreInfo && (
                <button className={styles.moreInfo} onClick={togglePopup}>
                  More Info
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
