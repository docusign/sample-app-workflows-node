import styles from "./Loader.module.css";
import textContent from "../../assets/text.json";

// eslint-disable-next-line react/prop-types
function Loader({ visible }) {
    return (
        visible && (
            <div className={styles.wrapper}>
                <span className={styles.loader}></span>
                <div>
                    <h2 className={styles.Header}>{textContent.loader.title}</h2>
                    <div className={styles.Text}>{textContent.loader.paragraph}</div>
                </div>
            </div>
        )
    );
}

export default Loader;