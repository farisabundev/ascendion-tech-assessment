import { useState } from 'react';

interface PasswordInputFormProps {
  onSubmit: (password: string) => void;
}

export default function PasswordInputForm({ onSubmit }: PasswordInputFormProps) {
  const [password, setPassword] = useState('');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSubmit(password);
  };

  return (
    <form onSubmit={handleSubmit} className="max-w-sm mx-auto p-4 flex flex-col space-y-4">
      <label htmlFor="password" className="font-semibold">
        Enter your password
      </label>
      <input
        type="password"
        id="password"
        value={password}
        onChange={(e) => setPassword(e.target.value)}
        className="border p-2 rounded"
        required
      />
      <button
        type="submit"
        className="bg-blue-600 text-white py-2 rounded disabled:opacity-50"
        disabled={password.length === 0}
      >
        Login
      </button>
    </form>
  );
}
