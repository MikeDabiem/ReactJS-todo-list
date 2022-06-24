import { AppBar, Typography } from "@mui/material";

const AppHeader: React.FC = () => {
    return(
        <AppBar position="sticky" sx={{p: '.5rem 0'}}>
            <Typography variant="h3" component="h1" sx={{ flexGrow: 1, textAlign: 'center' }}>
                What To Do
            </Typography>
        </AppBar>
    )
}

export default AppHeader;