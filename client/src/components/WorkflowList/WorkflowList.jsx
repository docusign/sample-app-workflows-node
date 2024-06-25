import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import styles from './WorkflowList.module.css';
import WorkflowStatusPill from '../WorkflowStatusPill/WorkflowStatusPill.jsx';
import dropdownSvg from '../../assets/img/dropdown.svg';
import { ROUTE, WorkflowItemsInteractionType } from '../../constants.js';
import { api } from '../../api';
import textContent from '../../assets/text.json';
import Loader from '../Loader/Loader.jsx';

const WorkflowList = ({ items, interactionType, isLoading }) => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const workflows = useSelector(state => state.workflows.workflows);
  const [isOptionsOpen, setOptionsOpen] = useState(false);
  const [dropdownIdx, setDropdownIdx] = useState(null);

  const handleFocusDropdown = idx => {
    setTimeout(() => {
      setDropdownIdx(idx);
      setOptionsOpen(true);
    }, 120);
  };

  const handleBlurDropdown = () => {
    setTimeout(() => {
      setDropdownIdx(null);
      setOptionsOpen(false);
    }, 100);
  };

  const handleUpdateWorkflowStatus = async workflow => {
    const { data: workflowInstance } = await api.workflows.getWorkflowInstance(workflow);
    if (workflowInstance.instanceState === workflow.instanceState) return;

    const updatedWorkflows = workflows.map(workflowDefinition => {
      if (workflowDefinition.id === workflow.id) {
        return { ...workflowDefinition, instanceState: workflowInstance.instanceState };
      }
      return { ...workflowDefinition };
    });

    dispatch({ type: 'UPDATE_WORKFLOWS', payload: { workflows: updatedWorkflows } });
    setOptionsOpen(false);
  };

  const handleCancelWorkflow = async workflow => {
    const { status } = await api.workflows.cancelWorkflowInstance(workflow);
    if (status !== 200) return;

    dispatch({ type: 'CANCEL_WORKFLOW', payload: { workflowId: workflow.id } });
    setOptionsOpen(false);
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
          <h1>{textContent.workflowList.doNotHaveWorkflow}</h1>
          <Link to={ROUTE.HOME}>
            <button className={styles.defaultButton} type="button">
              {interactionType === WorkflowItemsInteractionType.TRIGGER
                ? textContent.buttons.createWorkflow
                : textContent.buttons.triggerNewWorkflow}
            </button>
          </Link>
        </div>
      </div>
    );

  return (
    <div className={`list-group ${styles.listGroup}`}>
      <div className={styles.listContainer}>
        {interactionType === WorkflowItemsInteractionType.TRIGGER && (
          <div className={styles.headerRow}>
            <div>
              <p>{textContent.workflowList.columns.lastRunStatus}</p>
              <p>{textContent.workflowList.columns.workflowName}</p>
            </div>
            <div className={styles.typeHeader}>
              <p>{textContent.workflowList.columns.workflowType}</p>
            </div>
          </div>
        )}

        {interactionType === WorkflowItemsInteractionType.MANAGE && (
          <div className={styles.headerAction}>
            <button type="button" onClick={() => navigate(ROUTE.TRIGGER)}>
              {textContent.buttons.triggerNewWorkflow}
            </button>
          </div>
        )}

        <div className={styles.list} style={items.length >= 2 ? listStyles : {}}>
          {items.map((item, idx) => (
            <div key={`${item.name}${idx}`} className="list-group-item list-group-item-action">
              <div style={{ display: 'flex', flexDirection: 'row', gap: '16px' }}>
                <WorkflowStatusPill status={item.instanceState} />
                <h4>{WorkflowItemsInteractionType.TRIGGER ? item.name : item.instanceName}</h4>
              </div>
              <p>{item.type}</p>

              {interactionType === WorkflowItemsInteractionType.TRIGGER && (
                <button onClick={() => navigate(`${ROUTE.TRIGGERFORM}/${item.id}`)}>
                  {textContent.buttons.triggerWorkflow}
                </button>
              )}

              {interactionType === WorkflowItemsInteractionType.MANAGE && (
                <div
                  className="dropdown"
                  style={{ position: 'relative !important' }}
                  onFocus={() => handleFocusDropdown(idx)}
                  onBlur={() => handleBlurDropdown(idx)}
                >
                  <button
                    className={styles.dropdownButton}
                    type="button"
                    id="dropdownMenuButton"
                    data-toggle="dropdown"
                    aria-haspopup="true"
                    aria-expanded="false"
                  >
                    <img src={dropdownSvg} alt="More actions" />
                  </button>
                  <div
                    className={`dropdown-menu dropdown-menu-right ${styles.dropdownMenu}`}
                    style={isOptionsOpen && dropdownIdx === idx ? { display: 'block' } : {}}
                  >
                    <a
                      className={`dropdown-item ${styles.dropdownItem}`}
                      onClick={() => handleUpdateWorkflowStatus(item)}
                    >
                      {textContent.buttons.updateWorkflow}
                    </a>
                    <a className={`dropdown-item ${styles.dropdownItem}`} onClick={() => handleCancelWorkflow(item)}>
                      {textContent.buttons.cancelWorkflow}
                    </a>
                  </div>
                </div>
              )}
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default WorkflowList;
