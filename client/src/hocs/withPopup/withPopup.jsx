import { useSelector } from 'react-redux';
import styles from './withPopup.module.css';
import Loader from '../../components/Loader/Loader.jsx';

const withPopup = WrappedComponent => {
  const PopupHOC = props => {
    const isPopupLoading = useSelector(state => state.popup.isLoading);

    return (
      <div className={styles.popup}>
        <div className={styles.inner}>
          {!isPopupLoading && (
            <button className={styles.close} onClick={props.togglePopup} type="button" aria-label="Close">
              <span className={styles.closeLabel} aria-hidden="true">
                &times;
              </span>
            </button>
          )}

          {isPopupLoading ? (
            <Loader visible={isPopupLoading} title={props.title} paragraph={props.paragraph} />
          ) : (
            <WrappedComponent {...props} />
          )}
        </div>
      </div>
    );
  };

  return PopupHOC;
};

export default withPopup;
