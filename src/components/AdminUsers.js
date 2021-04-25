import React, { useState, useEffect } from 'react'

import MaterialTable from 'material-table'

import api from '../apiConfig'

const capitalize = s => {
  if (typeof s !== 'string') {
    return ''
  }
  return s.charAt(0).toUpperCase() + s.slice(1).toLowerCase()
}

export const AdminUsers = props => {
  let loggedIn = props.loggedIn
  console.log('LoggedIn: ', loggedIn)

  const [tableData, setTableData] = useState([])

  const [state, setState] = useState({
    columns: [
      { title: 'Etunimi', field: 'firstName' },
      { title: 'Sukunimi', field: 'lastName' },
      { title: 'PIN', field: 'pinCode' }
    ],
    data: tableData
  })

  useEffect(() => {
    console.log('lets get adminusers with pin from db')
    api
      .get('/allnameswithpin')
      .then(res => {
        let tableDataFromDb = res.data.map(a => ({
          firstName: a.firstName,
          lastName: a.lastName,
          pinCode: a.pinCode
        }))
        setTableData(tableDataFromDb)
      })
      .catch(err => {
        console.log('Error getting user information ', err)
      })
  }, [])

  useEffect(() => {
    console.log('lets update users table')

    setState({
      columns: [
        { title: 'Etunimi', field: 'firstName' },
        { title: 'Sukunimi', field: 'lastName' },
        { title: 'PIN', field: 'pinCode' }
      ],
      data: tableData
    })
  }, [tableData])

  const userToDatabase = newUser => {
    let firstNameCapitals = capitalize(newUser.firstName)
    let lastNameCapitals = capitalize(newUser.lastName)

    newUser.firstName = firstNameCapitals
    newUser.lastName = lastNameCapitals

    api
      .post('/admin/user', newUser)
      .then(res => {
        console.log('Response: ', res.data)
      })
      .catch(err => {
        console.log('Error creating user, error: ', err)
        alert('Jotain meni pieleen käyttäjän lisäyksessä, tutkittava')
      })

    let newTableData = tableData.concat(newUser)

    setTableData(newTableData)
  }

  const updateUserDatabase = (oldData, newData) => {
    let firstNameCapitals = capitalize(newData.firstName)
    let lastNameCapitals = capitalize(newData.lastName)

    newData.firstName = firstNameCapitals
    newData.lastName = lastNameCapitals
    newData.oldUserDocId =
      oldData.firstName.toLowerCase() + oldData.lastName.toLowerCase()

    api
      .post('/admin/updateuser', newData)
      .then(res => {
        console.log('Response: ', res.data)
      })
      .catch(err => {
        console.log('Error modifying user, error: ', err)
        alert('Jotain meni pieleen käyttäjän muokkauksessa, tutkittava')
      })
  }

  const deleteUserFromDatabase = oldData => {
    let userId =
      oldData.firstName.toLowerCase() + oldData.lastName.toLowerCase()

    oldData.userId = userId

    api
      .post('/admin/deleteuser', oldData)
      .then(res => {
        console.log('Response: ', res.data)
      })
      .catch(err => {
        console.log('Error deleting user, error: ', err)
        alert('Jotain meni pieleen käyttäjän poistossa, tutkittava')
      })
  }

  return (
    <MaterialTable
      title="Käyttäjät"
      columns={state.columns}
      data={state.data}
      localization={{
        body: {
          emptyDataSourceMessage: 'Ei dataa',
          editRow: {
            deleteText: 'Haluatko varmasti poistaa rivin'
          }
        },
        header: {
          actions: 'Toiminnot'
        }
      }}
      options={{
        pageSize: 20,
        pageSizeOptions: [10, 20, 30, 50, 100, 200, 500],
        addRowPosition: 'first'
      }}
      editable={{
        onRowAdd: newData =>
          new Promise(resolve => {
            setTimeout(() => {
              resolve()
              setState(prevState => {
                const data = [...prevState.data]
                data.push(newData)

                userToDatabase(newData)

                return { ...prevState, data }
              })
            }, 1000)
          }),
        onRowUpdate: (newData, oldData) =>
          new Promise(resolve => {
            setTimeout(() => {
              resolve()
              if (oldData) {
                setState(prevState => {
                  const data = [...prevState.data]

                  updateUserDatabase(oldData, newData)

                  data[data.indexOf(oldData)] = newData
                  return { ...prevState, data }
                })
              }
            }, 1000)
          }),
        onRowDelete: oldData =>
          new Promise(resolve => {
            setTimeout(() => {
              resolve()
              setState(prevState => {
                deleteUserFromDatabase(oldData)
                const data = [...prevState.data]
                data.splice(data.indexOf(oldData), 1)
                return { ...prevState, data }
              })
            }, 1000)
          })
      }}
    />
  )
  // }
}
