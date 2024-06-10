import Header from '../../components/Header/Header.jsx';
import Footer from '../../components/Footer/Footer.jsx';
import styles from './Home.module.css';
import textContent from '../../assets/text.json';
import Card from '../../components/Card/Card.jsx';
import img1 from '../../assets/img/workflow-create.svg';
import img2 from '../../assets/img/workflow-trigger.svg';
import img3 from '../../assets/img/workflow-manage.svg';
import withAuth from '../../hocs/withAuth/withAuth.jsx';
import { ROUTE } from '../../constants.js';

const Home = () => {
  return (
    <div className="page-box">
      <Header />
      <div className={styles.messageBox}>
        <h1> {textContent.hero.title} </h1>
        <p> {textContent.hero.paragraph} </p>
      </div>
      <div className={styles.cardContainer}>
        <Card
          img={img1}
          dropDown={true}
          title={"Create a workflow"}
          description={"Lorem Ipsum has been the industry's standard dummy text ever since the 1500s"} />
        <Card
          img={img2}
          dropDown={false}
          linkTo={ROUTE.TRIGGER}
          title={"Trigger a workflow"}
          description={"Contrary to popular belief, Lorem Ipsum is not simply random text. It has roots in a piece"}/>
        <Card
          img={img3}
          dropDown={false}
          linkTo={ROUTE.MANAGE}
          title={"Manage a workflow"}
          description={"There are many variations of Lorem Ipsum"}/>
      </div>
      <Footer />
    </div>
  );
};

const HomeAuthenticated = withAuth(Home);
export default HomeAuthenticated;
