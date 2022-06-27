import React, { useState } from 'react';
import { Backdrop, CircularProgress, Container } from '@mui/material';
import { initializeApp } from "firebase/app";
import { getFirestore, collection, addDoc, doc, deleteDoc, where, query, getDocs, updateDoc } from 'firebase/firestore';
import { useCollectionData } from 'react-firebase-hooks/firestore';

import { ITodo } from '../types/types';

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
const data = getFirestore(firebase);

const App: React.FC = () => {
  const [sort, setSort] = useState('');
  const [values, loading] = useCollectionData(collection(data, 'todos'));

  const completeTodo = async (id: number) => {
    const q = query(collection(data, 'todos'), where("id", "==", id));
    await getDocs(q)
      .then(querySnapshot => querySnapshot.forEach((item) => updateDoc(doc(data, 'todos', querySnapshot.docs[0].id), { complete: !item.data().complete })));
  }

  const removeTodo = async (id: number) => {
    const q = query(collection(data, 'todos'), where("id", "==", id));
    await getDocs(q)
      .then(querySnapshot => deleteDoc(doc(data, 'todos', querySnapshot.docs[0].id)));
  }

  const editTodo = async (id: number, value: string) => {
    const q = query(collection(data, 'todos'), where("id", "==", id));
    await getDocs(q)
      .then(querySnapshot => updateDoc(doc(data, 'todos', querySnapshot.docs[0].id), {title: value}));
  }

  const onSort = (sort: string) => {
    switch (sort) {
      case 'active':
        return values ? values.filter(item => !item.complete) as ITodo[] : null;
      case 'done':
        return values ? values.filter(item => item.complete) as ITodo[] : null;
      default:
        return values ? values.sort((a, b) => a.id - b.id) as ITodo[] : null;
    }
  }

  const sortAction = (value: string) => {
    setSort(value);
  }

  const visibleData = onSort(sort);

  if (loading) {
    return <Backdrop sx={{bgcolor: 'transparent'}} open={loading}><CircularProgress/></Backdrop>
  }

  return (
    <>
      <AppHeader />
      <Container>
        <AddTodo firebase={firebase}/>
        <TodoList todos={visibleData} completeTodo={completeTodo} removeTodo={removeTodo} editTodo={editTodo} />
      </Container>
      <AppFooter sortAction={sortAction} sort={sort} />
    </>
  );
}

export default App;
