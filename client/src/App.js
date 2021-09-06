
import './App.css';
import { CreateNFT } from './components/CreateNFT';
import { Wallet } from './components/WalletConnect';

function App() {
  return (
    <div className="App">
    <Wallet></Wallet>
    <CreateNFT></CreateNFT>
    </div>
  );
}

export default App;
