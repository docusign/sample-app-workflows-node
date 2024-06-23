import { useEffect } from 'react';
import { Route, Routes, useLocation, useNavigate } from 'react-router-dom';
import { useDispatch } from 'react-redux';
import Hero from './pages/Hero/Hero.jsx';
import HomeAuthenticated from './pages/Home/Home.jsx';
import ManageWorkflowAuthenticated from './pages/ManageWorkflow/ManageWorkflow.jsx';
import TriggerWorkflowAuthenticated from './pages/TriggerWorkflow/TriggerWorkflow.jsx';
import TriggerWorkflowFormAuthenticated from './pages/TriggerWorkflowForm/TriggerWorkflowForm.jsx';
import { LoginStatus, ROUTE } from './constants.js';
import { api } from './api';

function App() {
  const location = useLocation();
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const searchParams = new URLSearchParams(location.search);
  const code = searchParams.get('code');

  useEffect(() => {
    const fetchCallback = async () => {
      if (code && code.length > 0) {
        const { data: userInfo } = await api.acg.callbackExecute(code);
        dispatch({
          type: 'LOGIN',
          payload: { authType: LoginStatus.ACG, userName: userInfo.name, userEmail: userInfo.email },
        });
        navigate(ROUTE.HOME);
        dispatch({ type: 'CLOSE_POPUP' });
        dispatch({ type: 'LOADED_POPUP' });
      }
    };

    fetchCallback();
  }, [code, dispatch, navigate]);

  return (
    <Routes>
      <Route path={ROUTE.ROOT} element={<Hero />} />
      <Route path={ROUTE.HOME} element={<HomeAuthenticated />} />
      <Route path={ROUTE.TRIGGER} element={<TriggerWorkflowAuthenticated />} />
      <Route path={ROUTE.MANAGE} element={<ManageWorkflowAuthenticated />} />
      <Route path={`${ROUTE.TRIGGERFORM}/:workflowId`} element={<TriggerWorkflowFormAuthenticated />} />
    </Routes>
  );
}

export default App;
