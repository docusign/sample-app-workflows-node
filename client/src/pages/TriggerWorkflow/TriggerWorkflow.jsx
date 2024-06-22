import { useEffect } from 'react';
import { useLocation } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import styles from './TriggerWorkflow.module.css';
import Header from '../../components/Header/Header.jsx';
import Footer from '../../components/Footer/Footer.jsx';
import withAuth from '../../hocs/withAuth/withAuth.jsx';
import WorkflowList from '../../components/WorkflowList/WorkflowList.jsx';
import WorkflowDescription from '../../components/WorkflowDescription/WorkflowDescription.jsx';
import TriggerBehindTheScenes from '../../components/WorkflowDescription/BehindTheScenes/TriggerBehindTheScenes.jsx';
import { ROUTE, TemplateType, WorkflowItemsInteractionType, WorkflowStatus } from '../../constants.js';
import { api } from '../../api';

const TriggerWorkflow = () => {
  const dispatch = useDispatch();
  const location = useLocation();
  const workflowDefinitions = useSelector(state => state.workflows.workflowDefinitions);

  useEffect(() => {
    const getWorkflowDefinitions = async () => {
      const definitionsResponse = await api.workflows.getWorkflowDefinitions();

      const definitions = definitionsResponse.data.value.map(definition => {
        const templateKeys = Object.keys(TemplateType);
        const foundKey = templateKeys.find(key => definition.name.startsWith(TemplateType[key]));

        return {
          id: definition.id,
          name: `WF ${TemplateType[foundKey] || 'ExampleName'}`,
          type: TemplateType[foundKey] || 'ExampleType',
          definitionId: definition.id,
        };
      });

      const definitionsWithState = await Promise.all(
        definitions.map(async definition => {
          const { data } = await api.workflows.getWorkflowInstances(definition.id);
          const relevantInstanceState = data.length > 0 ? data[data.length - 1].instanceState : WorkflowStatus.NotRun;

          return {
            ...definition,
            instanceState: relevantInstanceState,
          };
        })
      );

      // Set workflow definitions with their statuses downloaded from docusign server
      dispatch({ type: 'UPDATE_WORKFLOW_DEFINITIONS', payload: { workflowDefinitions: definitionsWithState } });
    };

    getWorkflowDefinitions();
  }, [dispatch, location.pathname]);

  return (
    <div className="page-box">
      <Header />
      <div className={styles.contentContainer}>
        <WorkflowDescription
          title="Trigger a workflow"
          behindTheScenesComponent={<TriggerBehindTheScenes />}
          backRoute={ROUTE.HOME}
        />
        <WorkflowList items={workflowDefinitions} interactionType={WorkflowItemsInteractionType.TRIGGER} />
      </div>
      <Footer withContent={false} />
    </div>
  );
};

const TriggerWorkflowAuthenticated = withAuth(TriggerWorkflow);
export default TriggerWorkflowAuthenticated;
