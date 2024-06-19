import { useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import styles from './TriggerWorkflow.module.css';
import Header from '../../components/Header/Header.jsx';
import Footer from '../../components/Footer/Footer.jsx';
import withAuth from '../../hocs/withAuth/withAuth.jsx';
import WorkflowList from '../../components/WorkflowList/WorkflowList.jsx';
import WorkflowDescription from '../../components/WorkflowDescription/WorkflowDescription.jsx';
import TriggerBehindTheScenes from '../../components/WorkflowDescription/BehindTheScenes/TriggerBehindTheScenes.jsx';
import { TEMPLATE_TYPE, WorkflowItemsInteractionType, WorkflowStatus } from '../../constants.js';
import { api } from '../../api';

const TriggerWorkflow = () => {
  const dispatch = useDispatch();
  const workflowDefinitions = useSelector(state => state.workflows.workflowDefinitions);

  useEffect(() => {
    const getWorkflowDefinitions = async () => {
      const response = await api.workflows.getWorkflowDefinitions();

      const definitions = response.data.value.map(definition => {
        const templateKeys = Object.keys(TEMPLATE_TYPE);
        const foundKey = templateKeys.find(key => definition.name.startsWith(TEMPLATE_TYPE[key]));

        return {
          name: `WF ${TEMPLATE_TYPE[foundKey]}`,
          type: TEMPLATE_TYPE[foundKey] || 'ExampleType',
          status: WorkflowStatus.InProgress,
        };
      });

      dispatch({ type: 'UPDATE_WORKFLOW', payload: { workflowDefinitions: definitions } });
    };

    getWorkflowDefinitions();
  }, [dispatch]);

  return (
    <div className="page-box">
      <Header />
      <div className={styles.contentContainer}>
        <WorkflowDescription title={'Trigger a workflow'} behindTheScenesComponent={<TriggerBehindTheScenes />} />
        <WorkflowList items={workflowDefinitions} interactionType={WorkflowItemsInteractionType.TRIGGER} />
      </div>
      <Footer withContent={false} />
    </div>
  );
};

const TriggerWorkflowAuthenticated = withAuth(TriggerWorkflow);
export default TriggerWorkflowAuthenticated;
