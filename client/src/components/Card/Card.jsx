import { Link } from 'react-router-dom';
import styles from './Card.module.css';
import textContent from '../../assets/text.json';

const Card = ({ img, title, description, linkTo }) => {
    return (
        <div className={styles.cardBody}>
            <div className={styles.cardContainer}>
                <img src={img} alt="" />
                <h4>{title}</h4>
                <h5>{description}</h5>
                <Link to={linkTo}>
                    <button className="btn btn-secondary" type="button">
                        {textContent.buttons.getStarted}
                    </button>
                </Link>
            </div>
        </div>
    );
};

export default Card;