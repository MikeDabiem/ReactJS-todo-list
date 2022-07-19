import { AppBar, Typography, Button } from "@mui/material";
import { getAuth, signOut } from 'firebase/auth';
import { useAuthState } from 'react-firebase-hooks/auth';

import { loginProps } from "../types/types";

const AppHeader: React.FC<loginProps> = (props: loginProps) => {
    const auth = getAuth(props.firebase);
    const [user] = useAuthState(auth);

    const logout = () => {
        signOut(auth);
    }

    return(
        <AppBar position="sticky" sx={{ flexDirection: 'row', alignItems: 'center', p: '.5rem 1.5rem' }}>
            { user ? <Typography>Hello, {user.displayName}</Typography> : null}
            <Typography variant="h3" component="h1" sx={{ flexGrow: 1, textAlign: 'center' }}>
                What To Do
            </Typography>
            {user ? <Button onClick={logout} sx={{ color: "#fff" }}>Log Out</Button> : null }
        </AppBar>
    )
}

export default AppHeader;