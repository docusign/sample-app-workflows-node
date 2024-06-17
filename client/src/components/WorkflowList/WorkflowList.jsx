import WorkflowStatusPill from '../WorkflowStatusPill/WorkflowStatusPill.jsx';
import { Link } from 'react-router-dom';
import { ROUTE, WorkflowItemsInteractionType } from '../../constants.js';
import { useDispatch } from 'react-redux';

import dropdown from '../../assets/img/dropdown.svg';
import styles from './WorkflowList.module.css';
import { api } from '../../api/index.js';

const WorkflowList = ({ items, interactionType }) => {
  const dispatch = useDispatch();

  return (
    <div className={`list-group ${styles.listGroup}`}>
      {items && items.length > 0 ?
        <div>
          {items.map(item => (
            <a key={item.name} href="#" className="list-group-item list-group-item-action">
              <div style={{ display: 'flex', flexDirection: 'row', gap: '16px' }}>
                <WorkflowStatusPill status={item.status} />
                <h4>{item.name}</h4>
              </div>
              <p>{item.type}</p>
              {interactionType === WorkflowItemsInteractionType.TRIGGER ?
                <button onClick={() => {
                  //TODO: Inject backend implementation for triggering workflow
                }}>Trigger workflow</button>
                :
                <div className="dropdown">
                  <button className={styles.dropdownButton} type="button"
                          id="dropdownMenuButton"
                          data-toggle="dropdown" aria-haspopup="true" aria-expanded="false">
                    <img src={dropdown} alt={('More actions')} />
                  </button>
                  <div className={`dropdown-menu dropdown-menu-right ${styles.dropdownMenu}`}>
                    <a className={`dropdown-item ${styles.dropdownItem}`} href="#" onClick={() => {
                      item = api.workflows.getWorkflowInstance(item);
                      dispatch({ type: 'GET_WORKFLOW' });
                    }}>Update workflow status</a>
                    <a className={`dropdown-item ${styles.dropdownItem}`} href="#" onClick={() => {
                      api.workflows.cancelWorkflowInstance(item);
                      dispatch({ type: 'CANCEL_WORKFLOW' });
                    }}>Cancel workflow</a>
                  </div>
                </div>
              }
            </a>
          ))}
        </div>
        :
        <div className={styles.emptyListContainer}>
          <h1>{'You don\'t have any workflows'}</h1>
          <Link to={ROUTE.HOME}>
            <button className={styles.defaultButton} type="button">Create a new workflow</button>
          </Link>
        </div>
      }
    </div>
  );
};

export default WorkflowList;