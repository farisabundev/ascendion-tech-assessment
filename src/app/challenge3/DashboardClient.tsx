'use client';

import { useEffect, useState } from 'react';
import dayjs from 'dayjs';
import { Metadata } from 'next';

interface Transaction {
  date: string;
  referenceId: string;
  to: string;
  recipientReference: string;
  type: string;
  amount: number;
}

export default function Dashboard() {
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [transactions, setTransactions] = useState<Transaction[]>([]);

  useEffect(() => {
    async function fetchData() {
      try {
        const res = await fetch('/api/transactionHistory');

        if (!res.ok) throw new Error(`HTTP error! status: ${res.status}`);

        const data = await res.json();
        setTransactions(data);
      } catch (error) {
        console.error('Failed to fetch transactions:', error);
        setTransactions([]);
      } finally {
        setIsLoading(false)
      }
    }

    fetchData();
  }, []);

  return (
    <div className="max-w-6xl mx-auto px-4 py-8">
      <h1 className="text-2xl font-semibold text-gray-800 mb-6">Transaction History</h1>

      {isLoading ?
        <div className="p-4 text-center">Loading transactions...</div>
        :
        <div className="overflow-x-auto">
          <table className="min-w-full">
            <thead className="bg-stone-300 text-sm uppercase tracking-wider">
              <tr>
                <th className="text-left px-4 py-2">Date</th>
                <th className="text-left px-4 py-2">Reference ID</th>
                <th className="text-left px-4 py-2">To</th>
                <th className="text-left px-4 py-2">Transaction Type</th>
                <th className="text-left px-4 py-2">Amount</th>
              </tr>
            </thead>

            <tbody>
              {transactions.map((tx, index) => (
                <tr
                  key={index}
                >
                  <td className="px-4 py-3 text-sm text-gray-700">
                    {dayjs(tx.date).format('D MMM YYYY')}
                  </td>
                  <td className="px-4 py-3 text-sm text-gray-700">{tx.referenceId}</td>
                  <td className="px-4 py-3 text-sm text-gray-700">
                    <span>{tx.to}</span>
                    <div className="text-xs text-gray-400">{tx.recipientReference}</div>
                  </td>
                  <td className="px-4 py-3 text-sm text-gray-700">{tx.type}</td>
                  <td className="px-4 py-3 text-sm font-medium text-right">
                    <span>RM {tx.amount.toLocaleString()}</span>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      }

    </div>
  );
}
