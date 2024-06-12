import DocumentCreatedPopup from '../Popups/DocumentCreated/DocumentCreated.jsx';
import { useState } from 'react';
import { api } from '../../api';

import styles from './Dropdown.module.css';


const Dropdown = props => {
  const [isPopupOpen, togglePopupState] = useState(false);
  const [selectedDocument, setSelectedDocument] = useState('Create 1-9 document');

  const togglePopup = value => {
    setSelectedDocument(value);
    togglePopupState(!isPopupOpen);
  };

  return (<div className="dropdown">
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
        <a key={option.value} className={`dropdown-item ${styles.dropdownItem}`} onClick={() => {
          api.workflows.createWorkflow(option.type).then(r => console.log('Creating ' + option.value + ' ' + r));
          togglePopup(option.value);
        }}>{option.value}</a>))}
    </div>
    {isPopupOpen ? (<DocumentCreatedPopup
      togglePopup={togglePopup}
      message={props.options.find(option => option.value === selectedDocument).message}
    />) : null}
  </div>);
};

export default Dropdown;
