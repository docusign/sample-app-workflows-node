import { useEffect, useState } from 'react';
import styles from './ManageWorkflow.module.css';
import Header from '../../components/Header/Header.jsx';
import Footer from '../../components/Footer/Footer.jsx';
import withAuth from '../../hocs/withAuth/withAuth.jsx';
import WorkflowList from '../../components/WorkflowList/WorkflowList.jsx';
import WorkflowDescription from '../../components/WorkflowDescription/WorkflowDescription.jsx';
import ManageBehindTheScenes from '../../components/WorkflowDescription/BehindTheScenes/ManageBehindTheScenes.jsx';
import { ROUTE, WorkflowItemsInteractionType } from '../../constants.js';
import { api } from '../../api/index.js';
import { useDispatch } from 'react-redux';

const ManageWorkflow = () => {
  const dispatch = useDispatch();
  const [workflowInstances, setWorkflowInstances] = useState([]);

  useEffect(() => {
    const getWorkflowInstances = async () => {
      const response = await api.workflows.getWorkflowInstances();
      if (response.data && response.data.length > 0 && response.data !== workflowInstances) {
        dispatch({ type: 'ADD_WORKFLOW', payload: response.data });
        setWorkflowInstances(response.data);
      }
    };

    getWorkflowInstances().catch(console.error);
  }, []);

  return (
    <div className="page-box">
      <Header />
      <div className={styles.contentContainer}>
        <WorkflowDescription title={'Manage workflows'} behindTheScenesComponent={<ManageBehindTheScenes />}
                             backRoute={ROUTE.HOME} />
        <WorkflowList items={workflowInstances} interactionType={WorkflowItemsInteractionType.MANAGE} />
      </div>
      <Footer withContent={false} />
    </div>
  );
};

const ManageWorkflowAuthenticated = withAuth(ManageWorkflow);
export default ManageWorkflowAuthenticated;
