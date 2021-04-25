import React, { useState } from 'react'
import { Link } from 'react-router-dom'
import api from '../apiConfig'
import Button from '@material-ui/core/Button'
import { makeStyles } from '@material-ui/core/styles'
import Card from '@material-ui/core/Card'
import CardContent from '@material-ui/core/CardContent'
import { Logo } from './Logo'
import TextField from '@material-ui/core/TextField'
import ButtonGroup from '@material-ui/core/ButtonGroup'
import CircularProgress from '@material-ui/core/CircularProgress'
import Paper from '@material-ui/core/Paper'
import Grid from '@material-ui/core/Grid'
import ClearIcon from '@material-ui/icons/Clear'
import BackspaceIcon from '@material-ui/icons/Backspace'
import Typography from '@material-ui/core/Typography'
import Dialog from '@material-ui/core/Dialog'
import DialogActions from '@material-ui/core/DialogActions'
import DialogContent from '@material-ui/core/DialogContent'
import DialogContentText from '@material-ui/core/DialogContentText'
import DialogTitle from '@material-ui/core/DialogTitle'
import { createBrowserHistory } from 'history'
import { Redirect } from 'react-router'
import { Instructions } from './Instructions'

const history = createBrowserHistory()

const useStyles = makeStyles({
  paper: {
    width: '100%',
    textAlign: 'center',
    marginTop: 10
  },
  instructionsBtn: {
    display: 'block',
    marginLeft: 'auto',
    marginRight: 'auto'
  },
  pinInput: {
    marginTop: 20,
    width: 170
  },
  iconBtnLeft: {
    padding: 16,
    marginRight: 5
  },
  iconBtnRight: {
    padding: 16,
    marginLeft: 5
  },
  btnRelative: {
    position: 'relative'
  },
  pinCheckWait: {
    position: 'absolute'
  },
  card: {
    textAlign: 'left'
  },
  cardContent: {
    paddingBottom: 16
  },
  title: {
    fontSize: 16
  },
  pos: {
    marginBottom: 12
  },
  buyByNameButton: {
    fontSize: 16,
    marginBottom: 30,
    width: 170
  },
  pinpadLeftButton: {
    marginRight: 5
  },
  pinpadRightButton: {
    marginLeft: 5
  },
  cardaction: {
    justifyContent: 'center',
    marginBottom: 30,
    marginTop: 30
  },
  divider: {
    marginTop: 30,
    marginBottom: 30
  },
  tai: {
    marginTop: 16,
    marginBottom: 16
  }
})

let pinCode = ''

export const StartPage = ({ setFirstName, setLastName }) => {
  const classes = useStyles()

  const [pinValue, setPinValue] = useState('')
  const [pinReady, setPinReady] = useState(false)
  const [openOkAlert, setOpenOkAlert] = useState(false)
  const [openErrorAlert, setOpenErrorAlert] = useState(false)
  const [errorAlertText, setErrorAlertText] = useState('Virhe')
  const [user, setUser] = useState('')
  const [redirect, setRedirect] = useState(false)
  const [openInstructions, setOpenInstructions] = useState(false)

  const handleNumberButtonClick = (e, data) => {
    pinCode = pinCode + data
    e.preventDefault()
    if (pinCode.length >= 4) {
      setPinValue(pinValue + data)
      setPinReady(true)

      api
        .get('/checkpin', {
          params: {
            pincode: pinCode
          }
        })
        .then(res => {
          if (res.data.length > 1) {
            setPinValue('')
            pinCode = ''
            setPinReady(false)
            setErrorAlertText(
              'Samalla pin-koodilla löytyi useampi käyttäjä. Käytä ostamiseen nimellä tunnistautumista. Mikäli tämäkään ei onnistu niin merkkaa ostoksesi paperilistaan. Jos mahdollista niin ilmoita asiasta henkilökunnalle, kiitos.'
            )
            setOpenErrorAlert(true)
          } else if (res.status === 203) {
            setPinValue('')
            pinCode = ''
            setPinReady(false)
            setErrorAlertText(
              'Annetulla PIN -koodilla ei löytynyt yhtään käyttäjää. Mikäli ei toimi uusintayritykselläkään ja olet varma oikeasta pinistä niin kokeile nimellä tunnistautumista. Mikäli tämäkään ei toimi tai nimeästi ei löydy listasta niin merkkaa ostoksesti paperilistaan ja ilmoita ongelmasta henkilökunnalle, kiitos.'
            )
            setOpenErrorAlert(true)
          } else {
            setUser(res.data[0].fullName)
            setFirstName(res.data[0].firstName)
            setLastName(res.data[0].lastName)
            setPinValue('')
            pinCode = ''
            setPinReady(false)
            setOpenOkAlert(true)
          }
        })
        .catch(err => {
          console.log('Error with pin checking: ', err)
          alert(
            'Jotain meni pieleen PIN tarkastuksessa. Kokeile nimellä ostamista. Mikäli sekään ei toimi niin merkkaa ostoksesi vieressä olevaan listaan.'
          )
        })
    } else {
      setPinValue(pinValue + data)
    }
  }

  const handleClearClick = () => {
    setPinValue('')
    pinCode = ''
    setPinReady(false)
  }

  const handleBackspaceClick = () => {
    let newPinCode = pinCode.slice(0, -1)
    setPinValue(newPinCode)
    pinCode = newPinCode
    setPinReady(false)
  }

  const handleCloseOkAlertYes = () => {
    setOpenOkAlert(false)
    goToCart()
  }

  const handleCloseOkAlertNo = () => {
    setOpenOkAlert(false)
  }

  const handleCloseErrorAlert = () => {
    setOpenErrorAlert(false)
  }

  const handleClickOpenInstructions = () => {
    setOpenInstructions(true)
  }

  const handleCloseInstructions = () => {
    setOpenInstructions(false)
  }

  const goToCart = () => {
    history.push('/cart')
    setRedirect(true)
  }

  if (redirect) {
    return <Redirect to={'/cart'} />
  }

  return (
    <div>
      <Card className={classes.card}>
        <CardContent className={classes.cardContent}>
          <Logo />

          <Button
            className={classes.instructionsBtn}
            variant="outlined"
            color="secondary"
            onClick={handleClickOpenInstructions}
          >
            Ohjeistus myyntikoneen käyttöön
          </Button>

          <Instructions
            openInstructions={openInstructions}
            handleCloseInstructions={handleCloseInstructions}
          />
        </CardContent>
      </Card>

      <div className={classes.root}>
        <Paper className={classes.paper}>
          <Grid container spacing={1}>
            <Grid item xs={12}>
              <TextField
                className={classes.pinInput}
                id="pinInput"
                label="PIN"
                type="password"
                variant="outlined"
                value={pinValue}
                disabled={true}
                size="small"
              />
            </Grid>
            <Grid item xs={12}>
              <ButtonGroup
                color="primary"
                aria-label="outlined primary button group"
                variant="contained"
                size="large"
              >
                <Button
                  className={classes.pinpadLeftButton}
                  disabled={pinReady}
                  onClick={e => handleNumberButtonClick(e, 1)}
                  value={1}
                >
                  1
                </Button>
                <Button
                  disabled={pinReady}
                  onClick={e => handleNumberButtonClick(e, 2)}
                  value={2}
                >
                  2
                </Button>
                <Button
                  className={classes.pinpadRightButton}
                  disabled={pinReady}
                  onClick={e => handleNumberButtonClick(e, 3)}
                  value={3}
                >
                  3
                </Button>
              </ButtonGroup>
            </Grid>
            <Grid item xs={12}>
              <ButtonGroup
                color="primary"
                aria-label="outlined primary button group"
                variant="contained"
                size="large"
              >
                <Button
                  className={classes.pinpadLeftButton}
                  disabled={pinReady}
                  onClick={e => handleNumberButtonClick(e, 4)}
                  value={4}
                >
                  4
                </Button>
                <Button
                  disabled={pinReady}
                  onClick={e => handleNumberButtonClick(e, 5)}
                  value={5}
                  className={classes.btnRelative && classes.btn}
                >
                  5
                  {pinReady && (
                    <CircularProgress
                      className={classes.pinCheckWait}
                      size={50}
                    />
                  )}
                </Button>
                <Button
                  className={classes.pinpadRightButton}
                  disabled={pinReady}
                  onClick={e => handleNumberButtonClick(e, 6)}
                  value={6}
                >
                  6
                </Button>
              </ButtonGroup>
            </Grid>
            <Grid item xs={12}>
              <ButtonGroup
                color="primary"
                aria-label="outlined primary button group"
                variant="contained"
                size="large"
              >
                <Button
                  className={classes.pinpadLeftButton}
                  disabled={pinReady}
                  onClick={e => handleNumberButtonClick(e, 7)}
                  value={7}
                >
                  7
                </Button>
                <Button
                  disabled={pinReady}
                  onClick={e => handleNumberButtonClick(e, 8)}
                  value={8}
                >
                  8
                </Button>
                <Button
                  className={classes.pinpadRightButton}
                  disabled={pinReady}
                  onClick={e => handleNumberButtonClick(e, 9)}
                  value={9}
                >
                  9
                </Button>
              </ButtonGroup>
            </Grid>
            <Grid item xs={12}>
              <ButtonGroup
                color="primary"
                aria-label="outlined primary button group"
                variant="contained"
                size="large"
              >
                <Button
                  disabled={pinReady}
                  onClick={handleClearClick}
                  className={classes.iconBtnLeft}
                >
                  <ClearIcon fontSize="small" />
                </Button>
                <Button
                  disabled={pinReady}
                  onClick={e => handleNumberButtonClick(e, 0)}
                  value={0}
                >
                  0
                </Button>
                <Button
                  disabled={pinReady}
                  onClick={handleBackspaceClick}
                  className={classes.iconBtnRight}
                >
                  <BackspaceIcon fontSize="small" />
                </Button>
              </ButtonGroup>
            </Grid>
          </Grid>


          <Typography className={classes.tai} color="secondary">
            ---------------- TAI ----------------
          </Typography>

          <Link to="/fn" style={{ textDecoration: 'none' }}>
            <Button
              className={classes.buyByNameButton}
              variant="contained"
              color="primary"
              size="medium"
            >
              Osta nimellä
            </Button>
          </Link>
        </Paper>

        <Dialog
          open={openOkAlert}
          onClose={handleCloseOkAlertNo}
          aria-labelledby="alert-dialog-title"
          aria-describedby="alert-dialog-description"
        >
          <DialogTitle id="alert-dialog-title">{'Vahvista nimesi'}</DialogTitle>
          <DialogContent>
            <DialogContentText id="alert-dialog-description">
              {`${user}, onko oikein?`}
            </DialogContentText>
          </DialogContent>
          <DialogActions>
            <Button onClick={handleCloseOkAlertNo} color="primary">
              Ei
            </Button>
            <Button onClick={handleCloseOkAlertYes} color="primary" autoFocus>
              Kyllä
            </Button>
          </DialogActions>
        </Dialog>

        <Dialog
          open={openErrorAlert}
          onClose={handleCloseErrorAlert}
          aria-labelledby="alert-dialog-title"
          aria-describedby="alert-dialog-description"
        >
          <DialogTitle id="alert-dialog-title">Tapahtui virhe</DialogTitle>
          <DialogContent>
            <DialogContentText id="alert-dialog-description">
              {`${errorAlertText}`}
            </DialogContentText>
          </DialogContent>
          <DialogActions>
            <Button onClick={handleCloseErrorAlert} color="primary" autoFocus>
              ok
            </Button>
          </DialogActions>
        </Dialog>
      </div>
    </div>
  )
}
