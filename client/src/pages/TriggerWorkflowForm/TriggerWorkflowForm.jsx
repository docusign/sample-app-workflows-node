import { useState, useRef, useEffect, useCallback } from 'react';
import { useParams, useLocation, useNavigate } from 'react-router-dom';
import styles from './TriggerWorkflowForm.module.css';
import Header from '../../components/Header/Header.jsx';
import Footer from '../../components/Footer/Footer.jsx';
import textContent from '../../assets/text.json';
import withAuth from '../../hocs/withAuth/withAuth.jsx';
import WorkflowDescription from '../../components/WorkflowDescription/WorkflowDescription.jsx';
import TriggerBehindTheScenes from '../../components/WorkflowDescription/BehindTheScenes/TriggerBehindTheScenes.jsx';
import TriggerForm from '../../components/TriggerForm/TriggerForm.jsx';
import { ROUTE } from '../../constants.js';
import { buttons } from '../../assets/text.json';

const TriggerWorkflowForm = () => {
  const { workflowId } = useParams();
  const navigate = useNavigate();
  const [embeddingFailed, setEmbeddingFailed] = useState(false);
  const hasOpenedNewTab = useRef(false);
  const childWindowRef = useRef(null);

  const location = useLocation();
  const searchParams = new URLSearchParams(location.search);
  const type = searchParams.get('type');
  const triggerUrl = searchParams.get('triggerUrl');

  function isValidTriggerUrl(url) {
    try {
      const decoded = decodeURIComponent(url);
      const parsedUrl = new URL(decoded);
      return (
        parsedUrl.protocol === 'https:' &&
        parsedUrl.hostname === 'apps-d.docusign.com'
      );
    } catch {
      return false;
    }
  }

  const handleIframeLoad = useCallback((e) => {
    try {
      const href = e.target.contentWindow.location.href;
      if (href === 'about:blank') {
        setEmbeddingFailed(true);
      }
    } catch {
      // Cross-origin SecurityError — handled by ReportingObserver for CSP blocks
    }
  }, []);

  // Detect CSP frame-ancestors violations via ReportingObserver
  useEffect(() => {
    if (!triggerUrl) return;

    let observer;
    if (typeof ReportingObserver !== 'undefined') {
      observer = new ReportingObserver((reports) => {
        const blocked = reports.some(
          (report) => report.body && report.body.effectiveDirective === 'frame-ancestors'
        );
        if (blocked) {
          setEmbeddingFailed(true);
        }
      }, { types: ['csp-violation'], buffered: false });
      observer.observe();
    }

    return () => {
      if (observer) observer.disconnect();
    };
  }, [triggerUrl]);

  // Open new tab when embedding fails
  useEffect(() => {
    if (embeddingFailed && triggerUrl && !hasOpenedNewTab.current) {
      hasOpenedNewTab.current = true;
      childWindowRef.current = window.open(triggerUrl, '_blank');
    }
  }, [embeddingFailed, triggerUrl]);

  if (triggerUrl !== null && isValidTriggerUrl(triggerUrl)) {
    // Embedding failed — workflow opened in new tab
    if (embeddingFailed) {
      return (
        <div className="page-box">
          <Header />
          <div className={styles.contentContainer}>
            <WorkflowDescription
              title={textContent.pageTitles.completeWorkflow}
              behindTheScenesComponent={<TriggerBehindTheScenes />}
              backRoute={ROUTE.TRIGGER}
            />
            <p>This workflow cannot be embedded and has been opened in a new tab.</p>
            <p>Complete your tasks in the new tab, then click Done to return.</p>
            <a href={triggerUrl} target="_blank" rel="noopener noreferrer">
              Open workflow in new tab
            </a>
            <button className={styles.doneButton} onClick={() => {
              if (childWindowRef.current) {
                childWindowRef.current.close();
                childWindowRef.current = null;
              }
              navigate(ROUTE.TRIGGER);
            }}>
              {buttons.done}
            </button>
          </div>
          <Footer withContent={false} />
        </div>
      );
    }

    // Iframe embedding
    return (
      <div className="page-box">
        <Header />
        <div className={styles.contentContainer}>
          <WorkflowDescription
            title={textContent.pageTitles.completeWorkflow}
            behindTheScenesComponent={<TriggerBehindTheScenes />}
            backRoute={ROUTE.TRIGGER}
          />

          <iframe src={triggerUrl} width="800" height="600" onLoad={handleIframeLoad}>
          </iframe>
          <button className={styles.doneButton} onClick={() => navigate(ROUTE.TRIGGER)}>
            {buttons.done}
          </button>
        </div>
        <Footer withContent={false} />
      </div>
    );
  }

  return (
    <div className="page-box">
      <Header />
      <div className={styles.contentContainer}>
        <WorkflowDescription
          title={textContent.pageTitles.triggerWorkflow}
          behindTheScenesComponent={<TriggerBehindTheScenes />}
          backRoute={ROUTE.TRIGGER}
        />
        <TriggerForm workflowId={workflowId} templateType={type} />
      </div>
      <Footer withContent={false} />
    </div>
  );
};

const TriggerWorkflowFormAuthenticated = withAuth(TriggerWorkflowForm);
export default TriggerWorkflowFormAuthenticated;
