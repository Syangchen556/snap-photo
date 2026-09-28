import React, { useState } from 'react';
import PhotoBooth from './components/photobooth.js'; 
import './App.css';
import './styles/global.css'; // Import the global CSS file
const logoSrc = "assets/logo/logo.png"; // Replace with the path to your logo image

function App() {
  const [unlocked, setUnlocked] = useState(false);
  const [pin, setPin] = useState('');
  const [error, setError] = useState('');
  const [busy, setBusy] = useState(false);

  async function unlock(event) {
    event.preventDefault();
    if (busy) return;
    setBusy(true);
    setError('');
    try {
      const response = await fetch('/api/access', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        credentials: 'same-origin',
        body: JSON.stringify({ pin }),
      });
      const result = await response.json();
      if (!response.ok || result.unlocked !== true) {
        setError(result.error || 'Could not unlock. Please try again.');
        return;
      }
      setPin('');
      setUnlocked(true);
    } catch {
      setError('Could not connect. Please try again.');
    } finally {
      setBusy(false);
    }
  }

  if (!unlocked) {
    return (
      <main className="access-screen">
        <form className="access-card" onSubmit={unlock}>
          <img src={logoSrc} alt="" width="64" />
          <h1>Snap Photo</h1>
          <p>Enter your PIN to open the photo booth.</p>
          <label htmlFor="access-pin">Access PIN</label>
          <input id="access-pin" type="password" autoComplete="current-password"
            autoFocus required maxLength={128} value={pin}
            onChange={event => setPin(event.target.value)}
            aria-describedby={error ? 'access-error' : undefined}
            aria-invalid={Boolean(error)} disabled={busy} />
          {error && <p id="access-error" className="access-error" role="alert">{error}</p>}
          <button type="submit" disabled={busy || !pin}>{busy ? 'Unlocking…' : 'Unlock photo booth'}</button>
        </form>
      </main>
    );
  }
  return (
    <div className="App" style={{
      minHeight: '180vh', 
      display: 'flex',
      flexDirection: 'column',
      alignItems: 'center',
    }}>
      <div style ={{
        width: '100%',
        maxWidth: 1200,
        display: 'flex',
        alignItems: 'center',
        gap: 12,
        padding: "20px 32px"
      }}>
        <img src={logoSrc} alt="Logo" style={{ width: 50 }} />
        <h1 style={{
          fontFamily: "CantikaCute",
          color: "#541d51",
          margin: 0
        }}>
          Snap Photo
        </h1>
      </div>
      <div styles={{
        flex: 1,
        width: '100%',
        display: 'flex',
        justifyContent: 'center',
        alignItems: 'center',
        paddingBottom: "40px",
      }}>
      <PhotoBooth />
      </div>
    </div>
  );
}

export default App;
