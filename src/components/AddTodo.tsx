import { Box, Button, TextField } from "@mui/material";
import { getFirestore, addDoc, collection } from "firebase/firestore";
import {useFormik} from 'formik';
import * as yup from 'yup';
import {ITodo, addTodo} from '../types/types';

const AddTodo: React.FC<addTodo> = (props: addTodo) => {
    const data = getFirestore(props.firebase);

    const formik = useFormik({
        initialValues: {
            id: 0,
            title: '',
            complete: false
        },
        validationSchema: yup.object({
            title: yup.string().required('You must enter a value')
        }),
        onSubmit: values => submit(values)
    });

    const submit = (values: ITodo): void => {
        values.id = Date.now();
        addTodo(values);
        formik.resetForm();
        formik.initialValues.title = '';
    }

    const addTodo = async (toDoObj: ITodo) => {
        try {
            await addDoc(collection(data, 'todos'), { id: toDoObj.id, title: toDoObj.title, complete: toDoObj.complete })
        } catch (e) {
            console.error("Error adding document: ", e);
        }
    }

    return(
        <Box sx={{ mt: '1rem', width: '100%'}}>
            <form onSubmit={formik.handleSubmit} style={{width: '100%', display: 'flex'}}>
                <TextField
                    sx={{ flexGrow: 1 }}
                    label={formik.errors.title ? <div>{formik.errors.title}</div> : "Type in what you want to do"}
                    type="text"
                    name="title"
                    value={formik.values.title}
                    onChange={formik.handleChange}
                />
                <Button variant="outlined" type="submit" sx={{ p: '0 3rem' }}>Add</Button>
            </form>
        </Box>
    )
}

export default AddTodo;