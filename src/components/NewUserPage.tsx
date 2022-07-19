import { getAuth, createUserWithEmailAndPassword, updateProfile } from "firebase/auth";
import { useFormik } from 'formik';
import * as yup from 'yup';
import { loginProps } from "../types/types";
import { Box, TextField, Button, Paper } from "@mui/material";
import { Link, Navigate } from "react-router-dom";
import { useAuthState } from "react-firebase-hooks/auth";

const NewUserPage: React.FC<loginProps> = (props: loginProps) => {
    const auth = getAuth(props.firebase);
    const [user] = useAuthState(auth);


    const createUser = (email: string, password: string, name: string) => {
        createUserWithEmailAndPassword(auth, email, password)
            .then((userCredential) => {
                updateProfile(userCredential.user, { displayName: name });
            })
            .catch((e) => {
                console.log(e.message);
            })
    }

    const formik = useFormik({
        initialValues: { email: '', password: '', name: '' },
            validationSchema: yup.object({
                email: yup.string()
                    .email('Wrong email adress')
                    .required('Enter your e-mail'),
                    password: yup.string()
                    .min(6, 'Minimum 6 symbols')
                    .required('Password is required'),
                    name: yup.string()
                    .min(2, 'Minimum 2 symbols')
                    .required('Enter your name')
                }),
            onSubmit: (values) => {
                createUser(values.email, values.password, values.name);
                formik.resetForm();
            }
        })
    return(
        <>
            <Link to={"/"}>
                <Button sx={{ position: 'absolute', right: '30px', top: '10px' }}>Log In</Button>
            </Link>
            <Box sx={{ height: '100vh', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                <form onSubmit={formik.handleSubmit} style={{ width: '500px' }}>
                    <Paper
                        elevation={3}
                        sx={{
                            display: 'flex',
                            flexDirection: 'column',
                            gap: '.5rem',
                            maxWidth: '100%',
                            p: '15px'
                        }}
                    >
                        <TextField label={formik.errors.email ? <div>{formik.errors.email}</div> : 'E-Mail'} type="email" name="email" value={formik.values.email} onChange={formik.handleChange} />
                        <TextField label={formik.errors.password ? <div>{formik.errors.password}</div> : 'Password'} type="password" name="password" value={formik.values.password} onChange={formik.handleChange} />
                        <TextField label={formik.errors.name ? <div>{formik.errors.name}</div> : 'Your name'} type="text" name="name" value={formik.values.name} onChange={formik.handleChange} />
                        <Button variant="contained" type="submit" sx={{ mt: '10px', p: '12px 0' }}>Sign Up</Button>
                    </Paper>
                </form>
            </Box>
            {user ? <Navigate to="/" /> : null}
        </>
    )
}

export default NewUserPage;