import React, { useEffect } from 'react'
import { LineChart, Line, XAxis, CartesianGrid, Tooltip, YAxis, LabelList, BarChart, Legend, Bar, Label } from 'recharts'
import moment from 'moment'

export default function MyChart ({ topologyData = [], metricsData = [] }) {
  const [toggle, setToggle] = React.useState(true)
  // const [processedData, setProcessedData] = React.useState({})
  const data = []
  const processedData = []

  topologyData && topologyData.forEach((element) => {
    const startTime = moment(element.startTime, 'DD-MM-YYYY hh:mm:ss')
    const endTime = moment(element.endTime, 'DD-MM-YYYY hh:mm:ss')
    const totalTime = endTime.diff(startTime) / 1000
    console.log(metricsData)
    const dataRow = {
      name: element.pipelineTitle,
      YAxisData: totalTime
    }

    const processedDataRow = {
      name: metricsData && element.pipelineTitle,
      YAxisData: metricsData && (metricsData.find(i => i.name === element.pipelineId).res / totalTime)
    }

    processedData.push(processedDataRow)
    data.push(dataRow)
  })

  return (
    toggle
      ? (
        <div>
          {MyBarChart({ data, yExtra: '20' })}
          {MyBarChart({ data: processedData, yExtra: '200' })}

        </div>
      )
      : MyLineChart({ data })
  )
}

function MyBarChart ({ data, yExtra }) {
  console.log('-------', ('dataMax+' + yExtra))
  return (
    <BarChart
      width={500}
      height={300}
      data={data}
      margin={{
        top: 5, right: 30, left: 20, bottom: 5
      }}
    >
      <CartesianGrid />
      <XAxis dataKey='name'>
        {/* <Label value='Pipelines' position='center' /> */}
      </XAxis>
      <YAxis domain={[0, ('dataMax+' + yExtra)]}>
        <Label value='seconds' position='insideLeft' angle={90} />
      </YAxis>
      <Tooltip />
      <Bar dataKey='YAxisData' fill='#8884d8' />
    </BarChart>
  )
}

function MyLineChart ({ data }) {
  return (
    <div className='line-chart-wrapper'>
      <LineChart
        width={800} height={300} data={data} syncId='test' margin={{
          top: 5, right: 30, left: 20, bottom: 5
        }}
      >
        <CartesianGrid stroke='#f5f5f5' fill='#e6e6e6' />
        <XAxis dataKey='name' />
        <YAxis domain={[0, 'dataMax+20']} unit=' seconds' />
        <Tooltip />
        <Line
          key='ProcessingTime'
          type='monotone'
          dataKey='ProcessingTime'
          stroke='#ff7300'
        >
          <LabelList position='bottom' offset={10} dataKey='name' />
        </Line>
      </LineChart>
    </div>
  )
}
