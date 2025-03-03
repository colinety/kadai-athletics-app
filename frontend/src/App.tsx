import React from 'react';
import './App.css';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { AuthProvider } from "./contexts/AuthContext";
import Login from './components/Login';
import Home from './components/Home';
import Competitions from './components/Competitions';
import AddCompetition from './components/AddCompetition';
import CompetitionEntry from './components/CompetitionEntry';
import CompetitionEntries from './components/CompetitionEntries';
import ResetPassword from './components/ResetPassword';

const App: React.FC = () => {
  return (
    <AuthProvider>
      <Router>
        <Routes>
          <Route path="/" element={<Login />} />
          <Route path="/home" element={<Home />} />
          <Route path='/reset-password' element={<ResetPassword />} />
          <Route path="/competitions" element={<Competitions />} />
          <Route path='/add-competition' element={<AddCompetition />} />
          <Route path='/competition-entry/:competitionId' element={<CompetitionEntry />} />
          <Route path='/competition-entry/:competitionId/entries' element={<CompetitionEntries />} />
        </Routes>
      </Router>
    </AuthProvider>
  );
};

export default App;
