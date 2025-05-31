import { useEffect, useState } from 'react';

interface SecureWordDisplayProps {
  secureWord: string | null;
  onNext: () => void;
}

export default function SecureWordDisplay({ secureWord, onNext }: SecureWordDisplayProps) {
  const [timeLeft, setTimeLeft] = useState(60);

  useEffect(() => {
    if (timeLeft === 0) return;

    const timer = setTimeout(() => setTimeLeft(timeLeft - 1), 1000);

    return () => clearTimeout(timer);
  }, [timeLeft]);

  return (
    <section className="max-w-md mx-auto p-6 bg-white rounded-lg shadow-md flex flex-col space-y-6 text-center">
      <h2 className="text-2xl font-semibold text-gray-800">Your Secure Word</h2>

      <div className="text-lg font-mono tracking-wide text-blue-600 select-all">
        {secureWord}
      </div>

      <p className="text-sm text-gray-600">
        This secure word expires in{' '}
        <span className="font-semibold text-red-500">{timeLeft}</span> second{timeLeft !== 1 ? 's' : ''}
      </p>

      <button
        disabled={timeLeft === 0}
        onClick={onNext}
        className={`py-2 px-6 rounded font-semibold text-white transition-colors 
          ${timeLeft === 0 ? 'bg-gray-400 cursor-not-allowed' : 'bg-blue-600 hover:bg-blue-700'}`}
      >
        Next
      </button>
    </section>
  );
}
