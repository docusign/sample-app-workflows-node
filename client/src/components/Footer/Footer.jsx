import styles from './Footer.module.css';
import textContent from '../../assets/text.json';

const Footer = ({ withContent = true }) => (
  <footer className={withContent ? styles.footerWithContent : styles.footer}>
    {withContent && (
      <section className={styles.container}>
        <div>
        </div>
        <div className={styles.buttons}>
          <a href={textContent.links.createsandbox} rel="noopener noreferrer" target="_blank">
            <button className={styles.button} type="button">
              {textContent.hero.footer.createButton}
            </button>
          </a>

          <a href={textContent.links.learnmore} rel="noopener noreferrer" target="_blank">
            <button className={styles.link} type="">
              {textContent.hero.footer.learnButton}
            </button>
          </a>
        </div>
      </section>
    )}
  </footer>
);

export default Footer;
