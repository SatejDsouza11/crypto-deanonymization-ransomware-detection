// import React, { useState } from 'react';

// const ModelPrediction = () => {
//   const [txHash, setTxHash] = useState('');
//   const [result, setResult] = useState(null);
//   const [error, setError] = useState(null);
//   const [loading, setLoading] = useState(false);

//   const handleSubmit = async (e) => {
//     e.preventDefault();
//     setLoading(true);
//     setError(null);
//     setResult(null);

//     try {
//       const response = await fetch('http://127.0.0.1:5000/predict', {
//         method: 'POST',
//         headers: { 'Content-Type': 'application/json' },
//         body: JSON.stringify({ transaction_hash: txHash }),
//       });

//       if (!response.ok) {
//         const errData = await response.json();
//         throw new Error(errData.error || 'Prediction failed');
//       }

//       const data = await response.json();
//       setResult(data);
//     } catch (err) {
//       setError(err.message);
//     } finally {
//       setLoading(false);
//     }
//   };

//   return (
//     <div className="p-4">
//       <h2 className="text-2xl font-bold mb-4">Transaction Hash Prediction</h2>
//       <form onSubmit={handleSubmit} className="mb-4">
//         <input
//           type="text"
//           placeholder="Enter transaction hash"
//           value={txHash}
//           onChange={(e) => setTxHash(e.target.value)}
//           className="border rounded p-2 w-full mb-2"
//         />
//         <button type="submit" className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700">
//           Predict
//         </button>
//       </form>
//       {loading && <p>Loading...</p>}
//       {error && <p className="text-red-600">{error}</p>}
//       {result && (
//         <div className="bg-gray-100 p-4 rounded shadow">
//           <p><strong>Transaction Hash:</strong> {result.transaction_hash}</p>
//           <p><strong>Label:</strong> {result.label}</p>
//           <p><strong>Normal:</strong> {result.probability.Normal.toFixed(4)}</p>
//           <p><strong>Suspicious:</strong> {result.probability.Suspicious.toFixed(4)}</p>
//         </div>
//       )}
//     </div>
//   );
// };

// export default ModelPrediction;











//current


import React, { useState, useEffect } from 'react';

const ModelPrediction = () => {
  const [txHash, setTxHash] = useState('');
  const [result, setResult] = useState(null);
  const [error, setError] = useState(null);
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError(null);
    setResult(null);

    try {
      const response = await fetch('http://127.0.0.1:5000/predict', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ transaction_hash: txHash }),
      });

      if (!response.ok) {
        const errData = await response.json();
        throw new Error(errData.error || 'Prediction failed');
      }

      const data = await response.json();
      setResult(data);
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    const canvas = document.getElementById('particle-canvas');
    const ctx = canvas.getContext('2d');
    canvas.width = window.innerWidth;
    canvas.height = window.innerHeight;

    const particles = [];
    for (let i = 0; i < 100; i++) {
      particles.push({
        x: Math.random() * canvas.width,
        y: Math.random() * canvas.height,
        radius: Math.random() * 2 + 1,
        color: `hsl(${Math.random() * 60 + 180}, 100%, 70%)`,
        speedX: (Math.random() - 0.5) * 2,
        speedY: (Math.random() - 0.5) * 2,
        life: Math.random() * 200,
      });
    }

    function drawParticles() {
      ctx.clearRect(0, 0, canvas.width, canvas.height);
      particles.forEach((p, i) => {
        ctx.beginPath();
        ctx.arc(p.x, p.y, p.radius, 0, Math.PI * 2);
        ctx.fillStyle = p.color;
        ctx.fill();
        ctx.shadowBlur = 8;
        ctx.shadowColor = p.color;
        p.x += p.speedX;
        p.y += p.speedY;
        p.life--;
        if (p.life <= 0 || p.x < 0 || p.x > canvas.width || p.y < 0 || p.y > canvas.height) {
          particles[i] = {
            x: Math.random() * canvas.width,
            y: Math.random() * canvas.height,
            radius: Math.random() * 2 + 1,
            color: `hsl(${Math.random() * 60 + 180}, 100%, 70%)`,
            speedX: (Math.random() - 0.5) * 2,
            speedY: (Math.random() - 0.5) * 2,
            life: 200,
          };
        }
        for (let j = i + 1; j < particles.length; j++) {
          const p2 = particles[j];
          const dist = Math.hypot(p.x - p2.x, p.y - p2.y);
          if (dist < 80) {
            ctx.beginPath();
            ctx.moveTo(p.x, p.y);
            ctx.lineTo(p2.x, p2.y);
            ctx.strokeStyle = `rgba(0, 255, 255, ${1 - dist / 80})`;
            ctx.stroke();
          }
        }
      });
      requestAnimationFrame(drawParticles);
    }
    drawParticles();
  }, []);

  return (
    <div style={{
      minHeight: '100vh',
      background: 'linear-gradient(135deg, #0a001a, #2a1a4e, #0f0c29)',
      display: 'flex',
      justifyContent: 'center',
      alignItems: 'center',
      padding: '40px',
      fontFamily: "'Orbitron', sans-serif",
      position: 'relative',
      overflow: 'hidden'
    }}>
      <canvas id="particle-canvas" style={{ position: 'absolute', top: 0, left: 0, zIndex: 0 }} />
      <div style={{
        position: 'absolute',
        top: 0,
        left: 0,
        width: '100%',
        height: '100%',
        background: 'radial-gradient(circle, rgba(0, 255, 255, 0.15) 0%, transparent 70%)',
        zIndex: 1,
        animation: 'pulse 12s infinite'
      }} />
      <div style={{
        background: 'rgba(10, 0, 20, 0.95)',
        borderRadius: '24px',
        padding: '48px',
        width: '100%',
        maxWidth: '900px',
        boxShadow: '0 0 50px rgba(0, 255, 255, 0.6), 0 0 100px rgba(255, 0, 255, 0.4)',
        position: 'relative',
        zIndex: 2,
        animation: 'float 5s ease-in-out infinite'
      }}>
        <h2 style={{
          fontSize: '3.5rem',
          fontWeight: '900',
          color: '#00ffff',
          textAlign: 'center',
          marginBottom: '32px',
          textShadow: '0 0 20px #00ffff, 0 0 40px #ff00ff',
          letterSpacing: '3px',
          animation: 'textPulse 2.5s infinite'
        }}>
          Crypto Transaction Analyzer
        </h2>
        <div style={{
          display: 'flex',
          justifyContent: 'center',
          gap: '16px',
          marginBottom: '32px'
        }}>
          <img src="https://cdn.iconscout.com/icon/free/png-256/blockchain-2752088-2284905.png" style={{
            width: '48px',
            height: '48px',
            filter: 'drop-shadow(0 0 8px #00ffff)',
            animation: 'spin 10s linear infinite'
          }} alt="Blockchain Icon" />
          <img src="https://cdn.iconscout.com/icon/free/png-256/wallet-2752090-2284907.png" style={{
            width: '48px',
            height: '48px',
            filter: 'drop-shadow(0 0 8px #ff00ff)',
            animation: 'bounce 2.5s infinite'
          }} alt="Wallet Icon" />
          <img src="https://cdn.iconscout.com/icon/free/png-256/bitcoin-2752089-2284906.png" style={{
            width: '48px',
            height: '48px',
            filter: 'drop-shadow(0 0 8px #00ff00)',
            animation: 'float 3.5s ease-in-out infinite'
          }} alt="Coin Icon" />
        </div>
        <form onSubmit={handleSubmit} style={{ marginBottom: '32px' }}>
          <div style={{
            position: 'relative',
            marginBottom: '24px'
          }}>
            <input
              type="text"
              placeholder="Enter Transaction Hash"
              value={txHash}
              onChange={(e) => setTxHash(e.target.value)}
              style={{
                width: '100%',
                padding: '16px',
                borderRadius: '12px',
                border: '2px solid #00ffff',
                background: 'rgba(0, 255, 255, 0.1)',
                fontSize: '1.2rem',
                color: '#fff',
                transition: 'all 0.3s ease',
                outline: 'none',
                boxShadow: '0 0 12px rgba(0, 255, 255, 0.5)',
                boxSizing: 'border-box',
                overflowWrap: 'break-word',
                wordBreak: 'break-all'
              }}
              onFocus={(e) => {
                e.target.style.boxShadow = '0 0 24px #00ffff, 0 0 48px #ff00ff';
                e.target.style.borderColor = '#ff00ff';
              }}
              onBlur={(e) => {
                e.target.style.boxShadow = '0 0 12px rgba(0, 255, 255, 0.5)';
                e.target.style.borderColor = '#00ffff';
              }}
            />
          </div>
          <button
            type="submit"
            style={{
              width: '100%',
              padding: '16px',
              background: 'linear-gradient(90deg, #ff00ff, #00ffff)',
              color: '#000',
              borderRadius: '12px',
              fontSize: '1.5rem',
              fontWeight: '700',
              border: 'none',
              cursor: 'pointer',
              transition: 'all 0.3s ease',
              boxShadow: '0 0 16px #ff00ff',
              animation: 'buttonPulse 2s infinite'
            }}
            onMouseEnter={(e) => {
              e.target.style.transform = 'scale(1.05)';
              e.target.style.boxShadow = '0 0 32px #00ffff, 0 0 64px #ff00ff';
            }}
            onMouseLeave={(e) => {
              e.target.style.transform = 'scale(1)';
              e.target.style.boxShadow = '0 0 16px #ff00ff';
            }}
          >
            Analyze
          </button>
        </form>
        {loading && (
          <div style={{
            display: 'flex',
            justifyContent: 'center',
            alignItems: 'center',
            gap: '12px',
            color: '#00ffff',
            fontSize: '1.2rem',
            fontWeight: '500'
          }}>
            <div style={{
              width: '32px',
              height: '32px',
              border: '4px solid #00ffff',
              borderTop: '4px solid transparent',
              borderRadius: '50%',
              animation: 'spin 0.8s linear infinite'
            }}></div>
            <p>Mining Transaction Data...</p>
          </div>
        )}
        {error && (
          <p style={{
            color: '#ff5555',
            background: 'rgba(255, 85, 85, 0.2)',
            padding: '12px',
            borderRadius: '8px',
            fontSize: '1rem',
            textAlign: 'center',
            marginTop: '16px',
            animation: 'shake 0.5s'
          }}>
            {error}
          </p>
        )}
        {result && (
          <div style={{
            background: 'rgba(20, 0, 40, 0.9)',
            padding: '24px',
            borderRadius: '16px',
            boxShadow: '0 0 24px rgba(0, 255, 255, 0.4)',
            color: '#fff',
            animation: 'fadeIn 1s ease-in'
          }}>
            <p style={{ marginBottom: '12px', fontSize: '1.1rem' }}>
              <strong>Hash:</strong> <span style={{ color: '#ff00ff', wordBreak: 'break-all', display: 'block', maxWidth: '100%' }}>{result.transaction_hash}</span>
            </p>
            <p style={{ marginBottom: '12px', fontSize: '1.1rem' }}>
              <strong>Label:</strong> <span style={{ color: '#00ffff' }}>{result.label}</span>
            </p>
            <div style={{ display: 'flex', justifyContent: 'center', margin: '24px 0' }}>
              <div className="radial-chart" style={{
                width: '250px',
                height: '250px',
                position: 'relative'
              }}>
                <div className="radial-bar" style={{
                  position: 'absolute',
                  width: '100%',
                  height: '100%',
                  background: `conic-gradient(#00ff00 0% ${result.probability.Normal * 100}%, #ff0000 ${result.probability.Normal * 100}% 100%)`,
                  borderRadius: '50%',
                  animation: 'grow 1.5s ease-out forwards',
                  boxShadow: '0 0 20px rgba(0, 255, 255, 0.5)'
                }} />
                <div className="radial-center" style={{
                  position: 'absolute',
                  width: '200px',
                  height: '200px',
                  background: 'rgba(10, 0, 20, 0.9)',
                  borderRadius: '50%',
                  top: '50%',
                  left: '50%',
                  transform: 'translate(-50%, -50%)',
                  display: 'flex',
                  justifyContent: 'center',
                  alignItems: 'center',
                  color: '#00ffff',
                  fontSize: '1.5rem',
                  textShadow: '0 0 10px #00ffff'
                }}>
                  {result.label}
                </div>
                <div className="label normal" style={{
                  position: 'absolute',
                  top: '20%',
                  left: '50%',
                  transform: 'translate(-50%, -50%)',
                  fontSize: '1rem',
                  color: '#00ff00',
                  textShadow: '0 0 8px #00ff00'
                }}>
                  Normal: {(result.probability.Normal * 100).toFixed(2)}%
                </div>
                <div className="label suspicious" style={{
                  position: 'absolute',
                  bottom: '20%',
                  left: '50%',
                  transform: 'translate(-50%, 50%)',
                  fontSize: '1rem',
                  color: '#ff0000',
                  textShadow: '0 0 8px #ff0000'
                }}>
                  Suspicious: {(result.probability.Suspicious * 100).toFixed(2)}%
                </div>
              </div>
            </div>
            <div className="legend" style={{
              display: 'flex',
              justifyContent: 'center',
              gap: '24px',
              marginTop: '16px'
            }}>
              <div style={{ display: 'flex', alignItems: 'center', animation: 'slideIn 1s ease' }}>
                <div style={{ width: '16px', height: '16px', background: '#00ff00', marginRight: '8px', borderRadius: '4px' }} />
                <p>Normal: {(result.probability.Normal * 100).toFixed(2)}%</p>
              </div>
              <div style={{ display: 'flex', alignItems: 'center', animation: 'slideIn 1s ease 0.2s' }}>
                <div style={{ width: '16px', height: '16px', background: '#ff0000', marginRight: '8px', borderRadius: '4px' }} />
                <p>Suspicious: {(result.probability.Suspicious * 100).toFixed(2)}%</p>
              </div>
            </div>
            <div className="insights" style={{
              marginTop: '24px',
              padding: '16px',
              background: 'rgba(0, 255, 255, 0.1)',
              borderLeft: '4px solid #ff00ff',
              color: '#fff',
              fontSize: '0.9rem',
              fontFamily: "'Courier New', monospace"
            }}>
              <strong>Crypto Insights:</strong><br />
              - High gas fees might indicate priority transactions.<br />
              - Multiple small outputs could signal mixing attempts.<br />
              - Always cross-check with blockchain explorers like [Etherscan](https://etherscan.io).
            </div>
          </div>
        )}
      </div>
      <style>
        {`
          @keyframes float {
            0%, 100% { transform: translateY(0); }
            50% { transform: translateY(-20px); }
          }
          @keyframes pulse {
            0% { opacity: 0.7; }
            50% { opacity: 0.3; }
            100% { opacity: 0.7; }
          }
          @keyframes textPulse {
            0% { text-shadow: 0 0 15px #00ffff; }
            50% { text-shadow: 0 0 30px #ff00ff; }
            100% { text-shadow: 0 0 15px #00ffff; }
          }
          @keyframes spin {
            to { transform: rotate(360deg); }
          }
          @keyframes bounce {
            0%, 100% { transform: translateY(0); }
            50% { transform: translateY(-10px); }
          }
          @keyframes buttonPulse {
            0% { box-shadow: 0 0 15px #ff00ff; }
            50% { box-shadow: 0 0 30px #00ffff; }
            100% { box-shadow: 0 0 15px #ff00ff; }
          }
          @keyframes shake {
            0%, 100% { transform: translateX(0); }
            25% { transform: translateX(-8px); }
            75% { transform: translateX(8px); }
          }
          @keyframes fadeIn {
            from { opacity: 0; transform: translateY(15px); }
            to { opacity: 1; transform: translateY(0); }
          }
          @keyframes grow {
            from { transform: scale(0); }
            to { transform: scale(1); }
          }
          @keyframes slideIn {
            from { transform: translateX(-15px); opacity: 0; }
            to { transform: translateX(0); opacity: 1; }
          }
          body {
            margin: 0;
            font-family: 'Orbitron', sans-serif;
          }
        `}
      </style>
    </div>
  );
};

export default ModelPrediction;






















