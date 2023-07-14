import React, { useState, useEffect } from 'react';


const Home = ({ user, onLogout }) => {
  const [users, setUsers] = useState([]);
  const [name, setName] = useState('');
  const [cep, setCEP] = useState('');
  const [address, setAddress] = useState({
    street: '',
    neighborhood: '',
    city: '',
    uf: '',
  });
  const [editMode, setEditMode] = useState(false);
  const [editIndex, setEditIndex] = useState(-1);
  const [showConfirmDialog, setShowConfirmDialog] = useState(false);
  const [deleteIndex, setDeleteIndex] = useState(-1);

  useEffect(() => {
    const fetchAddress = async () => {
      try {
        const cepFormatted = cep.replace(/\D/g, ''); // Remove todos os caracteres não numéricos

        if (cepFormatted.length === 8) {
          const responseViaCEP = await fetch(`https://viacep.com.br/ws/${cepFormatted}/json/`);
          const addressDataViaCEP = await responseViaCEP.json();

          if (!responseViaCEP.ok || addressDataViaCEP.erro) {
            throw new Error('CEP inválido');
          }

          setAddress({
            street: addressDataViaCEP.logradouro,
            neighborhood: addressDataViaCEP.bairro,
            city: addressDataViaCEP.localidade,
            uf: addressDataViaCEP.uf,
          });
        } else {
          setAddress({
            street: '',
            neighborhood: '',
            city: '',
            uf: '',
          });
        }
      } catch (error) {
        setAddress({
          street: '',
          neighborhood: '',
          city: '',
          uf: '',
        });
        console.error(error);
      }
    };

    fetchAddress();
  }, [cep]);

  const handleAddUser = () => {
    if (name.trim() !== '') {
      const newUser = {
        name,
        address: {
          street: address.street,
          neighborhood: address.neighborhood,
          city: address.city,
          uf: address.uf,
        },
      };

      if (editMode) {
        const updatedUsers = [...users];
        updatedUsers[editIndex] = newUser;
        setUsers(updatedUsers);
        setEditMode(false);
        setEditIndex(-1);
      } else {
        setUsers([...users, newUser]);
      }

      setName('');
      setCEP('');
      setAddress({
        street: '',
        neighborhood: '',
        city: '',
        uf: '',
      });
    }
  };

  const handleEditUser = (index) => {
    const user = users[index];
    setName(user.name);
    setCEP('');
    setAddress(user.address);
    setEditMode(true);
    setEditIndex(index);
  };

  const handleDeleteUser = (index) => {
    setDeleteIndex(index);
    setShowConfirmDialog(true);
  };

  const confirmDeleteUser = () => {
    const updatedUsers = [...users];
    updatedUsers.splice(deleteIndex, 1);
    setUsers(updatedUsers);
    setShowConfirmDialog(false);
  };

  const cancelDeleteUser = () => {
    setShowConfirmDialog(false);
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
          value={name}
          onChange={(e) => setName(e.target.value)}
        />
        <input
          type="text"
          placeholder="CEP"
          value={cep}
          onChange={(e) => setCEP(e.target.value)}
        />
        <input
          type="text"
          placeholder="Rua"
          value={address.street}
          disabled
        />
        <input
          type="text"
          placeholder="Bairro"
          value={address.neighborhood}
          disabled
        />
        <input
          type="text"
          placeholder="Cidade"
          value={address.city}
          disabled
        />
        <input type="text" placeholder="UF" value={address.uf} disabled />
        <button onClick={handleAddUser}>{editMode ? 'Atualizar' : 'Cadastrar'}</button>
        <ul>
          {users.map((user, index) => (
            <li key={index}>
              {user.name}
              <br />
              Endereço: {user.address.street}, {user.address.neighborhood}, {user.address.city} - {user.address.uf}
              <br />
              <button onClick={() => handleEditUser(index)}>Editar</button>
              <button onClick={() => handleDeleteUser(index)}>Remover</button>
            </li>
          ))}
        </ul>
        {showConfirmDialog && (
          <div>
            <p>Tem certeza de que deseja remover o usuário?</p>
            <button onClick={confirmDeleteUser}>Sim</button>
            <button onClick={cancelDeleteUser}>Não</button>
          </div>
        )}
      </div>
    </div>
  );
};

export default Home;
