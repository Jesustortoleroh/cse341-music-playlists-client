import { useState, useEffect, useRef, useCallback } from 'react';

interface Props {
  isOpen: boolean;
  isAuthLoading: boolean;
  onClose: () => void;
  onLogin: (provider: 'github' | 'google') => void;
  onRegister: (name: string, email: string, password: string) => Promise<void>;
  onSuccess: (message: string) => void;
}

export const AuthModal = ({
  isOpen,
  isAuthLoading,
  onClose,
  onLogin,
  onRegister,
  onSuccess
}: Props) => {
  const [isLoginView, setIsLoginView] = useState(true);
  const [regName, setRegName] = useState('');
  const [regEmail, setRegEmail] = useState('');
  const [regPassword, setRegPassword] = useState('');

  const [isSubmitting, setIsSubmitting] = useState(false);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);

  const [passwordChecks, setPasswordChecks] = useState({
    length: false,
    uppercase: false,
    lowercase: false,
    number: false
  });

  const modalRef = useRef<HTMLDivElement>(null);

  const closeModal = useCallback(() => {
    setErrorMessage(null);
    setIsLoginView(true);
    setRegName('');
    setRegEmail('');
    setRegPassword('');
    setPasswordChecks({ length: false, uppercase: false, lowercase: false, number: false });
    onClose();
  }, [onClose]);

  useEffect(() => {
    if (!isOpen) return;

    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') {
        closeModal();
      }
    };

    document.addEventListener('keydown', handleKeyDown);
    modalRef.current?.focus();

    return () => {
      document.removeEventListener('keydown', handleKeyDown);
    };
  }, [isOpen, closeModal]);

  const handlePasswordChange = (value: string) => {
    setRegPassword(value);
    setPasswordChecks({
      length: value.length >= 8,
      uppercase: /[A-Z]/.test(value),
      lowercase: /[a-z]/.test(value),
      number: /\d/.test(value)
    });
    if (errorMessage) setErrorMessage(null);
  };

  const handleRegister = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    setErrorMessage(null);

    try {
      await onRegister(regName, regEmail, regPassword);

      setRegName('');
      setRegEmail('');
      setRegPassword('');
      setPasswordChecks({ length: false, uppercase: false, lowercase: false, number: false });
      setIsLoginView(true);
      onSuccess('Account created! Please log in.');
    } catch (error: unknown) {
      console.error('Registration error:', error);
      const message =
        error instanceof Error
          ? error.message
          : 'Error creating account. The email might already be in use.';
      setErrorMessage(message);
    } finally {
      setIsSubmitting(false);
    }
  };

  if (!isOpen) return null;

  return (
    <div className="modal-overlay" onClick={closeModal}>
      <div
        className="modal-content"
        ref={modalRef}
        tabIndex={-1} // Permite que el div reciba el foco
        role="dialog"
        aria-modal="true"
        aria-labelledby="modal-title"
        onClick={(e) => e.stopPropagation()} // Evita que clics dentro del modal lo cierren
      >
        <h2 id="modal-title">{isLoginView ? 'Sign In to VibeBeat' : 'Join VibeBeat'}</h2>

        {isLoginView ? (
          <>
            <p>Choose a provider to log in:</p>
            <div className="modal-buttons">
              <button
                onClick={() => onLogin('github')}
                className="provider-btn github"
                disabled={isAuthLoading}
              >
                {isAuthLoading ? 'Redirecting...' : 'Login with GitHub'}
              </button>
              <button
                onClick={() => onLogin('google')}
                className="provider-btn google"
                disabled={isAuthLoading}
              >
                {isAuthLoading ? 'Redirecting...' : 'Login with Google'}
              </button>
            </div>
            <p className="toggle-auth">
              Don't have an account?{' '}
              <span onClick={() => setIsLoginView(false)}>Register here</span>
            </p>
          </>
        ) : (
          <form onSubmit={handleRegister} className="auth-form">
            {errorMessage && (
              <div
                role="alert"
                style={{
                  color: '#ef4444',
                  backgroundColor: 'rgba(239, 68, 68, 0.1)',
                  padding: '0.8rem',
                  borderRadius: '8px',
                  fontSize: '0.9rem',
                  textAlign: 'center',
                  border: '1px solid #ef4444'
                }}
              >
                {errorMessage}
              </div>
            )}

            <div>
              <label htmlFor="reg-name" className="sr-only">
                Full Name
              </label>
              <input
                id="reg-name"
                type="text"
                placeholder="Full Name"
                value={regName}
                onChange={(e) => setRegName(e.target.value)}
                required
                className="input"
                style={{ width: '100%' }}
              />
            </div>

            <div>
              <label htmlFor="reg-email" className="sr-only">
                Email Address
              </label>
              <input
                id="reg-email"
                type="email"
                placeholder="Email Address"
                value={regEmail}
                onChange={(e) => setRegEmail(e.target.value)}
                required
                className="input"
                style={{ width: '100%' }}
              />
            </div>

            <div>
              <label htmlFor="reg-password" className="sr-only">
                Password
              </label>
              <input
                id="reg-password"
                type="password"
                placeholder="Password"
                value={regPassword}
                onChange={(e) => handlePasswordChange(e.target.value)}
                required
                className="input"
                style={{ width: '100%' }}
              />
            </div>

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
              disabled={
                isSubmitting ||
                !regName ||
                !regEmail ||
                !passwordChecks.length ||
                !passwordChecks.uppercase ||
                !passwordChecks.lowercase ||
                !passwordChecks.number
              }
            >
              {isSubmitting ? 'Creating account...' : 'Create Account'}
            </button>
            <p className="toggle-auth">
              Already have an account? <span onClick={() => setIsLoginView(true)}>Log in here</span>
            </p>
          </form>
        )}

        <button onClick={closeModal} className="close-btn" disabled={isAuthLoading || isSubmitting}>
          Cancel
        </button>
      </div>
    </div>
  );
};
