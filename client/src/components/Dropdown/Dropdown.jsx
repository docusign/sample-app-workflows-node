import WorkflowCreationPopup from '../Popups/WorkflowDefinitionCreation/WorkflowDefinitionCreation.jsx';
import { useState } from 'react';
import { api } from '../../api';
import { TEMPLATE_TYPE } from '../../constants.js';

import styles from './Dropdown.module.css';
import { useDispatch, useSelector } from 'react-redux';

const Dropdown = props => {
  const [selectedDocument, setSelectedDocument] = useState(`Create ${TEMPLATE_TYPE.I9}`);
  const dispatch = useDispatch();
  const isOpened = useSelector(state => state.popup.isOpened);

  const togglePopup = () => {
    dispatch({ type: isOpened ? 'CLOSE_POPUP' : 'OPEN_POPUP' });
    dispatch({ type: 'CLEAR_ERROR_POPUP' });
    dispatch({ type: 'CLEAR_WORKFLOW' });
  };

  const handleCreateWorkflow = async option => {
    setSelectedDocument(option.value);
    dispatch({ type: 'OPEN_POPUP' });
    dispatch({ type: 'LOADING_POPUP' });
    const { status, data } = await api.workflows.createWorkflowDefinition(option.type);

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
