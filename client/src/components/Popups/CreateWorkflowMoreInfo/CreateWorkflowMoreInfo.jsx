import styles from './CreateWorkflowMoreInfo.module.css';
import withPopup from '../../../hocs/withPopup/withPopup.jsx';

const CreateWorkflowMoreinfo = () => {
    return (
      <div className={styles.popupContainer}>
        <h2>Behind the scenes</h2>
        <div className={styles.behindTheScenes}>
          <h4>This sample features</h4>
          <p>
            Employee completes ID verification
            Employee fills out web form with their information
            Data from the web form is used to populate the I-9 document
            Employee completes the I-9 document with embedded signing
            HR approver completes the document
          </p>
          <h4>Step 1 Creating workflow</h4>
          <p>After the form is submitted, call the
            AccountBrands:list
            method on the account to check
            if the brand you want to create already exists.
            If it does, find the corresponding brand ID. If not,
            call the
            AccountBrands:create
            method to create a
            new brand.
            The brand ID is then stored for the next step.
          </p>
          <h4>Step 2</h4>
          <p>Create an envelope definition with all of the envelope data, including the form information, brand data,
            tabs for form fields, documents to sign, and recipients.
            Place different types of tabs on the documents as part of the Signers. The tab elements are positioned using
            x/y coordinates on the Documents.
            Since the first signer is using embedded signing, you must also set the clientUserId property for that
            signer recipient.
          </p>
          <h4>Step 3</h4>
          <p>Using the
            Envelopes:create
            API method, create
            and immediately send the envelope with the
            envelope definition made from the previous step. The returned envelopeId is then stored for use in the
            next step.
          </p>
        </div>
      </div>
    );
  }
;

const CreateWorkflowMoreinfoPopup = withPopup(CreateWorkflowMoreinfo);
export default CreateWorkflowMoreinfoPopup;
