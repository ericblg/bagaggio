import React, { useState } from 'react';
import './App.css';
import Login from './components/Login';
import Home from './components/home';
import Header from './components/Header';

const App = () => {
  const [user, setUser] = useState(null);

  const handleLogin = (userData) => {
    localStorage.setItem('user', JSON.stringify(userData));
    setUser(userData);
  };

  const handleLogout = () => {
    localStorage.removeItem('user');
    setUser(null);
  };

  return (
    <div className="App">
    <Header user={user} />
    <div className="container">
      {!user ? (
        <Login onLogin={handleLogin} />
      ) : (
        <Home user={user} onLogout={handleLogout} />
      )}
    </div>
  </div>
  );
};

export default App;
