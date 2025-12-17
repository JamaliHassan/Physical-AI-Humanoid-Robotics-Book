import React, { useEffect } from 'react';
import { useUserContext } from '../../context/UserContext';
import SigninForm from './SigninForm';
import SignupForm from './SignupForm';

interface AuthModalProps {
  isOpen: boolean;
  onClose: () => void;
}

const AuthModal: React.FC<AuthModalProps> = ({ isOpen, onClose }) => {
  const [isSignup, setIsSignup] = React.useState(false);
  const { user } = useUserContext();

  // Close modal when user is authenticated
  useEffect(() => {
    if (user && isOpen) {
      onClose();
    }
  }, [user, isOpen, onClose]);

  // Close modal on escape key press
  useEffect(() => {
    const handleEscape = (e: KeyboardEvent) => {
      if (e.key === 'Escape' && isOpen) {
        onClose();
      }
    };

    if (isOpen) {
      document.addEventListener('keydown', handleEscape);
      // Prevent body scroll when modal is open
      document.body.style.overflow = 'hidden';
    }

    return () => {
      document.removeEventListener('keydown', handleEscape);
      // Restore body scroll when modal closes
      document.body.style.overflow = '';
    };
  }, [isOpen, onClose]);

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center">
      {/* Backdrop with blur effect */}
      <div
        className="fixed inset-0 bg-black bg-opacity-50 backdrop-blur-sm"
        onClick={onClose}
      />

      {/* Modal content */}
      <div className="relative z-10 bg-white rounded-lg shadow-xl p-6 w-full max-w-md mx-4">
        <div className="flex justify-between items-center mb-4">
          <h2 className="text-2xl font-bold">
            {isSignup ? 'Create Account' : 'Sign In'}
          </h2>
          <button
            onClick={onClose}
            className="text-gray-500 hover:text-gray-700 text-2xl"
            aria-label="Close modal"
          >
            &times;
          </button>
        </div>

        <div className="mb-4">
          <button
            onClick={() => setIsSignup(!isSignup)}
            className="text-blue-600 hover:text-blue-800 font-medium"
          >
            {isSignup
              ? 'Already have an account? Sign in'
              : "Don't have an account? Sign up"}
          </button>
        </div>

        {isSignup ? <SignupForm /> : <SigninForm />}
      </div>
    </div>
  );
};

export default AuthModal;