import withPopup from '../../hocs/withPopup/withPopup.jsx';

const AcgPrompt = () => {
  return (
    <div>
      <h2>To use this feature, please Log in using ACG</h2>
    </div>
  );
};

const PopupUseAcg = withPopup(AcgPrompt);
export default PopupUseAcg;