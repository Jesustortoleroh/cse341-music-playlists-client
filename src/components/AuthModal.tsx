import { useState } from 'react';

interface Props {
  isOpen: boolean;
  isAuthLoading: boolean;
  onClose: () => void;
  onLogin: (provider: 'github' | 'google') => void;
  onRegister: (name: string, email: string, password: string) => Promise<void>;
  onSuccess: (message: string) => void;
}

export const AuthModal = ({ isOpen, isAuthLoading, onClose, onLogin, onRegister, onSuccess }: Props) => {
  const [isLoginView, setIsLoginView] = useState(true);
  const [regName, setRegName] = useState('');
  const [regEmail, setRegEmail] = useState('');
  const [regPassword, setRegPassword] = useState('');

  const handleRegister = async (e: React.FormEvent) => {
    e.preventDefault();
    await onRegister(regName, regEmail, regPassword);
    setRegName(''); setRegEmail(''); setRegPassword('');
    setIsLoginView(true);
    onSuccess('Account created! Please log in.');
  };

  if (!isOpen) return null;

  return (
    <div className="modal-overlay">
      <div className="modal-content">
        <h2>{isLoginView ? 'Sign In to VibeBeat' : 'Join VibeBeat'}</h2>
        
        {isLoginView ? (
          <>
            <p>Choose a provider to log in:</p>
            <div className="modal-buttons">
              <button onClick={() => onLogin('github')} className="provider-btn github" disabled={isAuthLoading}>
                {isAuthLoading ? 'Redirecting...' : 'Login with GitHub'}
              </button>
              <button onClick={() => onLogin('google')} className="provider-btn google" disabled={isAuthLoading}>
                {isAuthLoading ? 'Redirecting...' : 'Login with Google'}
              </button>
            </div>
            <p className="toggle-auth">
              Don't have an account? <span onClick={() => setIsLoginView(false)}>Register here</span>
            </p>
          </>
        ) : (
          <form onSubmit={handleRegister} className="auth-form">
            <input type="text" placeholder="Full Name" value={regName} onChange={(e) => setRegName(e.target.value)} required className="input" />
            <input type="email" placeholder="Email Address" value={regEmail} onChange={(e) => setRegEmail(e.target.value)} required className="input" />
            <input type="password" placeholder="Password" value={regPassword} onChange={(e) => setRegPassword(e.target.value)} required minLength={6} className="input" />
            <button type="submit" className="submit-btn w-full">Create Account</button>
            <p className="toggle-auth">
              Already have an account? <span onClick={() => setIsLoginView(true)}>Log in here</span>
            </p>
          </form>
        )}

        <button onClick={onClose} className="close-btn" disabled={isAuthLoading}>
          Cancel
        </button>
      </div>
    </div>
  );
};