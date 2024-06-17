import Header from '../../components/Header/Header.jsx';
import Footer from '../../components/Footer/Footer.jsx';
import withAuth from '../../hocs/withAuth/withAuth.jsx';
import styles from './TriggerWorkflow.module.css';
import WorkflowList from '../../components/WorkflowList/WorkflowList.jsx';
import WorkflowDescription from '../../components/WorkflowDescription/WorkflowDescription.jsx';
import { JWTWorkflowTypes, WorkflowItemsInteractionType } from '../../constants.js';
import TriggerBehindTheScenes from '../../components/WorkflowDescription/BehindTheScenes/TriggerBehindTheScenes.jsx';

const TriggerWorkflow = () => {

  return (
    <div className="page-box">
      <Header />
      <div className={styles.contentContainer}>
        <WorkflowDescription title={"Trigger a workflow"} behindTheScenesComponent={<TriggerBehindTheScenes />} />
        <WorkflowList items={JWTWorkflowTypes} interactionType={WorkflowItemsInteractionType.TRIGGER} />
      </div>
      <Footer withContent={false} />
    </div>
  );
};

const TriggerWorkflowAuthenticated = withAuth(TriggerWorkflow);
export default TriggerWorkflowAuthenticated;
