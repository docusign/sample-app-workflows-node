import { useNavigate } from 'react-router-dom';
import styles from './WorkflowList.module.css';
import Loader from '../Loader/Loader.jsx';
import { ROUTE, WorkflowItemsInteractionType, WorkflowStatus } from '../../constants.js';
import textContent from '../../assets/text.json';
import { useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import WorkflowStatusPill from '../WorkflowStatusPill/WorkflowStatusPill.jsx';
import dropdownSvg from '../../assets/img/dropdown.svg';
import { api } from '../../api';
import { updateWorkflowDefinitions } from '../../store/actions';
import StatusLoader from '../StatusLoader/StatusLoader.jsx';

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

  const handlePauseWorkflow = async workflow => {
    setLoadingWorkflow({ id: workflow.id, isLoading: true });
    const { data: workflowInstance } = await api.workflows.pauseWorkflow(workflow);
    if (workflowInstance.status !== workflow.instanceState) {
      const updatedWorkflows = workflows.map(w => {
        if (w.id !== workflow.id) return { ...w };
        return { ...w, instanceState: workflowInstance.status };
      });
      dispatch(updateWorkflowDefinitions(updatedWorkflows));
    }

    setLoadingWorkflow({ id: '', isLoading: false });
    setDropdownOptions({ id: '', isOpen: false });
  };

  const handleResumeWorkflow = async workflow => {
    setLoadingWorkflow({ id: workflow.id, isLoading: true });
    const { data: workflowInstance } = await api.workflows.resumeWorkflow(workflow);

    if (workflowInstance.status !== workflow.instanceState) {
      const updatedWorkflows = workflows.map(w => {
        if (w.id !== workflow.id) return { ...w };
        return { ...w, instanceState: workflowInstance.status };
      });
      dispatch(updateWorkflowDefinitions(updatedWorkflows));
    }

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
          <p>Please <a href=''>manually create a workflow</a> in your account before using the sample app.</p>
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
          </div>
        )}

        {interactionType === WorkflowItemsInteractionType.MANAGE && (
          <div className={`${styles.headerRow}`}>
            <p>{textContent.workflowList.columns.workflowName}</p>
            <p className={styles.statusHeader}>{textContent.workflowList.columns.workflowStatus}</p>
          </div>
        )}

        <div className={`${styles.list} ${interactionType === WorkflowItemsInteractionType.TRIGGER
          ? styles.list2
          : interactionType === WorkflowItemsInteractionType.MANAGE
            ? styles.list3
            : ''
          }`} style={items.length >= 2 ? listStyles : {}}>
          {items.map((item, idx) => (
            <div key={`${item.name}${idx}`} className={`list-group-item list-group-item-action ${styles.listRow}`}>
              <div className={styles.cell1}>
                <h4>{WorkflowItemsInteractionType.TRIGGER ? item.name : item.instanceName}</h4>
              </div>

              {interactionType === WorkflowItemsInteractionType.MANAGE && (
                <div className={styles.cell2}>
                  {loadingWorkflow.isLoading && loadingWorkflow.id === item.id ? (
                    <StatusLoader />
                  ) : (
                    <WorkflowStatusPill status={item.instanceState} />
                  )}
                </div>
              )}

              {interactionType === WorkflowItemsInteractionType.TRIGGER && (
                <button className={styles.cell3} onClick={() => navigate(`${ROUTE.TRIGGERFORM}/${item.id}?type=${item.type}`)}>
                  {textContent.buttons.triggerWorkflow}
                </button>
              )}

              {interactionType === WorkflowItemsInteractionType.MANAGE && (
                <div
                  className="dropdown"
                  style={{ position: 'relative !important', marginRight: '15px' }}
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
                    style={dropdownOptions.isOpen && dropdownOptions.id === idx ? { display: 'block' } : {}}
                  >
                    <a
                      className={`dropdown-item ${styles.dropdownItem} ${item.instanceState === WorkflowStatus.active
                        ? ''
                        : styles.dropdownItemDisabled
                        }`}
                      onClick={() => handlePauseWorkflow(item)}
                    >
                      {textContent.buttons.pauseWorkflow}
                    </a>
                    <a className={`dropdown-item ${styles.dropdownItem} ${item.instanceState === WorkflowStatus.paused
                      ? ''
                      : styles.dropdownItemDisabled
                      }`} onClick={() => handleResumeWorkflow(item)}>
                      {textContent.buttons.resumeWorkflow}
                    </a>
                  </div>
                </div>
              )}
            </div>
          ))}
        </div>
      </div>
    </div >
  );
};

export default WorkflowList;
