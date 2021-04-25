import React, { useContext, useState } from 'react'
import shortid from 'shortid'
import { createBrowserHistory } from 'history'
import { Redirect } from 'react-router'

import api from '../apiConfig'

import { CartContext } from './CartContext'

import Button from '@material-ui/core/Button'
import { makeStyles } from '@material-ui/core/styles'
import Card from '@material-ui/core/Card'
import CardActions from '@material-ui/core/CardActions'
import CardContent from '@material-ui/core/CardContent'
import Typography from '@material-ui/core/Typography'
import Dialog from '@material-ui/core/Dialog'
import ListItemText from '@material-ui/core/ListItemText'
import ListItem from '@material-ui/core/ListItem'
import List from '@material-ui/core/List'
import AppBar from '@material-ui/core/AppBar'
import Toolbar from '@material-ui/core/Toolbar'
import IconButton from '@material-ui/core/IconButton'
import CloseIcon from '@material-ui/icons/Close'
import Slide from '@material-ui/core/Slide'
import DialogActions from '@material-ui/core/DialogActions'
import DialogContent from '@material-ui/core/DialogContent'
import DialogContentText from '@material-ui/core/DialogContentText'
import DialogTitle from '@material-ui/core/DialogTitle'
import CircularProgress from '@material-ui/core/CircularProgress'

const history = createBrowserHistory()

const useStyles = makeStyles((theme) => ({
  card: {
    textAlign: 'left',
    marginTop: 10,
  },
  title: {
    fontSize: 18,
  },
  body: {
    fontSize: 16,
  },
  pos: {
    marginBottom: 12,
  },
  button: {
    fontSize: 16,
  },
  cardaction: {
    justifyContent: 'center',
    marginBottom: 10,
    marginTop: 0,
  },
  appBar: {
    position: 'relative',
  },
  proggress: {
    position: 'absolute',
  },
}))

const Transition = React.forwardRef(function Transition(props, ref) {
  return <Slide direction="up" ref={ref} {...props} />
})

export const Cart = ({ firstName, lastName, fullNames }) => {
  const [cart] = useContext(CartContext)
  const [openDialog, setOpenDialog] = useState(false)
  const [openAlert, setOpenAlert] = useState(false)
  const [alertSubject, setAlertSubject] = useState('Oletusotsikko')
  const [alertText, setAlertText] = useState('Oletusteksti')
  const [redirect, setRedirect] = useState(false)
  const [loading, setLoading] = useState(false)

  const totalPrice = cart.reduce((acc, curr) => acc + curr.price, 0)

  const classes = useStyles()

  const doesNameExist = () => {
    let firstAndLastName = firstName + ' ' + lastName
    return fullNames.includes(firstAndLastName)
  }

  const handleClickOpenDialog = () => {
    if (cart.length === 0) {
      console.log('Ostoskori tyhjä')
      return null
    }

    if (doesNameExist() === false) {
      setAlertSubject('Nimeä ei löytynyt')
      setAlertText(`Nimeä ${
        firstName + ' ' + lastName
      } ei löytynyt järjestelmästä. Painamalla "ALKUUN" voit aloittaa alusta, 20s kuluttua palataan alkuun automaattisesti. 
        Mikäli olet valinnut nimesi oikein ja tämä herja tulee silti niin merkkaa ostoksesi vieressä olevaan listaan. Ilmoita henkilökunnalle ettei nimeäsi löytynyt järjestelmästä, kiitos.`)
      setOpenAlert(true)

      setTimeout(() => {
        backToBeginning()
      }, 20000)
      return null
    }

    setOpenDialog(true)
  }

  const handleCloseDialog = () => {
    setOpenDialog(false)
  }

  const handleCloseAlert = () => {
    setOpenAlert(false)
    backToBeginning()
  }

  const savePurchases = () => {
    setLoading(true)

    let purchases = []

    cart.forEach((item) => {
      purchases.push({
        productname: item.name,
        price: item.price,
      })
    })

    const newPurchase = {
      firstName: firstName,
      lastName: lastName,
      purchases: purchases,
    }

    api
      .post('/purchase', newPurchase)
      .then((res) => {
        console.log('response: ', res.data)
        setLoading(false)
        setOpenDialog(false)

        setAlertSubject('Ostokset OK')
        setAlertText(
          'Ostokset tallennettu tietokantaan onnistuneesti. Voit sulkea tämän ikkunan painamalla "ALKUUN" tai antaa sen sulkeutua itseksiään 10s kuluttua. Kiitos!'
        )
        setOpenAlert(true)

        setTimeout(() => {
          backToBeginning()
        }, 10000)
      })
      .catch((err) => {
        console.log('Error adding purchase to database: ', err)
        setLoading(false)
        setOpenDialog(false)
        setAlertSubject('VIRHE')
        setAlertText(
          'Ostoksien tallentamisessa tietokantaan tapahtui virhe. MERKKAAA OSTOKSESI VIERESSÄ OLEVAAN PAPERILISTAAN, KIITOS. Tämän ikkunan voi sulkea painamalla ALKUUN.'
        )
        setOpenAlert(true)

        setTimeout(() => {
          backToBeginning()
        }, 30000)
      })

  }

  const backToBeginning = () => {
    history.push('/')
    setRedirect(true)
  }

  if (redirect) {
    return <Redirect to={'/'} />
  }

  return (
    <div className={classes.root}>
      <Card className={classes.card}>
        <CardContent>
          <Typography
            className={classes.title}
            color="textPrimary"
            gutterBottom
          >
            Yhteenveto ostoksista
          </Typography>

          <Typography className={classes.body} variant="body2" component="p">
            Asiakas: {firstName} {lastName}
            <br />
            Tuotteita korissa: {cart.length}
            <br />
            Hinta yhteensä: {totalPrice}
          </Typography>
        </CardContent>

        <CardActions className={classes.cardaction}>
          <Button
            onClick={handleClickOpenDialog}
            className={classes.button}
            variant="contained"
            color="primary"
            size="medium"
          >
            Merkitse tuotteet ostetuksi
          </Button>
        </CardActions>
      </Card>

      <Dialog
        fullScreen
        open={openDialog}
        onClose={handleCloseDialog}
        TransitionComponent={Transition}
      >
        <AppBar className={classes.appBar}>
          <Toolbar>
            <IconButton
              edge="start"
              color="inherit"
              onClick={handleCloseDialog}
              aria-label="close"
            >
              <CloseIcon />
            </IconButton>

            <Button
              variant="outlined"
              color="inherit"
              onClick={handleCloseDialog}
            >
              Muokkaa
            </Button>
            <Button
              variant="outlined"
              color="inherit"
              onClick={backToBeginning}
            >
              Alkuun
            </Button>
            <Button
              variant="outlined"
              color="inherit"
              autoFocus
              onClick={savePurchases}
              disabled={loading}
            >
              Vahvista
              {loading && (
                <CircularProgress
                  color={'secondary'}
                  className={classes.proggress}
                />
              )}
            </Button>
          </Toolbar>
        </AppBar>

        <List>
          {cart.map((item) => (
            <ListItem key={shortid.generate()}>
              <ListItemText primary={item.name} secondary={item.price} />
            </ListItem>
          ))}
        </List>
      </Dialog>

      {/* ALERT DIALOG */}

      <Dialog
        open={openAlert}
        TransitionComponent={Transition}
        keepMounted
        onClose={handleCloseAlert}
        aria-labelledby="alert-dialog-slide-title"
        aria-describedby="alert-dialog-slide-description"
      >
        <DialogTitle id="alert-dialog-slide-title">{alertSubject}</DialogTitle>
        <DialogContent>
          <DialogContentText id="alert-dialog-slide-description">
            {alertText}
          </DialogContentText>
        </DialogContent>
        <DialogActions>
          <Button onClick={handleCloseAlert} color="primary">
            Alkuun
          </Button>
        </DialogActions>
      </Dialog>
    </div>
  )
}
