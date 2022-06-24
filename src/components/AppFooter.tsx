import { ButtonGroup, Button } from '@mui/material';
import { IButton, footerProps } from '../types/types';

const buttonsData: IButton[] = [
    {name: "all", action: ''},
    {name: "active", action: 'active'},
    {name: "done", action: 'done'}
];

const AppFooter: React.FC<footerProps> = (props: footerProps) => {
    const btns = buttonsData.map(({ name, action }) => {
            const active = action === props.sort ? "contained" : "outlined";
            return <Button key={name} variant={active} onClick={() => props.sortAction(action)} sx={{ p: '.3rem 3rem' }}>{name}</Button>});

    return (
        <footer style={{display: 'flex', justifyContent: 'center', position: 'fixed', bottom: '1rem', width: '100%'}}>
            <ButtonGroup aria-label="outlined button group">
                {btns}
            </ButtonGroup>
        </footer>
    )
}

export default AppFooter;