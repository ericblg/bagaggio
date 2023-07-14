import React, { useEffect, useState } from 'react';

const Header = ({ user }) => {
  const [userImage, setUserImage] = useState('');

  useEffect(() => {
    const fetchUserImage = async () => {
      try {
        const response = await fetch(user.avatar_url);
        if (response.ok) {
          const imageData = await response.blob();
          const imageUrl = URL.createObjectURL(imageData);
          setUserImage(imageUrl);
        }
      } catch (error) {
        console.error(error);
      }
    };

    if (user && user.avatar_url) {
      fetchUserImage();
    }
  }, [user]);

  return (
    <header>
      <div className="logo">Bagaggio</div>
      {user && (
        <div className="user-info">
          {userImage && (
            <img src={userImage} alt="User" className="user-photo" />
          )}
          <span className="user-name">{user.name}</span>
        </div>
      )}
    </header>
  );
};

export default Header;
