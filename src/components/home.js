import React, { useState, useEffect } from 'react';


const Home = ({ user, onLogout }) => {
  const [usuarios, setUsuarios] = useState([]);
  const [nome, setNome] = useState('');
  const [cep, setCep] = useState('');
  const [endereco, setEndereco] = useState({
    rua: '',
    bairro: '',
    cidade: '',
    uf: '',
  });
  const [modoEdicao, setModoEdicao] = useState(false);
  const [indiceEdicao, setIndiceEdicao] = useState(-1);
  const [exibirDialogoConfirmacao, setExibirDialogoConfirmacao] = useState(false);
  const [indiceExclusao, setIndiceExclusao] = useState(-1);

  useEffect(() => {
    const buscarEndereco = async () => {
      try {
        const cepFormatado = cep.replace(/\D/g, ''); // Remove todos os caracteres não numéricos

        if (cepFormatado.length === 8) {
          const responseViaCEP = await fetch(`https://viacep.com.br/ws/${cepFormatado}/json/`);
          const dadosEnderecoViaCEP = await responseViaCEP.json();

          if (!responseViaCEP.ok || dadosEnderecoViaCEP.erro) {
            throw new Error('CEP inválido');
          }

          setEndereco({
            rua: dadosEnderecoViaCEP.logradouro,
            bairro: dadosEnderecoViaCEP.bairro,
            cidade: dadosEnderecoViaCEP.localidade,
            uf: dadosEnderecoViaCEP.uf,
          });
        } else {
          setEndereco({
            rua: '',
            bairro: '',
            cidade: '',
            uf: '',
          });
        }
      } catch (error) {
        setEndereco({
          rua: '',
          bairro: '',
          cidade: '',
          uf: '',
        });
        console.error(error);
      }
    };

    buscarEndereco();
  }, [cep]);

  const adicionarUsuario = () => {
    if (nome.trim() !== '') {
      const novoUsuario = {
        nome,
        endereco: {
          rua: endereco.rua,
          bairro: endereco.bairro,
          cidade: endereco.cidade,
          uf: endereco.uf,
        },
      };

      if (modoEdicao) {
        const usuariosAtualizados = [...usuarios];
        usuariosAtualizados[indiceEdicao] = novoUsuario;
        setUsuarios(usuariosAtualizados);
        setModoEdicao(false);
        setIndiceEdicao(-1);
      } else {
        setUsuarios([...usuarios, novoUsuario]);
      }

      setNome('');
      setCep('');
      setEndereco({
        rua: '',
        bairro: '',
        cidade: '',
        uf: '',
      });
    }
  };

  const editarUsuario = (indice) => {
    const usuario = usuarios[indice];
    setNome(usuario.nome);
    setCep('');
    setEndereco(usuario.endereco);
    setModoEdicao(true);
    setIndiceEdicao(indice);
  };

  const excluirUsuario = (indice) => {
    setIndiceExclusao(indice);
    setExibirDialogoConfirmacao(true);
  };

  const confirmarExclusaoUsuario = () => {
    const usuariosAtualizados = [...usuarios];
    usuariosAtualizados.splice(indiceExclusao, 1);
    setUsuarios(usuariosAtualizados);
    setExibirDialogoConfirmacao(false);
  };

  const cancelarExclusaoUsuario = () => {
    setExibirDialogoConfirmacao(false);
  };

  return (
    <div className="container">
      <div className="content">
        <h2>Home</h2>
        <p>Bem-vindo, {user.name}!</p>
        <button onClick={onLogout}>Logout</button>
        <h3>Cadastro de Usuários</h3>
        <input
          type="text"
          placeholder="Nome"
          value={nome}
          onChange={(e) => setNome(e.target.value)}
        />
        <input
          type="text"
          placeholder="CEP"
          value={cep}
          onChange={(e) => setCep(e.target.value)}
        />
        <input
          type="text"
          placeholder="Rua"
          value={endereco.rua}
          disabled
        />
        <input
          type="text"
          placeholder="Bairro"
          value={endereco.bairro}
          disabled
        />
        <input
          type="text"
          placeholder="Cidade"
          value={endereco.cidade}
          disabled
        />
        <input type="text" placeholder="UF" value={endereco.uf} disabled />
        <button onClick={adicionarUsuario}>{modoEdicao ? 'Atualizar' : 'Cadastrar'}</button>
        <ul>
          {usuarios.map((usuario, indice) => (
            <li key={indice}>
              {usuario.nome}
              <br />
              Endereço: {usuario.endereco.rua}, {usuario.endereco.bairro}, {usuario.endereco.cidade} - {usuario.endereco.uf}
              <br />
              <button onClick={() => editarUsuario(indice)}>Editar</button>
              <button onClick={() => excluirUsuario(indice)}>Remover</button>
            </li>
          ))}
        </ul>
        {exibirDialogoConfirmacao && (
          <div>
            <p>Tem certeza de que deseja remover o usuário?</p>
            <button onClick={confirmarExclusaoUsuario}>Sim</button>
            <button onClick={cancelarExclusaoUsuario}>Não</button>
          </div>
        )}
      </div>
    </div>
  );
};

export default Home;
