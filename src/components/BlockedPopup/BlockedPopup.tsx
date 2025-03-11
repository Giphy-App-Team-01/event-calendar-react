import React from 'react';
import Button from '../../components/Button/Button';

interface BlockedPopupProps {
  onClose: () => void;
}

const BlockedPopup: React.FC<BlockedPopupProps> = ({ onClose }) => {
  return (
    <div className="fixed inset-0 flex items-center justify-center z-50">
      <div className="absolute inset-0 bg-transparent backdrop-blur-xl"></div>
      <div className="relative bg-white p-8 rounded-xl shadow-2xl max-w-md mx-auto z-10">
        <h2 className="text-2xl font-bold text-gray-800 mb-4">
          Your Account Has Been Blocked
        </h2>
        <p className="text-gray-600 mb-6">
          Your account has been blocked due to a violation of our application rules.
          If you believe this is a mistake, please contact our support team at support@example.com for further assistance.
        </p>
        <Button
          className="w-full py-2 px-4 bg-blue-500 hover:bg-blue-600 text-white rounded-lg transition-all cursor-pointer"
          onClick={onClose}
        >
          Close
        </Button>
      </div>
    </div>
  );
};

export default BlockedPopup;
