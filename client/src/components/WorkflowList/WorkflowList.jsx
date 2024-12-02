import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import styles from './WorkflowList.module.css';
import WorkflowStatusPill from './WorkflowStatusPill/WorkflowStatusPill.jsx';
import Loader from '../Loader/Loader.jsx';
import dropdownSvg from '../../assets/img/dropdown.svg';
import { ROUTE, WorkflowItemsInteractionType, WorkflowStatus } from '../../constants.js';
import textContent from '../../assets/text.json';
import { api } from '../../api';
import { cancelTriggeredWorkflow, updateWorkflowDefinitions } from '../../store/actions';
import StatusLoader from './StatusLoader/StatusLoader.jsx';

const WorkflowList = ({ items, interactionType, isLoading }) => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const workflows = useSelector(state => state.workflows.workflows);
  const [loadingWorkflow, setLoadingWorkflow] = useState({ id: '', isLoading: false });
  const [dropdownOptions, setDropdownOptions] = useState({ id: '', isOpen: false });

  const handleFocusDropdown = idx => {
    setTimeout(() => {
      setDropdownOptions({ id: idx, isOpen: true });
    }, 120);
  };

  const handleBlurDropdown = () => {
    setTimeout(() => {
      setDropdownOptions({ id: '', isOpen: false });
    }, 100);
  };

  const handleUpdateWorkflowStatus = async workflow => {
    setLoadingWorkflow({ id: workflow.id, isLoading: true });
    const { data: workflowInstance } = await api.workflows.getWorkflowInstance(workflow);

    if (workflowInstance.instanceState !== workflow.instanceState) {
      const updatedWorkflows = workflows.map(w => {
        if (w.id !== workflow.id) return { ...w };
        return { ...w, instanceState: workflowInstance.instanceState };
      });
      dispatch(updateWorkflowDefinitions(updatedWorkflows));
    }

    setLoadingWorkflow({ id: '', isLoading: false });
    setDropdownOptions({ id: '', isOpen: false });
  };

  const handleCancelWorkflow = async workflow => {
    setLoadingWorkflow({ id: workflow.id, isLoading: true });
    const { status } = await api.workflows.cancelWorkflowInstance(workflow);
    if (status !== 200) {
      setLoadingWorkflow({ id: '', isLoading: false });
      return;
    }

    const updatedWorkflows = await Promise.all(
      workflows.map(async w => {
        if (w.id !== workflow.id) return { ...w };

        const { data } = await api.workflows.getWorkflowInstances(workflow.id);
        const relevantInstanceState = data.length > 0 ? data[data.length - 1].instanceState : WorkflowStatus.NotRun;
        return {
          ...workflow,
          instanceState: relevantInstanceState,
        };
      })
    );

    // // Update workflow statuses
    dispatch(updateWorkflowDefinitions(updatedWorkflows));
    dispatch(cancelTriggeredWorkflow(workflow.id));

    setLoadingWorkflow({ id: '', isLoading: false });
    setDropdownOptions({ id: '', isOpen: false });
  };

  const listStyles = {
    overflow: 'scroll',
    overflowX: 'hidden',
  };

  if (isLoading)
    return (
      <div className={styles.loaderContainer}>
        <Loader visible={isLoading} />
      </div>
    );

  if (!items?.length)
    return (
      <div className={`list-group ${styles.listGroup}`}>
        <div className={styles.emptyListContainer}>
          <h2>{textContent.workflowList.doNotHaveWorkflow}</h2>
          <h4 className={styles.resetStyle} dangerouslySetInnerHTML={{ __html: textContent.workflowList.pleaseCreateWorkflow }}></h4>
        </div>
      </div>
    );

  return (
    <div className={`list-group ${styles.listGroup}`}>
      <div className={styles.listContainer}>
        {interactionType === WorkflowItemsInteractionType.TRIGGER && (
          <div className={styles.headerRow}>
            <div>
              <p>{textContent.workflowList.columns.workflowName}</p>
            </div>
            <div className={styles.typeHeader}>
              <p>{textContent.workflowList.columns.workflowType}</p>
            </div>
          </div>
        )}

        <div className={styles.list} style={items.length >= 2 ? listStyles : {}}>
          {items.map((item, idx) => (
            <div key={`${item.name}${idx}`} className={`list-group-item list-group-item-action ${styles.listRow}`}>
              <div className={styles.cell1}>
                <h4>{WorkflowItemsInteractionType.TRIGGER ? item.name : item.instanceName}</h4>
              </div>

              <p>{item.type}</p>

              {interactionType === WorkflowItemsInteractionType.TRIGGER && (
                <button className={styles.cell3} onClick={() => navigate(`${ROUTE.TRIGGERFORM}/${item.id}?type=${item.type}`)}>
                  {textContent.buttons.triggerWorkflow}
                </button>
              )}
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default WorkflowList;
