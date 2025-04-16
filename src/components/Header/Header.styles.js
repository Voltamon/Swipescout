import { makeStyles } from '@mui/styles';

export const useStyles = makeStyles((theme) => ({
  toolbar: {
    padding: theme.spacing(0, 4),
    [theme.breakpoints.down('sm')]: {
      padding: theme.spacing(0, 2),
    },
  },
  logo: {
    fontWeight: 'bold',
    color: theme.palette.primary.main,
    textDecoration: 'none',
    '& span': {
      color: theme.palette.secondary.main,
    },
  },
}));
