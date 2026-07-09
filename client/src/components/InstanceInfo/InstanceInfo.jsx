import styles from './InstanceInfo.module.css';
import instanceCompletedSvg from '../../assets/img/instance-completed.svg';
import instanceCanceledSvg from '../../assets/img/instance-canceled.svg';
import textContent from '../../assets/text.json';
import { api } from '../../api';
import { useState } from 'react';
import StatusLoader from '../StatusLoader/StatusLoader.jsx';
import { useDispatch, useSelector } from 'react-redux';
import { updateWorkflowDefinitions } from '../../store/actions/workflows.action.js';

const InstanceInfo = ({ workflowId, instance }) => {
  const dispatch = useDispatch();
  const workflows = useSelector(state => state.workflows.workflows);
  const [isStatusRefreshing, setIsStatusRefreshing] = useState(false);
  
  const { lastCompletedStep, totalSteps, workflowStatus } = instance;
  const progress = Math.min((lastCompletedStep / totalSteps) * 100, 100);
  const isFailed = workflowStatus.toLowerCase() === 'failed';
  const isInProgress = workflowStatus.toLowerCase() === 'in progress';
  const isSuccessful = workflowStatus.toLowerCase() === 'completed';

  const handleCancelInstance = async () => {
    setIsStatusRefreshing(true);
    await api.workflows.cancelWorkflowInstance(workflowId, instance.id);
    
    const updatedWorkflows = workflows.map(workflow => {
      if (workflow.id !== workflowId) return workflow;

      const newInstanceList = workflow.instances.map(inst => {
        if (inst.id !== instance.id) return inst;

        const updatedInstance = { ...inst, workflowStatus: 'Canceled' };
        return updatedInstance;
      })

      const updatedWorkflow = { ...workflow, instances: newInstanceList };
      return updatedWorkflow;
    })

    dispatch(updateWorkflowDefinitions(updatedWorkflows));
    setIsStatusRefreshing(false);
  }

  return (
    <div key={instance.id} className={styles.instanceListRow}>
      <div className={styles.cell}>
        <h4>{instance.name}</h4>
      </div>

      <div className={styles.cell}>
        {isStatusRefreshing ? (
          <StatusLoader />
        ) : isInProgress || isFailed ? (
          <>
            <progress className={isFailed ? styles.progressFail : styles.progressSuccess} max={100} value={progress} />
            <h5>{instance.workflowStatus}</h5>
          </>
        ) : (
          <h4><img src={isSuccessful ? instanceCompletedSvg : instanceCanceledSvg} alt={workflowStatus} />{workflowStatus}</h4>
        )}
      </div>
      
      <div className={styles.cell}>
        <h4>{instance.startedByName}</h4>
      </div>

      <div className={styles.cell}>
        <button disabled={!isInProgress} onClick={() => handleCancelInstance()}>{textContent.instanceList.cancelButton}</button>
      </div>
    </div>
  );
}

export default InstanceInfo;
