import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import type { SubmitEvent } from 'react';

function Register() {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState<string | null>(null);
  const navigate = useNavigate();

   async function handleSubmit(e: SubmitEvent<HTMLFormElement>) {
    e.preventDefault();
    setError(null);

    try {
      const res = await fetch('http://localhost:3001/auth/register', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ username, password }),
      });

      if (!res.ok) throw new Error('Invalid username or password');

      navigate('/login');
    } catch (err) {
      if (err instanceof Error) setError(err.message);
    }
  }

  return (
    <div>
      <h1>Register</h1>
      <form onSubmit={handleSubmit} autoComplete="off">
        <div>
          <label>
            Username
            <input value={username} onChange={(e) => setUsername(e.target.value)} required />
          </label>
        </div>
        <div>
          <label>
            Password
            <input
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              type="password"
              required
            />
          </label>
        </div>
        {error && <p>{error}</p>}
        <button type="submit">Create Account</button>
      </form>
    </div>
  );
}

export default Register;