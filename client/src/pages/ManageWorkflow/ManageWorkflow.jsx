import { useEffect, useState } from 'react';
import { useLocation } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import styles from './ManageWorkflow.module.css';
import Header from '../../components/Header/Header.jsx';
import Footer from '../../components/Footer/Footer.jsx';
import textContent from '../../assets/text.json';
import withAuth from '../../hocs/withAuth/withAuth.jsx';
import WorkflowList from '../../components/WorkflowList/WorkflowList.jsx';
import WorkflowDescription from '../../components/WorkflowDescription/WorkflowDescription.jsx';
import ManageBehindTheScenes from '../../components/WorkflowDescription/BehindTheScenes/ManageBehindTheScenes.jsx';
import { ROUTE, WorkflowItemsInteractionType, TemplateType, LoginStatus } from '../../constants.js';
import { api } from '../../api';
import { updateWorkflowDefinitions } from '../../store/actions';

const ManageWorkflow = () => {
    const [isWorkflowListLoading, setWorkflowListLoading] = useState(false);
    const dispatch = useDispatch();
    const location = useLocation();
    const workflows = useSelector(state => state.workflows.workflows);
    const authType = useSelector(state => state.auth.authType);

    useEffect(() => {
        const getWorkflowDefinitions = async () => {
            setWorkflowListLoading(true);
            const definitionsResponse = await api.workflows.getWorkflowDefinitions();
            const workflowDefinitions = definitionsResponse.data.data.filter(definition => definition.status !== 'inactive')
                .map(definition => {
                    if (workflows.length) {
                        const foundWorkflow = workflows.find(workflow => workflow.id === definition.id);
                        if (foundWorkflow) return foundWorkflow;
                    }

                    const templateKeys = Object.keys(TemplateType);
                    const foundKey = templateKeys.find(key => definition.name.startsWith(TemplateType[key].name));
                    if (!foundKey) {
                        if (authType === LoginStatus.JWT)
                            return null;

                        return {
                            id: definition.id,
                            name: definition.name,
                            instanceState: definition.status,
                        };
                    }

                    return {
                        id: definition.id,
                        name: `${TemplateType[foundKey]?.name}`,
                        instanceState: definition.status,
                    };
                })
                .filter(definition => !!definition);

            dispatch(updateWorkflowDefinitions(workflowDefinitions));
            setWorkflowListLoading(false);
        };

        getWorkflowDefinitions();
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [dispatch, location.pathname]);

    return (
        <div className="page-box">
            <Header />
            <div className={styles.contentContainer}>
                <WorkflowDescription
                    title={textContent.pageTitles.manageWorkflow}
                    behindTheScenesComponent={<ManageBehindTheScenes />}
                    backRoute={ROUTE.HOME}
                    backText={textContent.buttons.backHome}
                />
                <WorkflowList
                    items={workflows}
                    interactionType={WorkflowItemsInteractionType.MANAGE}
                    isLoading={isWorkflowListLoading}
                />
            </div>
            <Footer withContent={false} />
        </div>
    );
};

const ManageWorkflowAuthenticated = withAuth(ManageWorkflow);
export default ManageWorkflowAuthenticated;