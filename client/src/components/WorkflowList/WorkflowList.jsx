import WorkflowStatusPill from '../WorkflowStatusPill/WorkflowStatusPill.jsx';

import styles from './WorkflowList.module.css';
import { Link } from 'react-router-dom';
import { ROUTE, WokrflowItemsInteractionType } from '../../constants.js';
import { useDispatch } from 'react-redux';

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
              {interactionType === WokrflowItemsInteractionType.TRIGGER ?
                <button onClick={() => {
                  //TODO: Inject backend implementation for triggering workflow
                }}>Trigger workflow</button>
                :
                <div className="dropdown">
                  <button className={styles.dropdownButton} type="button"
                          id="dropdownMenuButton"
                          data-toggle="dropdown" aria-haspopup="true" aria-expanded="false">
                    <svg width="20" height="24" fill="currentColor" className="bi bi-three-dots-vertical"
                         viewBox="0 0 16 16">
                      <path
                        d="M9.5 13a1.5 1.5 0 1 1-3 0 1.5 1.5 0 0 1 3 0zm0-5a1.5 1.5 0 1 1-3 0 1.5 1.5 0 0 1 3 0zm0-5a1.5 1.5 0 1 1-3 0 1.5 1.5 0 0 1 3 0z" />
                    </svg>
                  </button>
                  <div className={`dropdown-menu dropdown-menu-right ${styles.dropdownMenu}`}>
                    <a className={`dropdown-item ${styles.dropdownItem}`} href="#" onClick={() => {
                      //TODO: Add Update Workflow implementation call to update item selected
                      dispatch({ type: 'GET_WORKFLOW' });
                    }}>Update workflow status</a>
                    <a className={`dropdown-item ${styles.dropdownItem}`} href="#" onClick={() => {
                      //TODO: Add Cancel Workflow implementation call to cancel item selected
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
            <button className="btn btn-secondary" type="button">Create a new workflow</button>
          </Link>
        </div>
      }
    </div>
  );
};

export default WorkflowList;