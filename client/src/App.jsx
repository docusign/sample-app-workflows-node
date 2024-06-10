import { BrowserRouter, Route, Routes } from 'react-router-dom';
import Hero from './pages/Hero/Hero.jsx';
import { ROUTE } from './constants.js';
import HomeAuthenticated from './pages/Home/Home.jsx';
import ManageWorkflowAuthenticated from './pages/ManageWorkflow/ManageWorkflow.jsx';
import TriggerWorkflowAuthenticated from './pages/TriggerWorkflow/TriggerWorkflow.jsx';

function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path={ROUTE.ROOT} element={<Hero />} />
        <Route path={ROUTE.HOME} element={<HomeAuthenticated />} />
        <Route path={ROUTE.TRIGGER} element={<TriggerWorkflowAuthenticated />} />
        <Route path={ROUTE.MANAGE} element={<ManageWorkflowAuthenticated />} />
      </Routes>
    </BrowserRouter>
  );
}

export default App;