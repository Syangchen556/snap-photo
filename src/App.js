import React from 'react';
import PhotoBooth from './components/photobooth.js'; 
import './App.css';
import './styles/global.css'; // Import the global CSS file
const logoSrc = "assets/logo/logo.png"; // Replace with the path to your logo image

function App() {
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
