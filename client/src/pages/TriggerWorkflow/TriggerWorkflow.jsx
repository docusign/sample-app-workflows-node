import { useEffect } from 'react';
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
  const workflowDefinitions = useSelector(state => state.workflows.workflowDefinitions);

  useEffect(() => {
    const getWorkflowDefinitions = async () => {
      const definitionsresponse = await api.workflows.getWorkflowDefinitions();

      let definitions = definitionsresponse.data.value.map(definition => {
        const templateKeys = Object.keys(TemplateType);
        const foundKey = templateKeys.find(key => definition.name.startsWith(TemplateType[key]));

        return {
          id: definition.id,
          name: `WF ${TemplateType[foundKey] ?? 'ExampleName'}`,
          type: TemplateType[foundKey] || 'ExampleType',
        };
      });

      definitions = await Promise.all(definitions.map(async definition => {
        const instancesResponse = await api.workflows.getWorkflowInstances(definition.id);
        let definitionInstances = instancesResponse.data;
        return {
          ...definition,
          instanceState: definitionInstances ? definitionInstances[definitionInstances.length - 1].instanceState : WorkflowStatus.NotRun,
        };
      }));

      dispatch({ type: 'UPDATE_WORKFLOW', payload: { workflowDefinitions: definitions } });
    };

    getWorkflowDefinitions();
  }, [dispatch]);

  return (<div className="page-box">
    <Header />
    <div className={styles.contentContainer}>
      <WorkflowDescription title="Trigger a workflow" behindTheScenesComponent={<TriggerBehindTheScenes />}
                           backRoute={ROUTE.HOME} />
      <WorkflowList items={workflowDefinitions} interactionType={WorkflowItemsInteractionType.TRIGGER} />
    </div>
    <Footer withContent={false} />
  </div>);
};

const TriggerWorkflowAuthenticated = withAuth(TriggerWorkflow);
export default TriggerWorkflowAuthenticated;
