import React from 'react'
import logo from './logo.png'
import { makeStyles } from '@material-ui/core/styles'

const useStyles = makeStyles({
  logoCenter: {
    // display: "flex",
    marginLeft: 'auto',
    marginRight: 'auto',
    marginBottom: 20,
    textAlign: 'center'
  }
})

export const Logo = () => {
  const classes = useStyles()

  return (
    <div className={classes.logoCenter}>
      <img src={logo} alt="Logo" />
    </div>
  )
}
