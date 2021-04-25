import React, { useState, useEffect } from 'react'
import { BrowserRouter as Router, Route, useHistory } from 'react-router-dom'
import map from 'lodash/map'

import api from './apiConfig'

import './App.css'

import CssBaseline from '@material-ui/core/CssBaseline'
import Container from '@material-ui/core/Container'
import {
  createMuiTheme,
  ThemeProvider,
  makeStyles,
} from '@material-ui/core/styles'
import Button from '@material-ui/core/Button'

import { StartPage } from './components/StartPage'
import { ProductList } from './components/ProductList'
import { Cart } from './components/Cart'
import { CartProvider } from './components/CartContext'
import ScrollTopArrow from './components/ScrollTopArrow'
import { FirstNameLetters } from './components/FirstNameLetters'
import { LastNameLetters } from './components/LastNameLetters'
import { FirstNameList } from './components/FirstNameList'
import { LastNameList } from './components/LastNameList'
import { Admin } from './components/Admin'



const useStyles = makeStyles((theme) => ({
  root: {
    flexGrow: 1,
  },
  menuButton: {
    marginRight: theme.spacing(2),
  },
  title: {
    flexGrow: 1,
  },
  homeButton: {
    width: '100%',
  },
}))

const theme = createMuiTheme({
  palette: {
    primary: {
      main: '#404a86',
    },
    secondary: {
      main: '#E6324B',
    },
  },
})

const HomeButton = () => {
  const classes = useStyles()
  const history = useHistory()

  function handleClick() {
    history.push('/')
  }

  return (
    <Button
      className={classes.homeButton}
      variant="contained"
      color="primary"
      onClick={handleClick}
    >
      Palaa alkuun
    </Button>
  )
}

function App() {
  const [products, setProducts] = useState([])
  const [allNames, setAllNames] = useState([])
  const [fullNames, setFullNames] = useState([])
  const [firstNames, setFirstNames] = useState([])
  const [lastNames, setLastNames] = useState([])
  const [firstName, setFirstName] = useState('')
  const [lastName, setLastName] = useState('')

  useEffect(() => {
    console.log('Lets get users from DB')

    api.get('/allnames').then((res) => {
      setAllNames(res.data)
    })
  }, [])

  useEffect(() => {
    console.log('Lets get products from DB')

    api.get('/products').then((res) => {
      setProducts(res.data)
    })
  }, [])

  useEffect(() => {
    setFullNames(map(allNames, 'fullName'))
  }, [allNames])

  useEffect(() => {
    setFirstNames(map(allNames, 'firstName'))
  }, [allNames])

  useEffect(() => {
    setLastNames(map(allNames, 'lastName'))
  }, [allNames])


  return (
    <ThemeProvider theme={theme}>
      <div>
        <CssBaseline />
        <Router>
          <Container maxWidth="sm">
            <div>
              <HomeButton />
              <Route
                exact
                path="/"
                render={() => (
                  <StartPage
                    setFirstName={setFirstName}
                    setLastName={setLastName}
                  />
                )}
              />

              <Route
                exact
                path="/fn"
                render={() => <FirstNameLetters firstNames={firstNames} />}
              />
              <Route
                exact
                path="/ln"
                render={() => <LastNameLetters lastNames={lastNames} />}
              />
              <Route
                exact
                path="/fn/:letter"
                render={({ match }) => (
                  <FirstNameList
                    letter={match.params.letter}
                    setFirstName={setFirstName}
                    firstNames={firstNames}
                  />
                )}
              />
              <Route
                exact
                path="/ln/:letter"
                render={({ match }) => (
                  <LastNameList
                    letter={match.params.letter}
                    setLastName={setLastName}
                    lastNames={lastNames}
                  />
                )}
              />
              <Route
                exact
                path="/cart"
                render={() => (
                  <CartProvider>
                    <div>
                      <Cart
                        firstName={firstName}
                        lastName={lastName}
                        fullNames={fullNames}
                      />
                      <ProductList products={products} />
                      <ScrollTopArrow />
                    </div>
                  </CartProvider>
                )}
              />
            </div>
          </Container>

          <Container maxWidth="md">
            <div>
              <Route
                exact
                path="/admin"
                render={() => <Admin />}
              />
            </div>
          </Container>
        </Router>
      </div>
    </ThemeProvider>
  )
}

export default App
