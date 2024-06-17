import Header from '../../components/Header/Header.jsx';
import Footer from '../../components/Footer/Footer.jsx';
import withAuth from '../../hocs/withAuth/withAuth.jsx';
import styles from './ManageWorkflow.module.css';
import WorkflowList from '../../components/WorkflowList/WorkflowList.jsx';
import WorkflowDescription from '../../components/WorkflowDescription/WorkflowDescription.jsx';
import ManageBehindTheScenes from '../../components/WorkflowDescription/BehindTheScenes/ManageBehindTheScenes.jsx';
import { WorkflowItemsInteractionType } from '../../constants.js';
import { api } from '../../api/index.js';
import { useEffect, useState } from 'react';

const ManageWorkflow = () => {
  const [workflowInstances, setWorkflowInstances] = useState([]);
  const getWorkflowInstances = () => {
    setWorkflowInstances(api.workflows.getWorkflowInstances().data);
  };

  useEffect(() => {
    getWorkflowInstances();
  }, []);

  return (
    <div className="page-box">
      <Header />
      <div className={styles.contentContainer}>
        <WorkflowDescription title={"Manage workflows"} behindTheScenesComponent={<ManageBehindTheScenes />} />
        <WorkflowList items={workflowInstances} interactionType={WorkflowItemsInteractionType.MANAGE} />
      </div>
      <Footer withContent={false} />
    </div>
  );
};

const ManageWorkflowAuthenticated = withAuth(ManageWorkflow);
export default ManageWorkflowAuthenticated;
