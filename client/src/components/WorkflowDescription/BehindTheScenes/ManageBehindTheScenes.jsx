import styles from '../WorkflowDescription.module.css';
import textContent from '../../../assets/text.json';

const ManageBehindTheScenes = () => {
  return (
    <div className={`dropdown-menu ${styles.dropDownMenu}`} aria-labelledby="dropdownMenuButton">
      <h4>{textContent.behindTheScenes.titles.main}</h4>
      <p>{textContent.behindTheScenes.manageWorkflow.mainDescription}</p>
      <h4>{textContent.behindTheScenes.titles.code}</h4>
      <div style={{ display: 'flex', flexDirection: 'row', marginBottom: '-0.5rem' }}>
        <p>{textContent.behindTheScenes.descriptions.codeDescription}</p> <a target="_blank" rel="noreferrer"
                                                                             style={{ fontSize: '14px' }}
                                                                             href={'https://github.com/docusign/sample-app-mymaestro-node/blob/main/server/controllers/workflowsController.js'}>Controller</a>
      </div>
      <h4>{textContent.behindTheScenes.titles.step1}</h4>
      <p>{textContent.behindTheScenes.manageWorkflow.step1Description}</p>
      <h4>{textContent.behindTheScenes.titles.step2}</h4>
      <p>{textContent.behindTheScenes.manageWorkflow.step2Description}</p>
      <h4>{textContent.behindTheScenes.titles.step3}</h4>
      <p>{textContent.behindTheScenes.manageWorkflow.step3Description}</p>
    </div>
  );
};

export default ManageBehindTheScenes;