import WorkflowCreationPopup from '../Popups/WorkflowDefinitionCreation/WorkflowDefinitionCreation.jsx';
import { useState } from 'react';
import { api } from '../../api';

import styles from './Dropdown.module.css';
import { useDispatch, useSelector } from 'react-redux';

const Dropdown = props => {
  const [selectedDocument, setSelectedDocument] = useState('Create 1-9 document');
  const dispatch = useDispatch();
  const isOpened = useSelector(state => state.popup.isOpened);

  const togglePopup = () => {
    dispatch({ type: isOpened ? 'CLOSE' : 'OPEN' });
    dispatch({ type: 'CLEAR_ERROR' });
  };

  const handleCreateWorkflow = async option => {
    setSelectedDocument(option.value);
    dispatch({ type: 'OPEN' });
    dispatch({ type: 'LOADING' });
    const responseWorkflow = await api.workflows.createWorkflowDefinition(option.type);

    if (responseWorkflow.status === 400) {
      dispatch({
        type: 'ERROR',
        payload: { errorMessage: responseWorkflow.data.message, templateName: responseWorkflow.data.templateName },
      });
    } else {
      dispatch({ type: 'ADD_WORKFLOW', payload: responseWorkflow.data });
      dispatch({ type: "ERRORLESS" });
    }
    dispatch({ type: 'LOADED' });
    console.log('FullWorkflow ', responseWorkflow.data);
  };

  return (
    <div className="dropdown">
      <button
        className="btn btn-secondary dropdown-toggle"
        type="button"
        id="dropdownMenuButton"
        data-toggle="dropdown"
        aria-haspopup="true"
        aria-expanded="false"
      >
        Get Started
      </button>
      <div className="dropdown-menu" aria-labelledby="dropdownMenuButton">
        {props.options.map(option => (
          <a
            key={option.value}
            className={`dropdown-item ${styles.dropdownItem}`}
            onClick={() => handleCreateWorkflow(option)}
          >
            {option.value}
          </a>
        ))}
      </div>
      {isOpened ? (
        <WorkflowCreationPopup
          togglePopup={togglePopup}
          message={props.options.find(option => option.value === selectedDocument).message}
        />
      ) : null}
    </div>
  );
};

export default Dropdown;
