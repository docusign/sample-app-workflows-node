import { useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import styles from './Dropdown.module.css';
import WorkflowCreationPopup from '../Popups/WorkflowDefinitionCreation/WorkflowDefinitionCreation.jsx';
import textContent from '../../assets/text.json';
import { api } from '../../api';
import {
  openPopupWindow,
  closePopupWindow,
  openLoadingCircleInPopup,
  closeLoadingCircleInPopup,
  showErrorTextInPopup,
  clearErrorTextInPopup,
  saveCreatedWorkflow,
  clearCreatedWorkflowFromState,
} from '../../store/actions';

const Dropdown = ({ options }) => {
  const dispatch = useDispatch();
  const isPopupOpened = useSelector(state => state.popup.isOpened);
  const [selectedDocument, setSelectedDocument] = useState(options[0].value);

  const closePopup = () => {
    dispatch(closePopupWindow());
    dispatch(clearErrorTextInPopup());
    dispatch(clearCreatedWorkflowFromState());
  };

  const handleCreateWorkflow = async ({ value, type }) => {
    setSelectedDocument(value);
    dispatch(openPopupWindow());
    dispatch(openLoadingCircleInPopup());
    const { status, data } = await api.workflows.createWorkflowDefinition(type);

    if (status === 400) {
      dispatch(showErrorTextInPopup(null, data.message, data.templateName));
      dispatch(closeLoadingCircleInPopup());
      return;
    }

    dispatch(saveCreatedWorkflow(data.workflowDefinitionId));
    dispatch(closeLoadingCircleInPopup());
  };

  return (
    <div className="dropdown">
      <button
        className="btn btn-secondary dropdown-toggle"
        type="button"
        id="dropdownMenuButton"
        data-bs-toggle="dropdown"
        aria-haspopup="true"
        aria-expanded="false"
      >
        {textContent.buttons.getStarted}
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

      {isPopupOpened && (
        <WorkflowCreationPopup
          togglePopup={closePopup}
          message={options.find(option => option.value === selectedDocument).message}
        />
      )}
    </div>
  );
};

export default Dropdown;
