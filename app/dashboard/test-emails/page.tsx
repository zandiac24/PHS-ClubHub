'use client';
import { useState } from 'react';

export default function TestEmail() {
  const [result, setResult] = useState('');
  const [loading, setLoading] = useState(false);

  const testEmail = async () => {
    setLoading(true);
    try {
      const response = await fetch('/api/cron-trigger-sem1', {
        method: 'POST',
      });
      const data = await response.json();
      setResult(JSON.stringify(data, null, 2));
    } catch (error) {
      setResult(`Error: ${error}`);
    }
    setLoading(false);
  };

  return (
    <div style={{ padding: '20px' }}>
      <h1>Test Email Sending</h1>
      <button onClick={testEmail} disabled={loading}>
        {loading ? 'Sending...' : 'Send Test Emails'}
      </button>
      <pre style={{ background: '#f0f0f0', padding: '10px', marginTop: '20px' }}>
        {result}
      </pre>
    </div>
  );
}