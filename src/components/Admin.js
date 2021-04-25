import React, { useState } from 'react'
import { BrowserRouter as Router, Route, NavLink } from 'react-router-dom'
import jwtDecode from 'jwt-decode'
import { createBrowserHistory } from 'history'

import { makeStyles } from '@material-ui/core/styles'
import AppBar from '@material-ui/core/AppBar'
import Toolbar from '@material-ui/core/Toolbar'
import Button from '@material-ui/core/Button'
import SyncIcon from '@material-ui/icons/Sync'

import { AdminUsers } from './AdminUsers'
import { AdminProducts } from './AdminProducts'
import { AdminReport } from './AdminReport'
import { AdminReportSplitMonth } from './AdminReportSplitMonth'
import { AdminLogin } from './AdminLogin'

import api from '../apiConfig'

const history = createBrowserHistory()

const useStyles = makeStyles((theme) => ({
  appBar: {
    marginTop: 0,
  },
  toolBar: {
    margin: 'auto',
  },
  content: {
    marginTop: 40,
  },
}))

export const Admin = (props) => {
  const classes = useStyles()
  const [adminProducts, setAdminProducts] = useState([])
  const [loggedIn, setLoggedIn] = useState(false)
  const token = localStorage.FBIdToken
  const [redirect, setRedirect] = useState(false)



  const logUserIn = () => {
    setLoggedIn(true)
    api
      .get('/products')
      .then((res) => {
        setAdminProducts(res.data)
      })
      .catch((err) => {
        console.log('Error getting product information ', err)
      })
  }

  const logUserOut = () => {
    localStorage.removeItem('FBIdToken')
    setLoggedIn(false)
    goToAdmin()
  }

  const checkIfTokenOk = () => {
    if (token) {
      const decodedToken = jwtDecode(token)
      if (decodedToken.exp * 1000 < Date.now()) {
        logUserOut()
        return false
      } else {
        return true
      }
    }

    return false
  }

  const goToAdmin = () => {
    history.push('/admin')
    setRedirect(true)
  }

  if (redirect) {
    return <AdminLogin logUserIn={logUserIn} />
  }

  if (loggedIn === true || checkIfTokenOk() === true) {
    return (
      <div>
        <Router>
          <AppBar className={classes.appBar}>
            <Toolbar className={classes.toolBar}>
              <Button color="inherit" component={NavLink} to="/admin/users">
                Users
              </Button>
              <Button color="inherit" component={NavLink} to="/admin/products">
                Products
              </Button>
              <Button color="inherit" component={NavLink} to="/admin/report">
                Report - full month
              </Button>
              <Button
                color="inherit"
                component={NavLink}
                to="/admin/reportsplitmonth"
              >
                Report - split month
              </Button>
              <Button color="inherit" onClick={logUserOut}>
                Logout
              </Button>
              <Button color="inherit" onClick={logUserIn}>
                <SyncIcon />
              </Button>
            </Toolbar>
          </AppBar>

          <div className={classes.content}>
            <Route
              exact
              path="/admin/users"
              render={() => (
                <AdminUsers
                  loggedIn={loggedIn}
                />
              )}
            />
            <Route
              exact
              path="/admin/products"
              render={() => <AdminProducts adminProducts={adminProducts} />}
            />
            <Route exact path="/admin/report" render={() => <AdminReport />} />
            <Route
              exact
              path="/admin/reportsplitmonth"
              render={() => <AdminReportSplitMonth />}
            />
          </div>
        </Router>
      </div>
    )
  } else {
    return <AdminLogin logUserIn={logUserIn} />
  }
}
