import styles from './Dropdown.module.css';

const Dropdown = (props) => {
  return (
    <div className="dropdown">
      <button className="btn btn-secondary dropdown-toggle" type="button" id="dropdownMenuButton"
              data-toggle="dropdown" aria-haspopup="true" aria-expanded="false">
        Get Started
      </button>
      <div className="dropdown-menu" aria-labelledby="dropdownMenuButton">
        {props.options.map(option => (
          <a key={option.value} className={`dropdown-item ${styles.dropdownItem}`}
             href={option.route}>{option.value}</a>
        ))}
      </div>
    </div>
  );
};

export default Dropdown;
