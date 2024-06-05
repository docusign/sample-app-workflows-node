import { useState } from 'react';
import styles from './Card.module.css';
import { Link } from 'react-router-dom';
import Dropdown from '../Dropdown/Dropdown.jsx';
import { WorkflowOptions } from '../../constants.js';

const Card = (props) => {
  const [open, setOpen] = useState(false);

  const handleOpen = () => {
    setOpen(!open);
  };

  return (
    <div className={styles.cardBody}>
      <div className={styles.cardContainer}>
        <img src={props.img} alt="" />
        <h4>{props.title}</h4>
        <h5>{props.description}</h5>
        {!props.dropDown ? (
          <Link to={props.linkTo}>
            <button className="btn btn-secondary" type="button" onClick={handleOpen}>
              Get Started
            </button>
          </Link>
          ) :
          (
            <Dropdown options={WorkflowOptions} />
          )}
      </div>
    </div>
  );
};

export default Card;
