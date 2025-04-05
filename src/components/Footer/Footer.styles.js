import { makeStyles } from '@mui/styles';

export const useStyles = makeStyles((theme) => ({
  footer: {
    backgroundColor: theme.palette.background.default,
    padding: theme.spacing(5, 0),
    marginTop: theme.spacing(5),
  },
  footerLinks: {
    display: 'flex',
    justifyContent: 'center',
    marginBottom: theme.spacing(3),
    flexWrap: 'wrap',
    gap: theme.spacing(3),
    [theme.breakpoints.down('sm')]: {
      gap: theme.spacing(2),
    },
  },
  socialIcons: {
    display: 'flex',
    justifyContent: 'center',
    marginBottom: theme.spacing(3),
    '& a': {
      margin: theme.spacing(0, 1),
    },
  },
}));