import React, { useState } from 'react'
import {
    Button,
    FormControl,
    FormHelperText,
    Grid,
    Input,
    InputLabel,
    makeStyles,
    Typography,
    withStyles,
} from '@material-ui/core'
import AppBar from '../../../components/AppBar'
import Firebase, { FirebaseContext } from '../../../components/Firebase'
import { connect } from 'react-redux'


const useStyles = makeStyles(_ => ({
    root: {
        flexGrow: 1,
        height: '100vh',
        flexDirection: 'column',
        overflowX: 'hidden',
        overflowY: 'auto',
    },
    formControl: {
        minWidth: 300,
    },
    formContainer: {
        marginTop: '2.3em',
    },
    comparisonText: {
        paddingLeft: '1em',
        lineHeight: '0.8em',
        fontFamily: 'Arimo',
    },
    container: {
        marginLeft: '1em',
    },
    select: {
        width: '15em',
    },
}))

const StyledFormControl = withStyles(() => ({
    root: {
        marginBottom: '1.3rem',
    },
}))(FormControl)

const save = (name: string,
              email: string,
              currentPassword: string,
              password: string,
              confirmPassword: string, firebase: Firebase) => {
    if (password !== confirmPassword) {
        alert('Passwords do not match')
        return;
    }

    return firebase.reauthenticate({email, password: currentPassword})
        .then(user => {
            user.updatePassword(password);
            alert("Your password has been changed!")
        })
        .catch(e => {
            console.log(e);
            alert("Unable to authenticate you. Please confirm your current password")
        });


}
/**
 * @return {ReactNode}
 */
const MyAccountPage = ({ user = { firstName: '', lastName: '', email: '' }, history }): React.ReactNode => {
    const classes = useStyles()
    const [firstName, setFirstName] = useState(`${user.firstName}`)
    const [lastName, setLastName] = useState(`${user.lastName}`)
    const [email, setEmail] = useState(user.email)
    const [currentPassword, setCurrentPassword] = useState('')
    const [password, setPassword] = useState('')
    const [confirmPassword, setConfirmPassword] = useState('')
    return <div className={classes.root}>
        <FirebaseContext.Consumer>
            {(firebase: Firebase): React.ReactNode => <AppBar firebase={firebase} />}
        </FirebaseContext.Consumer>
        <div className={classes.formContainer}>
            <Grid container
                  direction="column"
                  justify="flex-start"
                  alignItems="center"
                  style={{ width: '100vw', height: '100%', paddingTop: '1em' }}>
                <Grid item xs={9}>
                    <Typography style={{ fontSize: '2.5em' }}>
                        My Account
                    </Typography>
                </Grid>
                <Grid item xs={6} spacing={8} className={classes.container}>
                    <StyledFormControl className={classes.formControl}>
                        <InputLabel id="demo-mutiple-name-label">Name</InputLabel>
                        <Input onChange={(event: React.ChangeEvent<HTMLInputElement>) => setFirstName(event.target.value)}
                               value={firstName} placeholder={"First name"} />
                    </StyledFormControl>
                </Grid>
                <Grid item xs={6} spacing={8} className={classes.container}>
                    <StyledFormControl className={classes.formControl}>
                        <InputLabel id="demo-mutiple-name-label">Name</InputLabel>
                        <Input onChange={(event: React.ChangeEvent<HTMLInputElement>) => setLastName(event.target.value)}
                               value={lastName} placeholder={"Last name"}/>
                    </StyledFormControl>
                </Grid>
                <Grid item xs={8} spacing={8} className={classes.container}>
                    <StyledFormControl className={classes.formControl}>
                        <InputLabel id="demo-mutiple-name-label">Email</InputLabel>
                        <Input onChange={(event: React.ChangeEvent<HTMLInputElement>) => setEmail(event.target.value)}
                               value={email} />
                    </StyledFormControl>
                </Grid>
                <Grid item xs={8} spacing={8} className={classes.container}>
                    <StyledFormControl className={classes.formControl}>
                        <InputLabel id="demo-mutiple-name-label">Current Password</InputLabel>
                        <Input type="password"
                               onChange={(event: React.ChangeEvent<HTMLInputElement>) => setCurrentPassword(event.target.value)}
                               value={currentPassword} />
                    </StyledFormControl>
                </Grid>
                <Grid item xs={8} spacing={2} className={classes.container}>
                    <FormHelperText>Enter a new password twice to change your password</FormHelperText>
                </Grid>
                <Grid item xs={8} spacing={2} className={classes.container}>
                    <StyledFormControl className={classes.formControl}>
                        <InputLabel id="demo-mutiple-name-label">Password</InputLabel>
                        <Input type="password" placeholder="Password"
                               onChange={(event: React.ChangeEvent<HTMLInputElement>) => setPassword(event.target.value)}
                               value={password} />
                        <Input type="password" placeholder="Confirm"
                               onChange={(event: React.ChangeEvent<HTMLInputElement>) => setConfirmPassword(event.target.value)}
                               value={confirmPassword} />
                    </StyledFormControl>
                </Grid>
                <Grid item xs={8} spacing={2} className={classes.container}>
                    <FirebaseContext.Consumer>
                        {(firebase:Firebase) => (
                            <Button variant="contained" color="primary"
                                    onClick={(_) =>
                                        save(name, email, currentPassword, password, confirmPassword, firebase)
                                            .then(() => history.push("/Home"))}>Save</Button>)}
                    </FirebaseContext.Consumer>
                </Grid>
            </Grid>
        </div>

    </div>
}

export default connect(state => ({ user: state.coachState.user }))(MyAccountPage)