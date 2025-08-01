import { useEffect } from 'react';
import { Route, Routes, useLocation, useNavigate } from 'react-router-dom';
import { useDispatch } from 'react-redux';
import Hero from './pages/Hero/Hero.jsx';
import TriggerWorkflowAuthenticated from './pages/TriggerWorkflow/TriggerWorkflow.jsx';
import TriggerWorkflowFormAuthenticated from './pages/TriggerWorkflowForm/TriggerWorkflowForm.jsx';
import { LoginStatus, ROUTE } from './constants.js';
import { api } from './api';
import HomeAuthenticated from './pages/Home/Home.jsx';
import {
  authorizeUser,
  closeLoadingCircleInPopup,
  closePopupWindow,
  openLoadingCircleInPopup,
  openPopupWindow,
} from './store/actions';

function App() {
  const location = useLocation();
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const searchParams = new URLSearchParams(location.search);
  const code = searchParams.get('code');

  useEffect(() => {
    const fetchCallback = async () => {
      if (!code || code?.length <= 0) return;

      dispatch(openPopupWindow());
      dispatch(openLoadingCircleInPopup());

      const { data: userInfo } = await api.acg.callbackExecute(code);
      dispatch(authorizeUser(LoginStatus.ACG, userInfo.name, userInfo.email));
      navigate(ROUTE.HOME);
      dispatch(closePopupWindow());
      dispatch(closeLoadingCircleInPopup());
    };

    fetchCallback();
  }, [code, dispatch, navigate]);

  return (
    <Routes>
      <Route path={ROUTE.ROOT} element={<Hero />} />
      <Route path={ROUTE.HOME} element={<HomeAuthenticated />} />
      <Route path={ROUTE.TRIGGER} element={<TriggerWorkflowAuthenticated />} />
      <Route path={`${ROUTE.TRIGGERFORM}/:workflowId`} element={<TriggerWorkflowFormAuthenticated />} />
    </Routes>
  );
}

export default App;
