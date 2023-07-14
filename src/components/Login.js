import React, { useState } from 'react';

const Login = ({ onLogin }) => {
  const [usuario, setUsuario] = useState('');
  const [erro, setErro] = useState('');

  const fazerLogin = async () => {
    try {
      const resposta = await fetch(`https://api.github.com/users/${usuario}`);
      if (resposta.ok) {
        const dadosUsuario = await resposta.json();
        onLogin(dadosUsuario);
      } else {
        const dadosErro = await resposta.json();
        setErro(dadosErro.message);
      }
    } catch (erro) {
      setErro('Erro ao conectar à API do GitHub');
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
        placeholder="Nome de usuário do GitHub"
        value={usuario}
        onChange={(e) => setUsuario(e.target.value)}
      />
      <button onClick={fazerLogin}>Entrar</button>
      {erro && <p>{erro}</p>}
    </div>
  );
};

export default Login;
