import { useEffect } from 'react';
import { useDispatch } from 'react-redux';
import { Route, Routes, useLocation, useNavigate } from 'react-router-dom';
import { api } from './api';
import Hero from './pages/Hero/Hero.jsx';
import { LoginStatus, ROUTE } from './constants.js';
import HomeAuthenticated from './pages/Home/Home.jsx';
import ManageWorkflowAuthenticated from './pages/ManageWorkflow/ManageWorkflow.jsx';
import TriggerWorkflowAuthenticated from './pages/TriggerWorkflow/TriggerWorkflow.jsx';

function App() {
  const location = useLocation();
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const searchParams = new URLSearchParams(location.search);
  const code = searchParams.get('code');

  useEffect(() => {
    const fetchCallback = async () => {
      if (code && code.length > 0) {
        const res = await api.acg.callbackExecute(code);
        dispatch({ type: 'LOGIN', authType: LoginStatus.ACG, userName: res.data.name, userEmail: res.data.email });
        navigate(ROUTE.HOME);
        dispatch({ type: 'CLOSE' });
        dispatch({ type: 'LOADED' });
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
    </Routes>
  );
}

export default App;
