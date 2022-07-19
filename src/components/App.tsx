import React, { useState } from 'react';
import { Backdrop, CircularProgress, Container, useMediaQuery } from '@mui/material';
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import { initializeApp } from "firebase/app";
import { getAuth } from 'firebase/auth';
import { useAuthState } from 'react-firebase-hooks/auth';

import AppHeader from './AppHeader';
import AppFooter from './AppFooter';
import TodoList from './TodoList';
import AddTodo from './AddTodo';
import LoginPage from './LoginPage';
import NewUserPage from './NewUserPage';

const firebaseConfig = {
  apiKey: "AIzaSyCEKL1hRH9O74oJvML5QDB1UEqY4KnQQTc",
  authDomain: "to-do-list-461f6.firebaseapp.com",
  projectId: "to-do-list-461f6",
  storageBucket: "to-do-list-461f6.appspot.com",
  messagingSenderId: "788701098307",
  appId: "1:788701098307:web:9d8a408124d2ff1711bff6"
};

const firebase = initializeApp(firebaseConfig);

const App: React.FC = () => {
  const auth = getAuth(firebase);
  const [user, loading] = useAuthState(auth);
  const [sort, setSort] = useState('');
  const smallScr = useMediaQuery('(max-width: 640px)');


  const sortAction = (value: string) => {
    setSort(value);
  }

  if (loading) {
    return <Backdrop sx={{ bgcolor: 'transparent' }} open={loading}><CircularProgress /></Backdrop>
  }


  return (
    <BrowserRouter>
      <Routes>
        { user ?
          <Route path="/" element={
            <>
              <AppHeader firebase={firebase} />
              <Container>
                <AddTodo firebase={firebase} />
                <TodoList firebase={firebase} sort={sort} smallScr={smallScr} />
              </Container>
              <AppFooter sortAction={sortAction} sort={sort} smallScr={smallScr} />
            </>
          }/>
          :
          <Route path="/" element={<LoginPage firebase={firebase} />} />
        }
        <Route path="signup" element={<NewUserPage firebase={firebase} />} />
      </Routes>
    </BrowserRouter>
  )
}

export default App;
