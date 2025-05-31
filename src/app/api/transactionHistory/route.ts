import { NextResponse } from 'next/server';

export async function GET() {
  const data = [
    {
      date: new Date('2024-08-24').toISOString(),
      referenceId: '12345678',
      to: 'Bloom Enterprise Ltd',
      recipientReference: 'Invoice #INV-2024-001',
      type: 'DuitNow Payment',
      amount: 1200,
    },
    {
      date: new Date('2024-08-20').toISOString(),
      referenceId: '23456789',
      to: 'Green Supplies Co.',
      recipientReference: 'PO #GS-5501',
      type: 'Online Transfer',
      amount: 870.5,
    },
    {
      date: new Date('2024-08-18').toISOString(),
      referenceId: '34567890',
      to: 'SmartTech Ltd',
      recipientReference: 'Invoice #ST-093',
      type: 'Bill Payment',
      amount: 1999,
    },
    {
      date: new Date('2024-08-15').toISOString(),
      referenceId: '45678901',
      to: 'Alpha Logistics',
      recipientReference: 'Ref #AL-7829',
      type: 'DuitNow Payment',
      amount: 425.75,
    },
    {
      date: new Date('2024-08-10').toISOString(),
      referenceId: '56789012',
      to: 'Neo Print Studio',
      recipientReference: 'Ref #NPS-204',
      type: 'Online Transfer',
      amount: 300,
    },
  ];

  return NextResponse.json(data);
}
