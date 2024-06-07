import Header from '../../components/Header/Header.jsx';
import Footer from '../../components/Footer/Footer.jsx';
import withAuth from '../../hocs/withAuth/withAuth.jsx';
import styles from './ManageWorkflow.module.css';
import WorkflowList from '../../components/WorkflowList/WorkflowList.jsx';
import WorkflowDescription from '../../components/WorkflowDescription/WorkflowDescription.jsx';
import ManageBehindTheScenes from '../../components/WorkflowDescription/BehindTheScenes/ManageBehindTheScenes.jsx';
import { WokrflowItemsInteractionType } from '../../constants.js';
import { useSelector } from 'react-redux';

const ManageWorkflow = () => {
  const workflows = useSelector((state) => state.workflows.workflows);

  return (
    <div className="page-box">
      <Header />
      <div className={styles.contentContainer}>
        <WorkflowDescription title={"Manage workflows"} behindTheScenesComponent={<ManageBehindTheScenes />} />
        <WorkflowList items={workflows} interactionType={WokrflowItemsInteractionType.MANAGE} />
      </div>
      <Footer withContent={false} />
    </div>
  );
};

const ManageWorkflowAuthenticated = withAuth(ManageWorkflow);
export default ManageWorkflowAuthenticated;
