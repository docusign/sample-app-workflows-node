import { useEffect } from 'react';
import { useLocation } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import styles from './ManageWorkflow.module.css';
import Header from '../../components/Header/Header.jsx';
import Footer from '../../components/Footer/Footer.jsx';
import withAuth from '../../hocs/withAuth/withAuth.jsx';
import WorkflowList from '../../components/WorkflowList/WorkflowList.jsx';
import WorkflowDescription from '../../components/WorkflowDescription/WorkflowDescription.jsx';
import ManageBehindTheScenes from '../../components/WorkflowDescription/BehindTheScenes/ManageBehindTheScenes.jsx';
import { ROUTE, WorkflowItemsInteractionType, WorkflowStatus } from '../../constants.js';
import { api } from '../../api';

const ManageWorkflow = () => {
  const dispatch = useDispatch();
  const location = useLocation();
  const workflows = useSelector(state => state.workflows.workflows);
  const triggeredWorkflowDefinitions = workflows.filter(w => w.isTriggered);

  useEffect(() => {
    const updateWorkflowStatuses = async () => {
      const workflowsWithUpdatedState = await Promise.all(
        workflows.map(async workflow => {
          const { data } = await api.workflows.getWorkflowInstances(workflow.id);
          const relevantInstanceState = data.length > 0 ? data[data.length - 1].instanceState : WorkflowStatus.NotRun;

          return {
            ...workflow,
            instanceState: relevantInstanceState,
          };
        })
      );

      // Update workflow statuses
      dispatch({ type: 'UPDATE_WORKFLOWS', payload: { workflows: workflowsWithUpdatedState } });
    };

    updateWorkflowStatuses();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [dispatch, location.pathname]);

  return (
    <div className="page-box">
      <Header />
      <div className={styles.contentContainer}>
        <WorkflowDescription
          title="Manage workflows"
          behindTheScenesComponent={<ManageBehindTheScenes />}
          backRoute={ROUTE.HOME}
        />
        <WorkflowList items={triggeredWorkflowDefinitions} interactionType={WorkflowItemsInteractionType.MANAGE} />
      </div>
      <Footer withContent={false} />
    </div>
  );
};

const ManageWorkflowAuthenticated = withAuth(ManageWorkflow);
export default ManageWorkflowAuthenticated;
