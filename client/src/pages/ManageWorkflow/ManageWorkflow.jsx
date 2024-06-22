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
  const workflowDefinitions = useSelector(state => state.workflows.workflowDefinitions);
  const triggeredWorkflowDefinitions = workflowDefinitions.filter(d => d.isTriggered);

  useEffect(() => {
    const updateWorkflowStatuses = async () => {
      const definitionsWithUpdatedState = await Promise.all(
        workflowDefinitions.map(async definition => {
          const { data } = await api.workflows.getWorkflowInstances(definition.definitionId);
          const relevantInstanceState = data.length > 0 ? data[data.length - 1].instanceState : WorkflowStatus.NotRun;

          return {
            ...definition,
            instanceState: relevantInstanceState,
          };
        })
      );

      // Update workflow statuses
      dispatch({ type: 'UPDATE_WORKFLOW_DEFINITIONS', payload: { workflowDefinitions: definitionsWithUpdatedState } });
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
