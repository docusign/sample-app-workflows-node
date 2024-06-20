import { Link, useNavigate } from 'react-router-dom';
import { useDispatch } from 'react-redux';
import styles from './WorkflowList.module.css';
import WorkflowStatusPill from '../WorkflowStatusPill/WorkflowStatusPill.jsx';
import dropdown from '../../assets/img/dropdown.svg';
import { ROUTE, WorkflowItemsInteractionType } from '../../constants.js';
import { api } from '../../api';

const WorkflowList = ({ items, interactionType }) => {
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const handleGetWorkflow = async item => {
    const updatedItem = await api.workflows.getWorkflowInstance(item);
    dispatch({ type: 'UPDATE_WORKFLOW', updatedItem });
  };

  const handleCancelWorkflow = async item => {
    await api.workflows.cancelWorkflowInstance(item);
    dispatch({ type: 'CANCEL_WORKFLOW', item });
  };

  if (!items?.length)
    return (
      <div className={styles.emptyListContainer}>
        <h1>{'You don\'t have any workflows'}</h1>
        <Link to={ROUTE.HOME}>
          <button className={styles.defaultButton} type="button">
            Create a new workflow
          </button>
        </Link>
      </div>
    );

  return (
    <div className={`list-group ${styles.listGroup}`}>
      {items && items.length > 0 ?
        <div>
          {interactionType === WorkflowItemsInteractionType.TRIGGER ?
            <div className={styles.headerRow}>
              <div>
                <p>Status of last run</p>
                <p>Workflow name</p>
              </div>
              <div className={styles.typeHeader}>
                <p>Workflow type</p>
              </div>
            </div> :
            <div className={styles.headerAction}>
              <button type="button">{'Trigger new workflow ->'}</button>
            </div>
          }
          <div className={styles.list}>
            {items.map(item => (
              <a key={item.name} href="#" className="list-group-item list-group-item-action">
                <div style={{ display: 'flex', flexDirection: 'row', gap: '16px' }}>
                  <WorkflowStatusPill status={item.instanceState} />
                  <h4>{WorkflowItemsInteractionType.TRIGGER ? item.name : item.instanceName}</h4>
                </div>
                <p>{item.type}</p>
                {interactionType === WorkflowItemsInteractionType.TRIGGER ?
                  <button onClick={() => {
                    navigate(ROUTE.TRIGGERFORM);
                  }}>Trigger workflow</button>
                  :
                  <div className="dropdown">
                    <button className={styles.dropdownButton} type="button"
                            id="dropdownMenuButton"
                            data-toggle="dropdown" aria-haspopup="true" aria-expanded="false">
                      <img src={dropdown} alt={('More actions')} />
                    </button>
                    <div className={`dropdown-menu dropdown-menu-right ${styles.dropdownMenu}`}>
                      <a className={`dropdown-item ${styles.dropdownItem}`} href="#"
                         onClick={() => handleGetWorkflow(item)}>Update workflow status</a>
                      <a className={`dropdown-item ${styles.dropdownItem}`} href="#"
                         onClick={() => handleCancelWorkflow(item)}>Cancel workflow</a>
                    </div>
                  </div>
                }
              </a>
            ))}
          </div>
        </div>
        :
        <div className={styles.emptyListContainer}>
          <h1>{'You don\'t have any workflows'}</h1>
          <Link to={ROUTE.HOME}>
            <button className={styles.defaultButton}
                    type="button">
              {interactionType === WorkflowItemsInteractionType.TRIGGER
                ? 'Create a new workflow ->'
                : 'Trigger new workflow ->'}
            </button>
          </Link>
        </div>
      }
    </div>
  );
};

export default WorkflowList;
