import React from 'react'
import Switch from '@material-ui/core/Switch'

import { Typography } from '@material-ui/core'
import { isEmpty } from 'lodash'
import { LineChart, Line, XAxis, CartesianGrid, Tooltip, YAxis, BarChart, Bar, Label } from 'recharts'
import { getProcessedData } from '../../helper/metricsHelper'

export default function MetricsLayout ({ topologyPipelinesData = [], metricsData = [] }) {
  const [toggle, setToggle] = React.useState(false)
  const data = []
  const processedData = []
  const errorCountData = []
  let dataMax = 0
  let processedDataMax = 0
  let errorCountDataMax = 0
  !isEmpty(topologyPipelinesData) && topologyPipelinesData.forEach((element) => {
    try {
      const startTime = element.startTime
      const endTime = element.endTime
      let totalTime = (endTime - startTime) / 1000
      const errorCount = element.errorCount
      if (errorCount > 0) errorCountDataMax = element.errorCount
      if (totalTime < 0) totalTime = 0
      if (totalTime > dataMax) dataMax = totalTime
      const errorCountDataRow = {
        name: element.pipelineTitle,
        YAxisData: errorCount
      }
      errorCountData.push(errorCountDataRow)
      const dataRow = {
        name: element.pipelineTitle,
        YAxisData: totalTime
      }

      data.push(dataRow)

      if (!isEmpty(metricsData)) {
        const { processedDataRow, maxRate } = getProcessedData(metricsData, element, totalTime, processedDataMax)
        processedDataMax = maxRate
        processedData.push(processedDataRow)
      }
    } catch (error) { console.log('metrics calculation error', error) }
  })

  return (
    <div className='padding-30'>
      <Typography>{toggle ? 'Line Chart' : 'Bar Chart'}
        <Switch
          checked={toggle}
          onChange={e => {
            setToggle(!toggle)
          }}
          name='graphview'
          inputProps={{ 'aria-label': 'secondary checkbox' }}
        />
      </Typography>

      {
        toggle
          ? (
            <div>
              {MyLineChart({ data, yExtra: dataMax * 0.1, Xlabel: 'Time Consumption Graph', Ylabel: 'Time Taken', YUnit: 's' })}
              {!isEmpty(metricsData) ? MyLineChart({ data: processedData, yExtra: processedDataMax * 0.1, Xlabel: 'Data Processing Rate Graph', Ylabel: 'Records / sec', YUnit: 'rate' }) : null}
              {MyLineChart({ data: errorCountData, yExtra: errorCountDataMax * 0.1, Xlabel: 'Error Count Graph', Ylabel: 'Number', YUnit: 'count' })}
            </div>

          )
          : (
            <div>
              {MyBarChart({ data, yExtra: dataMax * 0.1, Xlabel: 'Time Consumption Graph', Ylabel: 'Time Taken', YUnit: 's' })}
              {!isEmpty(metricsData) ? MyBarChart({ data: processedData, yExtra: processedDataMax * 0.1, Xlabel: 'Data Processing Rate Graph', Ylabel: 'Records / sec', YUnit: 'rate' }) : null}
              {MyBarChart({ data: errorCountData, yExtra: errorCountDataMax * 0.1, Xlabel: 'Error Count Graph', Ylabel: 'Number', YUnit: 'count' })}
            </div>
          )
      }
    </div>
  )
}

function MyBarChart ({ data, yExtra, Xlabel, Ylabel, YUnit }) {
  return (
    <BarChart
      width={800}
      height={300}
      data={data}
      margin={{
        top: 50, right: 30, left: 150, bottom: 50
      }}
    >
      <CartesianGrid />
      <XAxis dataKey='name'>
        <Label value={Xlabel} position='bottom' />
      </XAxis>
      <YAxis domain={[0, ('dataMax+' + yExtra)]} unit={YUnit}>
        <Label value={Ylabel} position='insideTopLeft' angle={90} />
      </YAxis>
      <Tooltip />
      <Bar dataKey='YAxisData' fill='#8884d8' />
    </BarChart>
  )
}

function MyLineChart ({ data, yExtra, Xlabel, Ylabel, YUnit }) {
  return (
    <div className='line-chart-wrapper'>
      <LineChart
        width={800} height={300} data={data} syncId='test' margin={{
          top: 50, right: 30, left: 150, bottom: 50
        }}
      >
        <CartesianGrid />
        <XAxis dataKey='name'>
          <Label value={Xlabel} position='bottom' />
        </XAxis>
        <YAxis domain={[0, 'dataMax+' + yExtra]} unit={YUnit}>
          <Label value={Ylabel} position='insideTopLeft' angle={90} />
        </YAxis>
        <Tooltip />
        <Line
          key='YAxisData'
          type='natural'
          dataKey='YAxisData'
          stroke='red'
        />
      </LineChart>
    </div>
  )
}
