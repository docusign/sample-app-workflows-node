import styles from './InstanceList.module.css';
import textContent from '../../assets/text.json';
import InstanceInfo from '../InstanceInfo/InstanceInfo'

const InstanceList = ({ workflowId, items }) => {
    if (!items?.length)
      return (
        <div className={`list-group ${styles.listGroup}`}>
          <div className={styles.emptyListContainer}>
            <h2>{textContent.instanceList.doNotHaveInstance}</h2>
            <p>{textContent.instanceList.pleaseTriggerWorkflow}</p>
          </div>
        </div>
      );

    return (
      <div className={`list-group ${styles.listGroup}`}>
        <div className={styles.listContainer}>
          <div className={`${styles.headerRow}`}>
            <p>{textContent.instanceList.columns.instance}</p>
            <p>{textContent.instanceList.columns.progress}</p>
            <p>{textContent.instanceList.columns.startedBy}</p>
          </div>

          <div className={`${styles.instanceList}`}>
            {items.map((item) => (
              <InstanceInfo key={item.id} workflowId={workflowId} instance={item} />
            ))}
          </div>
        </div>
      </div>
    );
};

export default InstanceList;
