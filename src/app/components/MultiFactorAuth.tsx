'use client';

import { useState } from 'react';

interface MfaInputFormProps {
  onSubmit: (code: string) => void;
}

const MultiFactorAuth = ({ onSubmit }: MfaInputFormProps) => {
  const [code, setCode] = useState('');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (code.length === 6) {
      onSubmit(code);
    } else {
      alert('Please enter a 6-digit code');
    }
  };

  return (
    <form onSubmit={handleSubmit} className="max-w-sm mx-auto p-4 flex flex-col space-y-4">
      <label htmlFor="mfaCode">Enter 6-digit MFA Code:</label>
      <input
        id="mfaCode"
        type="text"
        value={code}
        onChange={(e) => setCode(e.target.value)}
        maxLength={6}
        className="border p-2 rounded"
        required
      />
      <button type="submit" className="bg-blue-600 text-white p-2 rounded">
        Verify
      </button>
    </form>
  );
}

export default MultiFactorAuth;