import React, { useState } from 'react';

const Login = ({ onLogin }) => {
  const [username, setUsername] = useState('');
  const [error, setError] = useState('');

  const handleLogin = async () => {
    try {
      const response = await fetch(`https://api.github.com/users/${username}`);
      if (response.ok) {
        const userData = await response.json();
        onLogin(userData);
      } else {
        const errorData = await response.json();
        setError(errorData.message);
      }
    } catch (error) {
      setError('Erro ao connectar a GitHub API');
    }
  };

  return (
    
    <div className='login-container'>
        <img
        src="./github.png"
        alt="GitHub"
        className="github-image"
      />
      <h2>Login</h2>
      <input
        type="text"
        placeholder="Username do GitHub"
        value={username}
        onChange={(e) => setUsername(e.target.value)}
      />
      <button onClick={handleLogin}>Login</button>
      {error && <p>{error}</p>}
    </div>
  );
};

export default Login;
