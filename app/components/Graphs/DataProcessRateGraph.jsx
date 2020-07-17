import React, { useEffect } from 'react'
import { LineChart, Line, XAxis, CartesianGrid, Tooltip, YAxis, LabelList, BarChart, Legend, Bar, Label } from 'recharts'
import moment from 'moment'
import Switch from '@material-ui/core/Switch'

export default function MyChart ({ topologyData = [], metricsData = [] }) {
  const [toggle, setToggle] = React.useState(false)
  const data = []
  const processedData = []
  let dataMax = 0
  let processedDataMax = 0
  topologyData && topologyData.forEach((element) => {
    const startTime = moment(element.startTime, 'DD-MM-YYYY hh:mm:ss')
    const endTime = moment(element.endTime, 'DD-MM-YYYY hh:mm:ss')
    let totalTime = endTime.diff(startTime) / 1000

    if (totalTime < 0) totalTime = 0
    if (totalTime > dataMax) dataMax = totalTime

    const dataRow = {
      name: element.pipelineTitle,
      YAxisData: totalTime
    }
    const rate = metricsData && (metricsData.find(i => i.name === element.pipelineId)) &&
    (metricsData.find(i => i.name === element.pipelineId).res / totalTime)

    if (rate > processedDataMax) processedDataMax = rate

    const processedDataRow = {
      name: metricsData && element.pipelineTitle,
      YAxisData: rate
    }

    processedData.push(processedDataRow)
    data.push(dataRow)
  })

  return (
    <div>
      {toggle ? 'Bar Chart' : 'Line Chart'}
      <Switch
        checked={toggle}
        onChange={e => {
          setToggle(!toggle)
        }}
        name='graphview'
        inputProps={{ 'aria-label': 'secondary checkbox' }}
      />

      {
        toggle
          ? (
            <div>
              {MyBarChart({ data, yExtra: dataMax * 0.1, Xlabel: 'Time Consumption Graph', Ylabel: 'Time Taken', YUnit: 's' })}
              {MyBarChart({ data: processedData, yExtra: processedDataMax * 0.1, Xlabel: 'Data Processing Rate Graph', Ylabel: 'Records / sec', YUnit: 'rate' })}

            </div>
          )
          : <div>
            {MyLineChart({ data, yExtra: dataMax * 0.1, Xlabel: 'Time Consumption Graph', Ylabel: 'Time Taken', YUnit: 's' })}
            {MyLineChart({ data: processedData, yExtra: processedDataMax * 0.1, Xlabel: 'Data Processing Rate Graph', Ylabel: 'Records / sec', YUnit: 'rate' })}
            </div>
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
