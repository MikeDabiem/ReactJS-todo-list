import { getAuth, signInWithEmailAndPassword } from "firebase/auth";
import { loginProps } from "../types/types";
import { useFormik } from "formik";
import * as yup from 'yup';
import { Box, TextField, Button, Paper } from "@mui/material";
import { Link } from "react-router-dom";
import { useEffect, useState } from "react";

const LoginPage: React.FC<loginProps> = (props: loginProps) => {
    const auth = getAuth(props.firebase);
    const [error, setError] = useState('');

    const login = (email: string, password: string) => {
        signInWithEmailAndPassword(auth, email, password)
            .catch((error) => {
                setError(error.code);
            })
    }

    useEffect(() => {
        setTimeout(() => {
            setError('');
        }, 2000)
    }, [error])

    const formik = useFormik({
        initialValues: { email: '', password: '' },
        validationSchema: yup.object({
            email: yup.string()
                .email('Wrong email adress')
                .required('Enter your e-mail'),
            password: yup.string()
                .min(6, 'Minimum 6 symbols')
                .required('Enter your password'),
        }),
        onSubmit: (values) => {
            login(values.email, values.password);
            formik.resetForm();
        }
    })

    return (
        <>
        <Link to={"/signup"}><Button sx={{ position: 'absolute', right: '30px', top: '10px' }}>Sign Up</Button></Link>
        <Box sx={{ height: '100vh', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                {error ? 
                    <Paper elevation={3} sx={{fontFamily: 'Roboto', fontSize: '3rem', p: '3rem'}}>{error}</Paper>
                :
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
                        <Button variant="contained" type="submit" sx={{ mt: '10px', p: '12px 0' }}>Log In</Button>
                    </Paper>
                </form>}
            </Box>
        </>
    )
}

export default LoginPage;