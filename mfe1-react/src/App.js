import { useState, useEffect } from 'react';
import './styles.css';

export default function App() {
  const [incomingMessage, setIncomingMessage] = useState('');

  useEffect(() => {
    const handler = (e) => setIncomingMessage(e.detail);
    window.addEventListener('mfe:message', handler);
    return () => window.removeEventListener('mfe:message', handler);
  }, []);

  const sendMessage = () => {
    window.dispatchEvent(
      new CustomEvent('mfe:message', { detail: 'Hello from React MFE 1!' })
    );
  };

  return (
    <div className="container green">
      <h1>Hello World from React MFE 1</h1>
      <button onClick={sendMessage}>Send Message to MFE 2</button>
      {incomingMessage && (
        <p className="message">Received: {incomingMessage}</p>
      )}
    </div>
  );
}
