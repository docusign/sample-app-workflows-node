import Loader from '../../components/Loader/Loader.jsx';
import styles from './withPopup.module.css';
import { useDispatch, useSelector } from 'react-redux';

const withPopup = WrappedComponent => {
  const PopupHOC = props => {
    const isLoading = useSelector(state => state.popup.isLoading);
    const dispatch = useDispatch();

    const setLoading = (isLoading) => {
      dispatch({ type: isLoading ? 'LOADING' : 'LOADED' });
    };

    return (
      <div className={styles.popup}>
        <div className={styles.inner}>
          <button className={styles.close} onClick={props.togglePopup} type="button" aria-label="Close">
            <span className={styles.closeLabel} aria-hidden="true">
              &times;
            </span>
          </button>
          {isLoading ? (
            <Loader visible={isLoading} title={props.title} paragraph={props.paragraph} />
          ) : (
            <WrappedComponent {...props} setLoading={setLoading} />
          )}
        </div>
      </div>
    );
  };

  return PopupHOC;
};

export default withPopup;
