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

  // State for the real-time password checklist
  const [passwordChecks, setPasswordChecks] = useState({
    length: false,
    uppercase: false,
    lowercase: false,
    number: false,
  });

  const handlePasswordChange = (value: string) => {
    setRegPassword(value);
    setPasswordChecks({
      length: value.length >= 8,
      uppercase: /[A-Z]/.test(value),
      lowercase: /[a-z]/.test(value),
      number: /\d/.test(value),
    });
  };

  const handleRegister = async (e: React.FormEvent) => {
    e.preventDefault();
    await onRegister(regName, regEmail, regPassword);
    // Clear form and reset checks on success
    setRegName(''); 
    setRegEmail(''); 
    setRegPassword('');
    setPasswordChecks({ length: false, uppercase: false, lowercase: false, number: false });
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
            <input 
              type="text" 
              placeholder="Full Name" 
              value={regName} 
              onChange={(e) => setRegName(e.target.value)} 
              required 
              className="input" 
            />
            <input 
              type="email" 
              placeholder="Email Address" 
              value={regEmail} 
              onChange={(e) => setRegEmail(e.target.value)} 
              required 
              className="input" 
            />
            <input 
              type="password" 
              placeholder="Password" 
              value={regPassword} 
              onChange={(e) => handlePasswordChange(e.target.value)} 
              required 
              className="input" 
            />
            
            {/* Password Requirements Checklist */}
            <div className="password-requirements">
              <span className={passwordChecks.length ? 'valid' : 'invalid'}>
                {passwordChecks.length ? '✓' : '○'} At least 8 characters
              </span>
              <span className={passwordChecks.uppercase ? 'valid' : 'invalid'}>
                {passwordChecks.uppercase ? '✓' : '○'} One uppercase letter
              </span>
              <span className={passwordChecks.lowercase ? 'valid' : 'invalid'}>
                {passwordChecks.lowercase ? '✓' : '○'} One lowercase letter
              </span>
              <span className={passwordChecks.number ? 'valid' : 'invalid'}>
                {passwordChecks.number ? '✓' : '○'} One number
              </span>
            </div>

            <button 
              type="submit" 
              className="submit-btn w-full" 
              disabled={!passwordChecks.length || !passwordChecks.uppercase || !passwordChecks.lowercase || !passwordChecks.number}
            >
              Create Account
            </button>
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