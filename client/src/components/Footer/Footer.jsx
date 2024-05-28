import textContent from '../../assets/text.json';
import styles from './Footer.module.css';

const Footer = () => (
  <footer className={styles.Footer}>
    <section className={styles.Container}>
      <div>
        <h2 className={styles.Header}>{textContent.hero.footer.title}</h2>
        <div className={styles.Text}>{textContent.hero.footer.paragraph}</div>
      </div>
      <div className={styles.Buttons}>
        <a href={textContent.links.createsandbox} rel="noopener noreferrer" target="_blank">
          <button className={styles.Button} type="button">
            {textContent.hero.footer.createButton}
          </button>
        </a>

        <a href={textContent.links.learnmore} rel="noopener noreferrer" target="_blank">
          <button className={styles.Link} type="">
            {textContent.hero.footer.learnButton}
          </button>
        </a>
      </div>
    </section>
    <span className={styles.Copyright}>{textContent.hero.footer.copyright}</span>
  </footer>
);

export default Footer;
