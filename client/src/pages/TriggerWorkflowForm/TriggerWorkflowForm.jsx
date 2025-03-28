import { useParams, useLocation } from 'react-router-dom';
import styles from './TriggerWorkflowForm.module.css';
import Header from '../../components/Header/Header.jsx';
import Footer from '../../components/Footer/Footer.jsx';
import textContent from '../../assets/text.json';
import withAuth from '../../hocs/withAuth/withAuth.jsx';
import WorkflowDescription from '../../components/WorkflowDescription/WorkflowDescription.jsx';
import TriggerBehindTheScenes from '../../components/WorkflowDescription/BehindTheScenes/TriggerBehindTheScenes.jsx';
import TriggerForm from '../../components/TriggerForm/TriggerForm.jsx';
import { ROUTE } from '../../constants.js';

const TriggerWorkflowForm = () => {
  const { workflowId } = useParams();

  const location = useLocation();
  const searchParams = new URLSearchParams(location.search);
  const type = searchParams.get('type');

  return (
    <div className="page-box">
      <Header />
      <div className={styles.contentContainer}>
        <WorkflowDescription
          title={textContent.pageTitles.triggerWorkflow}
          behindTheScenesComponent={<TriggerBehindTheScenes />}
          backRoute={ROUTE.TRIGGER}
        />
        <TriggerForm workflowId={workflowId} templateType={type} />
      </div>
      <Footer withContent={false} />
    </div>
  );
};

const TriggerWorkflowFormAuthenticated = withAuth(TriggerWorkflowForm);
export default TriggerWorkflowFormAuthenticated;
