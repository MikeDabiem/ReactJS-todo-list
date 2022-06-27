import React, { useState } from 'react';
import { Container } from '@mui/material';
import { initializeApp } from "firebase/app";

import AppHeader from './AppHeader';
import AppFooter from './AppFooter';
import TodoList from './TodoList';
import AddTodo from './AddTodo';

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
  const [sort, setSort] = useState('');

  const sortAction = (value: string) => {
    setSort(value);
  }

  return (
    <>
      <AppHeader />
      <Container>
        <AddTodo firebase={firebase}/>
        <TodoList firebase={firebase} sort={sort} />
      </Container>
      <AppFooter sortAction={sortAction} sort={sort} />
    </>
  );
}

export default App;
