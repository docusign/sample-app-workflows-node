import textContent from '../../assets/text.json';
import styles from './Footer.module.css';

const Footer = ({withContent = true}) => (
  <footer className={withContent ? styles.footerWithContent : styles.footer}>
    {withContent ?
    <section className={styles.container}>
      <div>
        <h2 className={styles.header}>{textContent.hero.footer.title}</h2>
        <div className={styles.text}>{textContent.hero.footer.paragraph}</div>
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
      :
      null
    }
    <span className={styles.copyright}>{textContent.hero.footer.copyright}</span>
  </footer>
);

export default Footer;
