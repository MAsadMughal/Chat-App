import React from 'react';
import ReactDOM from 'react-dom/client';
import App from './App';
import { ChakraProvider } from '@chakra-ui/react'
import User from './context/User/User';
const root = ReactDOM.createRoot(document.getElementById('root'));
root.render(
  <React.StrictMode>
    <User>
      <ChakraProvider>
        <App />
      </ChakraProvider>
    </User>
  </React.StrictMode>
);
