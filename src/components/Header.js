import React, { useEffect, useState } from 'react';

const Header = ({ user }) => {
  const [imagemUsuario, setImagemUsuario] = useState('');

  useEffect(() => {
    const buscarImagemUsuario = async () => {
      try {
        const resposta = await fetch(user.avatar_url);
        if (resposta.ok) {
          const dadosImagem = await resposta.blob();
          const urlImagem = URL.createObjectURL(dadosImagem);
          setImagemUsuario(urlImagem);
        }
      } catch (erro) {
        console.error(erro);
      }
    };

    if (user && user.avatar_url) {
      buscarImagemUsuario();
    }
  }, [user]);

  return (
    <header className="header">
      <div className="logo">Bagaggio</div>
      {user && (
        <div className="user-info">
          {imagemUsuario && (
            <img src={imagemUsuario} alt="Usuário" className="user-photo" />
          )}
          <span className="user-name">{user.name}</span>
        </div>
      )}
    </header>
  );
};

export default Header;
