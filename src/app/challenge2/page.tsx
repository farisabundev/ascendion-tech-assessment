'use client';

import { useState } from 'react';
import { useRouter } from "next/navigation";
import CryptoJS from 'crypto-js';

import SecureWordDisplay from '../components/SecureWordDisplay';
import UsernameInputForm from '../components/UsernameInputForm';
import PasswordInputForm from '../components/PasswordInputForm';
import MultiFactorAuth from '../components/MultiFactorAuth';

enum StepEnum {
  USERNAME = "username",
  SECUREWORD = "secureWord",
  PASSWORD = "password",
  MFA = "mfa",
  POSTLOGIN = "postLogin",
}

export default function LoginFlow() {
  const router = useRouter();

  const [step, setStep] = useState<StepEnum>(StepEnum.USERNAME);
  const [secureWord, setSecureWord] = useState<string | null>(null);
  const [username, setUsername] = useState<string>('');
  const [token, setToken] = useState<string>('');

  const handleUsernameSubmit = async (submittedUsername: string) => {
    const res = await fetch('/api/getSecureWord', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ username: submittedUsername }),
    });
    const data = await res.json();

    if (res.ok) {
      setUsername(submittedUsername);
      setSecureWord(data.secureWord);
      setStep(StepEnum.SECUREWORD);
    } else {
      alert(data.error || 'Failed to get secure word');
    }
  }

  const handleNext = () => {
    setStep(StepEnum.PASSWORD);
  }

  const handlePasswordSubmit = async (password: string) => {
    console.log('[handlePasswordSubmit] Sending login request for user:', username);

    const hashedPassword = CryptoJS.SHA256(password).toString();

    const res = await fetch('/api/login', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        username,
        secureWord,
        hashedPassword,
      }),
    });

    const data = await res.json();

    if (res.ok) {
      setStep(StepEnum.MFA);
      setToken(data.token)
    } else {
      alert(data.error || 'Login failed');
    }
  };

  const handleMFASubmit = async (code: string) => {
    const res = await fetch('/api/verifyMfa', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ username, code }),
    });

    const data = await res.json();

    if (res.ok) {
      alert("Login successful")
      localStorage.setItem("token", token);
      router.push("/dashboard");

    } else {
      alert(data.error || 'Invalid MFA code');
    }
  };

  return (
    <div>
      {step === StepEnum.USERNAME && <UsernameInputForm onSubmit={handleUsernameSubmit} />}
      {step === StepEnum.SECUREWORD && <SecureWordDisplay secureWord={secureWord} onNext={handleNext} />}
      {step === StepEnum.PASSWORD && <PasswordInputForm onSubmit={handlePasswordSubmit} />}
      {step === StepEnum.MFA && <MultiFactorAuth onSubmit={handleMFASubmit} />}
    </div>
  );
}