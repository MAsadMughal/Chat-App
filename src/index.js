import React from 'react';
import ReactDOM from 'react-dom/client';
import App from './App';
import { ChakraProvider } from '@chakra-ui/react'
import User from './context/User/User';
import Chats from './context/Chat/Chats';
const root = ReactDOM.createRoot(document.getElementById('root'));
root.render(
  <React.StrictMode>
    <User>
      <Chats>
        <ChakraProvider>
          <App />
        </ChakraProvider>
      </Chats>
    </User>
  </React.StrictMode >
);
