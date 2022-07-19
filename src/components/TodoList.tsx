import { Backdrop, CircularProgress, List, ListItem, ListItemButton, ListItemIcon, ListItemText, Checkbox, Button, Typography, TextField, Box, Popover, Snackbar, Alert, AlertTitle, IconButton, ClickAwayListener } from "@mui/material";
import DeleteForeverIcon from '@mui/icons-material/DeleteForever';
import EditIcon from '@mui/icons-material/Edit';
import CheckIcon from '@mui/icons-material/Check';
import AddAlarmIcon from '@mui/icons-material/AddAlarm';
import AlarmOn from "@mui/icons-material/AlarmOn";
import CloseIcon from '@mui/icons-material/Close';
import MoreVertIcon from '@mui/icons-material/MoreVert';
import { useEffect, useState } from "react";
import { getFirestore, query, collection, getDocs, updateDoc, deleteDoc, doc, where } from "firebase/firestore";
import { useCollectionData } from 'react-firebase-hooks/firestore';
import { getAuth } from "firebase/auth";
import { useAuthState } from "react-firebase-hooks/auth";

import { ITodo, toDos } from '../types/types';

const TodoList: React.FC<toDos> = (props: toDos) => {
    const { firebase, sort, smallScr } = props;
    const data = getFirestore(firebase);
    const auth = getAuth(props.firebase);
    const [user] = useAuthState(auth);
    const [editMode, setEditMode] = useState(0);
    const [editValue, setEditValue] = useState('');
    const [nowTime, setNowTime] = useState(0);
    const [anchorEl, setAnchorEl] = useState<null | HTMLElement>(null);
    const [showBtns, setShowBtns] = useState<number | null>(null);
    const userId = user ? user.uid : '';
    const [values, loading] = useCollectionData(collection(data, userId));

    const popoverHandleClick = (event: React.MouseEvent<HTMLElement>) => {
        setAnchorEl(event.currentTarget);
    };

    const popoverHandleClose = () => {
        setAnchorEl(null);
    };

    useEffect(() => {
        const clock = setInterval(() => {
            setNowTime(Date.now());
        }, 10000)
        return() => clearInterval(clock);
    }, [nowTime])

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

    const todos = onSort(sort);

    if (loading) {
        return <Backdrop sx={{ bgcolor: 'transparent' }} open={loading}><CircularProgress /></Backdrop>
    }


    const completeTodo = async (id: number) => {
        const q = query(collection(data, userId), where("id", "==", id));
        await getDocs(q)
            .then(querySnapshot => querySnapshot.forEach((item) => updateDoc(doc(data, userId, querySnapshot.docs[0].id), { complete: !item.data().complete })));
    }

    const editTodo = async (id: number, value: string) => {
        const q = query(collection(data, userId), where("id", "==", id));
        await getDocs(q)
            .then(querySnapshot => updateDoc(doc(data, userId, querySnapshot.docs[0].id), { title: value }));
    }

    const setAlarm = async (id: number, date: string | number) => {
        const q = query(collection(data, userId), where("id", "==", id));
        await getDocs(q)
            .then(querySnapshot => updateDoc(doc(data, userId, querySnapshot.docs[0].id), { alarm: new Date(date).valueOf() }));
    }

    const laterAlarm = (id: number) => {
        setAlarm(id, Date.now().valueOf() + 60000);
    }

    const removeTodo = async (id: number) => {
        const q = query(collection(data, userId), where("id", "==", id));
        await getDocs(q)
            .then(querySnapshot => deleteDoc(doc(data, userId, querySnapshot.docs[0].id)));
    }

    return (
        <List sx={{ width: '100%', bgcolor: 'background.paper' }}>
            {todos && todos.length === 0 ?
                <Box sx={{
                    width: '100%',
                    height: '60vh',
                    display: 'flex',
                    justifyContent: 'center',
                    alignItems: 'center',
                    fontFamily: 'Roboto',
                    fontSize: '3rem',
                    opacity: .2,
                    userSelect: 'none'
                }} >There are no tasks</Box> : todos ?
            todos !== null ? todos.map((item: ITodo) => {
                const ItemButtons = 
                    <>
                        <Button id={'btn' + item.id} variant="outlined" sx={{ background: 'white' }} aria-describedby={'popover' + item.id} onClick={popoverHandleClick}>{item.alarm ? <AlarmOn color="warning" /> : <AddAlarmIcon />}</Button>
                        {anchorEl && anchorEl.id.slice(3) === item.id.toString() ?
                            <Popover
                                id={'pop' + item.id}
                                open={anchorEl !== null}
                                anchorEl={anchorEl}
                                onClose={popoverHandleClose}
                                anchorOrigin={{ vertical: 'bottom', horizontal: 'left', }}
                            >
                                <input
                                    type='datetime-local'
                                    style={{ padding: '1rem' }}
                                    value={item.alarm ? (new Date(item.alarm - ((new Date()).getTimezoneOffset() * 60000))).toISOString().slice(0, 16) : ''}
                                    onChange={(e) => { setAlarm(item.id, e.target.value) }}
                                />
                            </Popover>
                            : null}
                        <Button variant="outlined" sx={{ m: '0 .2rem', background: 'white' }} onClick={() => { setEditMode(item.id); setEditValue(item.title) }}><EditIcon /></Button>
                        <Button variant="outlined" sx={{ background: 'white' }} onClick={() => removeTodo(item.id)}><DeleteForeverIcon sx={{ color: "red" }} /></Button>
                    </>;

                return (
                    <ListItem
                        key={item.id}
                        disablePadding
                        divider
                        secondaryAction={
                            <>
                                {editMode === item.id ? null :
                                    smallScr ?
                                        <>
                                            {showBtns === item.id ?
                                                <ClickAwayListener onClickAway={() => setShowBtns(null)}>
                                                    <Box sx={{ display: 'inline' }}>{ItemButtons}</Box>
                                                </ClickAwayListener>
                                            : null}
                                                <IconButton onClick={() => { !showBtns || showBtns !== item.id ? setShowBtns(item.id) : setShowBtns(null) }}><MoreVertIcon /></IconButton>
                                            
                                        </>
                                    :
                                    ItemButtons
                                }
                            </>
                        }
                    >
                        {item.alarm && item.alarm <= nowTime ?
                            <Snackbar
                                anchorOrigin={{ vertical: 'top', horizontal: 'center' }}
                                open
                                key={item.id}
                                sx={{ width: '50%', mt: '-20px' }}
                            >
                                <Alert
                                    severity="warning"
                                    action={<IconButton color="inherit" size="small" aria-label="close" onClick={() => laterAlarm(item.id)}><CloseIcon /></IconButton>}
                                    sx={{ width: '100%' }}
                                >
                                    <AlertTitle>Time to do</AlertTitle>
                                    {item.title}
                                </Alert>
                            </Snackbar>
                        : null}
                        {editMode === item.id ?
                            <ClickAwayListener onClickAway={() => setEditMode(NaN)}>
                                <Box sx={smallScr ? { display: 'flex', width: '100%', pr: 0 } : { display: 'flex', width: '100%', pr: '12px' }}>
                                    <TextField
                                        sx={{ flexGrow: 1 }}
                                        value={editValue}
                                        onChange={(e) => setEditValue(e.target.value)}
                                        onKeyDown={e => {
                                            if (e.key === 'Enter') { setEditMode(NaN); editTodo(item.id, editValue) };
                                            if (e.key === 'Escape') { setEditMode(NaN) };
                                        }}
                                        autoFocus
                                    />
                                    <Button variant="outlined" sx={{ m: '0 .2rem' }} onClick={() => { setEditMode(NaN); editTodo(item.id, editValue) }}><CheckIcon /></Button>
                                </Box>
                            </ClickAwayListener>
                            :
                            <ListItemButton onClick={() => { completeTodo(item.id); setAlarm(item.id, NaN) }}>
                                <ListItemIcon>
                                    <Checkbox
                                        edge="start"
                                        checked={item.complete}
                                        tabIndex={-1}
                                        disableRipple
                                    />
                                </ListItemIcon>
                                <ListItemText
                                    sx={ smallScr ? { marginRight: 0 } : { marginRight: "200px" }}
                                    disableTypography
                                    primary={<Typography sx={{ fontSize: '1.3rem' }}>{item.title}</Typography>} />
                            </ListItemButton>
                        }
                    </ListItem>
                );
            }) : null : null}
        </List>
    );
}

export default TodoList;