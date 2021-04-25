import React, { useState } from 'react'
import _ from 'lodash'
import dayjs from 'dayjs'

import MaterialTable from 'material-table'

import InputLabel from '@material-ui/core/InputLabel'
import Button from '@material-ui/core/Button'
import FormControl from '@material-ui/core/FormControl'
import Select from '@material-ui/core/Select'
import MenuItem from '@material-ui/core/MenuItem'
import { makeStyles } from '@material-ui/core/styles'

import api from '../apiConfig'

const useSTyles = makeStyles(themes => ({
  parameterSelections: {
    marginTop: 50,
    marginBottom: 20,
    display: 'flex'
  },
  parameterItem: {
    flexGrow: 1
  },
  getButton: {
    marginLeft: 20,
    height: 40
  }
}))

export const AdminReport = () => {
  const classes = useSTyles()

  let reportData = []
  let reportDataSimple = []
  let reportDataGrouped = []

  const [year, setYear] = useState(2020)
  const [month, setMonth] = useState(1)
  const [reportType, setReportType] = useState('grouped')
  const [noDataText] = useState(
    'Valitse ylempää haluttu vuosi, kuukausi ja raportin tyyppi. Paina sitten HAE TIEDOT.'
  )

  const [state, setState] = useState({
    columns: [],
    data: []
  })

  const handleYearChange = e => {
    setYear(e.target.value)
  }

  const handleMonthChange = e => {
    setMonth(e.target.value)
  }

  const handleReportTypeChange = e => {
    setReportType(e.target.value)
  }

  const reportRows = data => {
    let productCount = data.products.length
    let i

    for (i = 0; i < productCount; i++) {
      reportData.push({
        fullName: data.fullName,
        productName: data.products[i].productname,
        price: data.products[i].price,
        created: dayjs(data.created).format('DD.MM.YYYY HH:mm')
      })
    }

    for (i = 0; i < productCount; i++) {
      reportDataSimple.push({
        fullName: data.fullName,
        productName: data.products[i].productname
      })
    }
  }

  const dataToGroupedReportData = data => {
    let obj = data.productCount

    Object.keys(obj).forEach(function(key) {
      reportDataGrouped.push({
        fullName: data.fullName,
        product: `${key}: ${obj[key]}`
      })
    })
  }

  const getReportData = () => {
    api
      .get('/admin/monthlyreport', {
        params: {
          createdYear: year,
          createdMonth: month
        }
      })
      .then(res => {

        if (res.data.message === 'No purchase found') {
          alert(
            'Valitulla vuosi-kuukausi yhdistelmällä ei löytynyt yhtään ostosta.'
          )
          return null
        }

        let purchases = res.data

        purchases.forEach(reportRows)

        let resultGrouped = _(reportDataSimple)
          .groupBy('fullName')
          .map((array, key) => ({
            fullName: key,
            productCount: _.countBy(array, 'productName')
          }))
          .value()

        resultGrouped.forEach(dataToGroupedReportData)

        if (reportType === 'grouped') {
          setState({
            columns: [
              { title: 'Nimi', field: 'fullName', defaultGroupOrder: 0 },
              { title: 'Tuotteet', field: 'product' }
            ],
            data: reportDataGrouped
          })
        } else {
          setState({
            columns: [
              { title: 'Nimi', field: 'fullName', defaultGroupOrder: 0 },
              { title: 'Tuote', field: 'productName' },
              { title: 'Hinta', field: 'price' },
              { title: 'Pvm.', field: 'created' }
            ],
            data: reportData
          })
        }
      })
      .catch(err => {
        console.log('Error creating report, error: ', err)
        alert(
          'Jotain meni pieleen raportin haussa. Kyseessä luultavasti tekninen vika, tutkittava.'
        )
      })
  }

  return (
    <div>
      <div className={classes.parameterSelections}>
        <FormControl className={classes.parameterItem}>
          <InputLabel id="yearSelectLabel">Vuosi</InputLabel>
          <Select
            labelId="yearSelectLabel"
            id="yearSelect"
            value={year}
            onChange={handleYearChange}
          >
            <MenuItem value={2020}>2020</MenuItem>
            <MenuItem value={2021}>2021</MenuItem>
            <MenuItem value={2022}>2022</MenuItem>
          </Select>
        </FormControl>

        <FormControl className={classes.parameterItem}>
          <InputLabel id="monthSelectLabel">Kuukausi</InputLabel>
          <Select
            labelId="monthSelectLabel"
            id="monthSelect"
            value={month}
            onChange={handleMonthChange}
          >
            <MenuItem value={1}>Tammikuu</MenuItem>
            <MenuItem value={2}>Helmikuu</MenuItem>
            <MenuItem value={3}>Maaliskuu</MenuItem>
            <MenuItem value={4}>Huhtikuu</MenuItem>
            <MenuItem value={5}>Toukokuu</MenuItem>
            <MenuItem value={6}>Kesäkuu</MenuItem>
            <MenuItem value={7}>Heinäkuu</MenuItem>
            <MenuItem value={8}>Elokuu</MenuItem>
            <MenuItem value={9}>Syyskuu</MenuItem>
            <MenuItem value={10}>Lokakuu</MenuItem>
            <MenuItem value={11}>Marraskuu</MenuItem>
            <MenuItem value={12}>Joulukuu</MenuItem>
          </Select>
        </FormControl>

        <FormControl className={classes.parameterItem}>
          <InputLabel id="reportTypeLabel">Raportin tyyppi</InputLabel>
          <Select
            labelId="reportTypeLabel"
            id="reportType"
            value={reportType}
            onChange={handleReportTypeChange}
          >
            <MenuItem value={'grouped'}>Tuotteet summattuna</MenuItem>
            <MenuItem value={'detailed'}>Tuotteet eriteltynä</MenuItem>
          </Select>
        </FormControl>

        <Button
          className={classes.getButton}
          variant="contained"
          color="primary"
          onClick={getReportData}
        >
          Hae tiedot
        </Button>
      </div>

      <MaterialTable
        title="Ostot"
        columns={state.columns}
        data={state.data}
        localization={{
          body: {
            emptyDataSourceMessage: noDataText,
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
          grouping: true
        }}
      />
    </div>
  )
}
