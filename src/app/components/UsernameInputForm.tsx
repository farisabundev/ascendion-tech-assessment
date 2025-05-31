'use client';

import { useState } from 'react';

interface UsernameInputFormProps {
  onSubmit: (username: string) => void;
}

export default function UsernameInputForm({ onSubmit }: UsernameInputFormProps) {
  const [username, setUsername] = useState('');

  function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (!username.trim()) return alert('Please enter a username');
    onSubmit(username.trim());
  }

  return (
    <form onSubmit={handleSubmit} className="flex flex-col space-y-4 max-w-sm mx-auto p-4">
      <label htmlFor="username" className="font-semibold">
        Enter your username:
      </label>
      <input
        id="username"
        type="text"
        value={username}
        onChange={(e) => setUsername(e.target.value)}
        placeholder="Username"
        className="border border-gray-300 rounded px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
        autoComplete="username"
        required
      />
      <button
        type="submit"
        className="bg-blue-600 text-white py-2 rounded hover:bg-blue-700 transition"
      >
        Continue
      </button>
    </form>
  );
}
