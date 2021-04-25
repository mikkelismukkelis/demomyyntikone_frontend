import React, { useState } from 'react'
import MaterialTable from 'material-table'

import api from '../apiConfig'

export const AdminProducts = props => {
  let products = props.adminProducts
  let tableData = products.map(p => ({
    productName: p.productName,
    price: p.price,
    productId: p.productId
  }))

  const [state, setState] = useState({
    columns: [
      { title: 'Tuotteen nimi', field: 'productName' },
      { title: 'Hinta', field: 'price' }
    ],
    data: tableData
  })

  const productToDatabase = newProduct => {
    let priceNumber = parseFloat(newProduct.price)
    newProduct.price = priceNumber

    api
      .post('/admin/product', newProduct)
      .then(res => {
        console.log('Response: ', res.data)
      })
      .catch(err => {
        console.log('Error creating product, error: ', err)
        alert('Jotain meni pieleen tuotteen lisäyksessä, tutkittava')
      })
  }

  const updateProductDatabase = (oldData, newData) => {
    newData.oldProductDocId = oldData.productId

    api
      .post('/admin/updateproduct', newData)
      .then(res => {
        console.log('Response: ', res.data)
      })
      .catch(err => {
        console.log('Error modifying user, error: ', err)
        alert('Jotain meni pieleen tuotteen muokkauksessa, tutkittava')
      })
  }

  const deleteProductFromDatabase = oldData => {
    api
      .post('/admin/deleteproduct', oldData)
      .then(res => {
        console.log('Response: ', res.data)
      })
      .catch(err => {
        console.log('Error deleting product, error: ', err)
        alert('Jotain meni pieleen tuotteen poistossa, tutkittava')
      })
  }

  return (
    <MaterialTable
      title="Tuotteet"
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
        pageSizeOptions: [10, 20, 30, 50],
        addRowPosition: 'first'
      }}
      editable={{
        onRowAdd: newData =>
          new Promise(resolve => {
            setTimeout(() => {
              resolve()
              setState(prevState => {
                if (newData.price.includes(',')) {
                  alert('Hinnassa on erottimena pilkku, pitää käyttää pistettä')
                  return { ...prevState }
                }

                const data = [...prevState.data]
                data.push(newData)

                productToDatabase(newData)

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

                  updateProductDatabase(oldData, newData)

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
                deleteProductFromDatabase(oldData)
                const data = [...prevState.data]
                data.splice(data.indexOf(oldData), 1)
                return { ...prevState, data }
              })
            }, 1000)
          })
      }}
    />
  )
}
