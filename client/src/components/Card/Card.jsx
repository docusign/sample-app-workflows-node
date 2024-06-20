import { Link } from 'react-router-dom';
import styles from './Card.module.css';
import Dropdown from '../Dropdown/Dropdown.jsx';
import { WorkflowOptions } from '../../constants.js';

const Card = props => {
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
            <Dropdown options={WorkflowOptions} />
          </div>
        )}
      </div>
    </div>
  );
};

export default Card;
