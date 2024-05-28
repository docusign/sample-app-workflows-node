import React from 'react';
import { BrowserRouter, Route, Routes } from 'react-router-dom';
import Home from './pages/Home/Home.jsx';
import Hero from './pages/Hero/Hero.jsx';
import { ROUTE } from './constants.js';

function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route
          path={ROUTE.ROOT}
          element={<Hero />}
        />
        <Route
          path={ROUTE.HOME}
          element={<Home />}
        />
      </Routes>
    </BrowserRouter>
  );
}

export default App;