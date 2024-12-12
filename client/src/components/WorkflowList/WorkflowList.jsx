import { useNavigate } from 'react-router-dom';
import styles from './WorkflowList.module.css';
import Loader from '../Loader/Loader.jsx';
import { ROUTE, WorkflowItemsInteractionType } from '../../constants.js';
import textContent from '../../assets/text.json';

const WorkflowList = ({ items, interactionType, isLoading }) => {
  const navigate = useNavigate();

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
          </div>
        )}

        <div className={styles.list} style={items.length >= 2 ? listStyles : {}}>
          {items.map((item, idx) => (
            <div key={`${item.name}${idx}`} className={`list-group-item list-group-item-action ${styles.listRow}`}>
              <div className={styles.cell1}>
                <h4>{WorkflowItemsInteractionType.TRIGGER ? item.name : item.instanceName}</h4>
              </div>

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
