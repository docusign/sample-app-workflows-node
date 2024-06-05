<<<<<<<< HEAD:client/src/components/AcgPrompt/AcgPrompt.jsx
import withPopup from '../../hocs/withPopup/withPopup.jsx';
========
import withPopup from '../../withPopup/withPopup.jsx';
>>>>>>>> 27304b2 (Added popup when document created for "Create Workflow" scenario.):client/src/components/Popups/UseAcgPrompt/UseAcgPrompt.jsx

const AcgPrompt = () => {
  return (
    <div>
      <h2>To use this feature, please Log in using ACG</h2>
    </div>
  );
};

<<<<<<<< HEAD:client/src/components/AcgPrompt/AcgPrompt.jsx
const PopupUseAcg = withPopup(AcgPrompt);
export default PopupUseAcg;
========
const UseAcgPopup = withPopup(UseAcgPrompt);
export default UseAcgPopup;
>>>>>>>> 27304b2 (Added popup when document created for "Create Workflow" scenario.):client/src/components/Popups/UseAcgPrompt/UseAcgPrompt.jsx
