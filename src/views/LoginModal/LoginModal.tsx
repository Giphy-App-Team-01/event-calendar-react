import React, { useState } from 'react';
import { forgotPassword, loginUser } from '../../services/auth-service';
import { useNavigate } from 'react-router-dom';
import { toast } from 'react-toastify';
import Button from '../../components/Button/Button';
import { getUserById } from '../../services/db-service';
import BlockedPopup from '../../components/BlockedPopup/BlockedPopup';


interface LoginModalProps {
  isOpen: boolean;
  onClose: () => void;
}

const LoginModal: React.FC<LoginModalProps> = ({ isOpen, onClose }) => {
  const [isForgotPasswordOpen, setIsForgotPasswordOpen] = useState(false);
  const [loading, setLoading] = useState(false);
  const [resetEmail, setResetEmail] = useState('');
  const [isBlockedAccount, setIsBlockedAccount] = useState(false);
  const [showBlockedPopup, setShowBlockedPopup] = useState(false);
  const [formData, setFormData] = useState({
    email: '',
    password: '',
  });
  const navigate = useNavigate();

  const handleLogin = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    try {
      setLoading(true);
      const userCredential = await loginUser(formData.email, formData.password);
      const loggedUserId = userCredential.user.uid;
      const userRecord = await getUserById(loggedUserId);

      if (userRecord?.isBlocked) {
        setIsBlockedAccount(true);
        setShowBlockedPopup(true);
        onClose();
        return;
      }

      toast.success('Login successful', { autoClose: 1000 });
      onClose();
      navigate('/my-calendar');
    } catch (error: unknown) {
      console.error(error);
      toast.error('Failed to login.');
    } finally {
      setLoading(false);
    }
  };

  const handleResetPassword = async () => {
    try {
      setLoading(true);
      await forgotPassword(resetEmail);
      toast.success('Reset link sent! Please check your email.');
      setIsForgotPasswordOpen(false);
      setResetEmail('');
    } catch (error: unknown) {
      console.error(error);
      toast.error('Failed to send reset link.');
    } finally {
      setLoading(false);
    }
  };

  if (isBlockedAccount) {
    return showBlockedPopup ? (
      <div className={`modal ${isOpen ? 'modal-open' : ''}`}>
        <BlockedPopup
          onClose={() => {
            setShowBlockedPopup(false);
            setIsBlockedAccount(false);
          }}
        />
      </div>
    ) : null;
  }

  return (
    <div className={`modal ${isOpen ? 'modal-open' : ''}`}>
      {!isForgotPasswordOpen ? (
        <div className="modal-box bg-white shadow-lg rounded-xl p-10 w-96 sm:w-[500px] md:w-[600px] lg:w-[700px] transition-transform transform scale-95 animate-fade-in">
          <h2 className="text-4xl font-semibold text-center text-gray-700 mb-8">
            Login
          </h2>

          <form className="space-y-6" onSubmit={handleLogin}>
            <div>
              <label className="block text-sm font-medium text-gray-600 mb-2">
                Email
              </label>
              <input
                type="email"
                value={formData.email}
                onChange={(e) =>
                  setFormData({ ...formData, email: e.target.value })
                }
                placeholder="Enter your email"
                className="input input-bordered w-full py-4 px-5 rounded-lg focus:ring-2 focus:ring-blue-300 bg-white text-gray-900 border-gray-300"
                required
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-600 mb-2">
                Password
              </label>
              <input
                type="password"
                placeholder="Enter your password"
                value={formData.password}
                onChange={(e) =>
                  setFormData({ ...formData, password: e.target.value })
                }
                className="input input-bordered w-full py-4 px-5 rounded-lg focus:ring-2 focus:ring-blue-300 bg-white text-gray-900 border-gray-300"
                required
              />
            </div>

            <div className="text-right">
              <Button
                className="text-blue-500 hover:underline"
                onClick={() => setIsForgotPasswordOpen(true)}
              >
                Forgot Password?
              </Button>
            </div>

            <Button
              type="submit"
              className="btn w-full py-4 text-xl font-medium rounded-lg shadow-md 
             bg-blue-500 hover:bg-blue-600 transition-all text-white
            "
            >
              {loading ? 'Loading...' : 'Login'}
            </Button>
          </form>

          <div className="modal-action flex justify-center mt-6">
            <Button
              className="btn btn-outline px-8 py-3 rounded-lg text-gray-600 border-gray-400 hover:bg-gray-200"
              onClick={onClose}
            >
              Close
            </Button>
          </div>
        </div>
      ) : (
        <div className="modal-box bg-white shadow-lg rounded-xl p-10 w-96 sm:w-[500px] md:w-[600px] lg:w-[700px]">
          <h2 className="text-3xl font-semibold text-center text-gray-700 mb-6">
            Reset Password
          </h2>
          <p className="text-gray-600 text-md text-center mb-6">
            Enter your email to receive a password reset link.
          </p>
          <input
            type="email"
            placeholder="Enter your email"
            value={resetEmail}
            onChange={(e) => setResetEmail(e.target.value)}
            className="input input-bordered w-full py-4 px-5 rounded-lg focus:ring-2 focus:ring-blue-300 bg-white text-gray-900 border-gray-300 mb-6"
            required
          />
          <Button
            onClick={handleResetPassword}
            className="btn w-full py-4 text-xl font-medium rounded-lg shadow-md bg-blue-400 hover:bg-blue-500 transition-all text-white"
          >
            {loading ? 'Sending...' : 'Send Reset Link'}
          </Button>
          <div className="modal-action flex justify-center mt-6">
            <Button
              className="btn btn-outline px-8 py-3 rounded-lg text-gray-600 border-gray-400 hover:bg-gray-200"
              onClick={() => setIsForgotPasswordOpen(false)}
            >
              Back to Login
            </Button>
          </div>
        </div>
      )}
    </div>
  );
};

export default LoginModal;