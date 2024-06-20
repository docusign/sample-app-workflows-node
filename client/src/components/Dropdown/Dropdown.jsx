import { useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import styles from './Dropdown.module.css';
import WorkflowCreationPopup from '../Popups/WorkflowDefinitionCreation/WorkflowDefinitionCreation.jsx';
import { api } from '../../api';

const Dropdown = ({ options }) => {
  const [selectedDocument, setSelectedDocument] = useState(options[0].value);
  const dispatch = useDispatch();
  const isOpened = useSelector(state => state.popup.isOpened);

  const togglePopup = () => {
    dispatch({ type: isOpened ? 'CLOSE_POPUP' : 'OPEN_POPUP' });
    dispatch({ type: 'CLEAR_ERROR_POPUP' });
    dispatch({ type: 'CLEAR_WORKFLOW' });
  };

  const handleCreateWorkflow = async ({ value, type }) => {
    setSelectedDocument(value);
    dispatch({ type: 'OPEN_POPUP' });
    dispatch({ type: 'LOADING_POPUP' });
    const { status, data } = await api.workflows.createWorkflowDefinition(type);

    if (status === 400) {
      dispatch({ type: 'SET_ERROR_POPUP', payload: { errorMessage: data.message, templateName: data.templateName } });
      dispatch({ type: 'LOADED_POPUP' });
      return;
    }

    dispatch({ type: 'ADD_WORKFLOW', payload: data });
    dispatch({ type: 'LOADED_POPUP' });
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
        {options.map(option => (
          <a
            key={option.value}
            className={`dropdown-item ${styles.dropdownItem}`}
            onClick={() => handleCreateWorkflow(option)}
          >
            {option.value}
          </a>
        ))}
      </div>

      {isOpened && (
        <WorkflowCreationPopup
          togglePopup={togglePopup}
          message={options.find(option => option.value === selectedDocument).message}
        />
      )}
    </div>
  );
};

export default Dropdown;
