import { useEffect, useState } from 'react';
import { useLocation } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import styles from './TriggerWorkflow.module.css';
import Header from '../../components/Header/Header.jsx';
import Footer from '../../components/Footer/Footer.jsx';
import textContent from '../../assets/text.json';
import withAuth from '../../hocs/withAuth/withAuth.jsx';
import WorkflowList from '../../components/WorkflowList/WorkflowList.jsx';
import WorkflowDescription from '../../components/WorkflowDescription/WorkflowDescription.jsx';
import TriggerBehindTheScenes from '../../components/WorkflowDescription/BehindTheScenes/TriggerBehindTheScenes.jsx';
import { ROUTE, TemplateType, WorkflowItemsInteractionType, WorkflowStatus } from '../../constants.js';
import { api } from '../../api';
import { updateWorkflowDefinitions } from '../../store/actions';

const TriggerWorkflow = () => {
  const dispatch = useDispatch();
  const location = useLocation();
  const [isWorkflowListLoading, setWorkflowListLoading] = useState(false);
  const workflows = useSelector(state => state.workflows.workflows);

  useEffect(() => {
    const getWorkflowDefinitions = async () => {
      setWorkflowListLoading(true);
      const definitionsResponse = await api.workflows.getWorkflowDefinitions();

      const workflowDefinitions = definitionsResponse.data.value
        .map(definition => {
          if (workflows.length) {
            const foundWorkflow = workflows.find(workflow => workflow.id === definition.id);
            if (foundWorkflow) return foundWorkflow;
          }

          const templateKeys = Object.keys(TemplateType);
          const foundKey = templateKeys.find(key => definition.name.startsWith(TemplateType[key].name));
          if (!foundKey) return null;

          return {
            id: definition.id,
            name: `WF ${TemplateType[foundKey]?.name || 'ExampleName'}`,
            type: TemplateType[foundKey]?.type || 'ExampleType',
          };
        })
        .filter(w => !!w);

      const workflowsWithState = await Promise.all(
        workflowDefinitions.map(async definition => {
          const { data } = await api.workflows.getWorkflowInstances(definition.id);
          const relevantInstanceState = data.length > 0 ? data[data.length - 1].instanceState : WorkflowStatus.NotRun;

          return {
            ...definition,
            instanceState: relevantInstanceState,
          };
        })
      );

      // Set workflow definitions with their statuses downloaded from docusign server
      dispatch(updateWorkflowDefinitions(workflowsWithState));
      setWorkflowListLoading(false);
    };

    getWorkflowDefinitions();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [dispatch, location.pathname]);

  return (
    <div className="page-box">
      <Header />
      <div className={styles.contentContainer}>
        <WorkflowDescription
          title={textContent.pageTitles.triggerWorkflow}
          behindTheScenesComponent={<TriggerBehindTheScenes />}
          backRoute={ROUTE.HOME}
        />
        <WorkflowList
          items={workflows}
          interactionType={WorkflowItemsInteractionType.TRIGGER}
          isLoading={isWorkflowListLoading}
        />
      </div>
      <Footer withContent={false} />
    </div>
  );
};

const TriggerWorkflowAuthenticated = withAuth(TriggerWorkflow);
export default TriggerWorkflowAuthenticated;
