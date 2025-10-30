import { makeStyles } from '@mui/styles';

export const useStyles = makeStyles((theme) => ({
  card: {
    padding: theme.spacing(3),
    height: '100%',
    display: 'flex',
    flexDirection: 'column',
  },
  viewLink: {
    display: 'inline-block',
    marginTop: theme.spacing(2),
    color: theme.palette.primary.main,
    textDecoration: 'none',
    fontWeight: 500,
    fontSize: 14,
    '&:hover': {
      textDecoration: 'underline',
    },
  },
}));