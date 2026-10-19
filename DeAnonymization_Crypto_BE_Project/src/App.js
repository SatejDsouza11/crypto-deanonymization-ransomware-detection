import './App.css';
import { Routes, Route } from "react-router-dom"
import Exchanges from './components/Exchanges';
import Coins from './components/Coins';
import CoinDetails from './components/CoinDetails';
import ModelPrediction from './components/ModelPrediction';

function App() {
  return (
    <Routes>
      <Route path='/' element={<Exchanges/>}  /> 
      <Route path='/coins' element={<Coins/>}/>
      <Route path='/coins/:id' element={<CoinDetails/>} />
      <Route path="/model" element={<ModelPrediction />} />

    </Routes>
  );
}

export default App;