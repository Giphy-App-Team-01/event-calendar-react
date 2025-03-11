import React, { useEffect, useContext, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { AppContext } from '../context/app.context';
import BlockedPopup from '../components/BlockedPopup/BlockedPopup';
import { logoutUser } from '../services/auth-service';

const BlockCheck: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const { authUser, dbUser } = useContext(AppContext);
  const [showModal, setShowModal] = useState(false);
  const navigate = useNavigate();


  useEffect(() => {
    if (authUser && dbUser?.isBlocked) {
      setShowModal(true);
    }
  }, [authUser, dbUser]);

  const handleClose = async () => {
    setShowModal(false);
    try {
      await logoutUser();
      navigate('/');
    } catch (error) {
      console.error('Error signing out:', error);
    }
  };

  console.log('BlockCheck rendered',authUser);
  

  return (
    <>
      {showModal && <BlockedPopup onClose={handleClose} />}
      {children}
    </>
  );
};

export default BlockCheck;
