import { List, ListItem, ButtonGroup, ListItemButton, ListItemIcon, ListItemText, Checkbox, Button, Typography, TextField, Box } from "@mui/material";
import DeleteForeverIcon from '@mui/icons-material/DeleteForever';
import EditIcon from '@mui/icons-material/Edit';
import CheckIcon from '@mui/icons-material/Check';
import { ITodo, toDos } from '../types/types';
import { useState } from "react";

const TodoList: React.FC<toDos> = (props: toDos) => {
    const { todos, completeTodo, removeTodo, editTodo } = props;
    const [editMode, setEditMode] = useState(0);
    const [editValue, setEditValue] = useState('');

    return (
        <List sx={{ width: '100%', bgcolor: 'background.paper' }}>
            {todos && todos.length === 0 ?
                <Box sx={{width: '100%', height: '50vh', display: 'flex', justifyContent: 'center', alignItems: 'center', fontFamily: 'Roboto', fontSize: '3rem', opacity: .2}} >There are no tasks</Box> : todos ?
            todos !== null ? todos.map((item: ITodo) => {
                return (
                    <ListItem
                        key={item.id}
                        disablePadding
                        divider
                        secondaryAction={
                            <ButtonGroup variant="outlined" aria-label="outlined button group">
                                {editMode === item.id ? <Button onClick={() => { setEditMode(NaN); editTodo(item.id, editValue) }}><CheckIcon /></Button> :
                                    <Button onClick={() => { setEditMode(item.id); setEditValue(item.title) }}><EditIcon /></Button>}
                                <Button onClick={() => removeTodo(item.id)}><DeleteForeverIcon sx={{ color: "red" }} /></Button>
                            </ButtonGroup>
                        }
                        >
                        {editMode === item.id ?
                            <TextField
                                sx={{ width: '100%' }}
                                value={editValue}
                                onChange={(e) => setEditValue(e.target.value)}
                                onKeyDown={e => {
                                    if (e.key === 'Enter') { setEditMode(NaN); editTodo(item.id, editValue) };
                                    if (e.key === 'Escape') { setEditMode(NaN)};
                                }}
                                autoFocus
                            /> :
                        <ListItemButton onClick={() => completeTodo(item.id)}>
                            <ListItemIcon>
                                <Checkbox
                                    edge="start"
                                    checked={item.complete}
                                    tabIndex={-1}
                                    disableRipple
                                />
                            </ListItemIcon>
                            <ListItemText
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