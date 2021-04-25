import React, { useState } from 'react'

import api from '../apiConfig'

import Grid from '@material-ui/core/Grid'
import { makeStyles } from '@material-ui/core/styles'
import Typography from '@material-ui/core/Typography'
import TextField from '@material-ui/core/TextField'
import Button from '@material-ui/core/Button'
import CircularProgress from '@material-ui/core/CircularProgress'

const useStyles = makeStyles((theme) => ({
  loginContainer: {
    textAlign: 'center',
  },
  title: {
    marginTop: 40,
  },
  textField: {},
  button: {
    marginTop: 20,
    position: 'relative',
  },
  proggress: {
    position: 'absolute',
  },
}))

export const AdminLogin = (props) => {
  const logUserIn = props.logUserIn
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [loading, setLoading] = useState(false)
  const [errors, setErrors] = useState({})

  const classes = useStyles()

  const handleSubmit = (e) => {
    e.preventDefault()
    setLoading(true)
    const userData = {
      email: email,
      password: password,
    }
    api
      .post('/login', userData)
      .then((res) => {
        localStorage.setItem('FBIdToken', `Bearer ${res.data.token}`)
        setLoading(false)
        logUserIn()
      })
      .catch((err) => {
        setErrors(err.response.data)
        console.log('errors ', errors)
        setLoading(false)
      })
  }

  const handleEmailChange = (e) => {
    setEmail(e.target.value)
  }

  const handlePasswordChange = (e) => {
    setPassword(e.target.value)
  }

  return (
    <Grid container className={classes.loginContainer}>
      <Grid item sm />
      <Grid item sm>
        <Typography variant="h4" className={classes.title}>
          Login
        </Typography>
        <form noValidate onSubmit={handleSubmit}>
          <TextField
            id="email"
            name="email"
            type="email"
            label="Email"
            className={classes.textField}
            value={email}
            onChange={handleEmailChange}
            fullWidth
          />
          <TextField
            id="password"
            name="password"
            type="password"
            label="Password"
            className={classes.textField}
            value={password}
            onChange={handlePasswordChange}
            fullWidth
          />
          <Button
            type="submit"
            variant="contained"
            color="primary"
            className={classes.button}
            disabled={loading}
          >
            Login
            {loading && (
              <CircularProgress
                color={'secondary'}
                className={classes.proggress}
              />
            )}
          </Button>
        </form>
      </Grid>
      <Grid item sm />
    </Grid>
  )
}
