import './App.css';
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom'
import HomePage from './Pages/HomePage';
import ChatPage from './Pages/ChatPage';
import { useContext } from 'react';
import UserContext from './context/User/UserContext';


function App() {
  const { user } = useContext(UserContext);

  return (
    <div className='App'>
      <BrowserRouter>
        <Routes>
          <Route path='/' element={!user.success ? <HomePage /> : <Navigate to="/chats" />} />
          <Route path='/chats' element={user.success ? <ChatPage /> : <Navigate to="/" />} />
        </Routes>
      </BrowserRouter>
    </div>
  );
}

export default App;
