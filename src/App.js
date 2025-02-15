import { BrowserRouter, Route, Routes } from 'react-router-dom';
import './App.css';
import Main from './pages/main';
import Login from './auth/auth'

function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path='/' element={<Main />} />
        <Route path='/auth' element={<Login />} />
      </Routes>
    </BrowserRouter>
  );
}

export default App;
