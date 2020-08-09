import React, { useEffect, useState } from 'react'

import { Typography, Card } from '@material-ui/core'
import { isEmpty, uniq, flatten } from 'lodash'
import { LineChart, Line, XAxis, CartesianGrid, Tooltip, YAxis, BarChart, Bar, Label, PieChart, Pie, Cell } from 'recharts'
import { getProcessedData } from '../../helper/metricsHelper'
import { getRandomColor, generateRandomColorByStrings } from '../../helper/PipelineHelpers'
import Grid from '@material-ui/core/Grid'
import Legend from '../Shared/Legend'

export default function MetricsLayout ({ topologyPipelinesData = [], metricsData = [] }) {
  const [colors, setColors] = useState([])
  const [instanceIdsWithColor, setInstanceIds] = useState({})

  useEffect(() => {
    if (isEmpty(topologyPipelinesData)) return
    setColors(topologyPipelinesData.map(i => getRandomColor()))
    const allInstanceIds = topologyPipelinesData.map(i => i.instanceId)
    setInstanceIds(generateRandomColorByStrings(uniq(flatten(allInstanceIds))))
  }, [topologyPipelinesData && topologyPipelinesData.length])

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
        value: totalTime,
        instanceId: element.instanceId
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
      {
        (
          <div>
            {MyPieChart({ data, colors, instanceIdsWithColor })}
            {!isEmpty(metricsData) ? MyBarChart({ data: processedData, yExtra: processedDataMax * 0.1, Xlabel: 'Number of data processed per Second', Ylabel: 'Records / sec', YUnit: '', colors }) : null}
            {MyLineChart({ data: errorCountData, yExtra: errorCountDataMax * 0.1, Xlabel: 'Error Count Graph', Ylabel: 'Number', YUnit: 'count' })}
          </div>

        )
      }
    </div>
  )
}

function MyBarChart ({ data, yExtra, Xlabel, Ylabel, YUnit, colors }) {
  const COLORS = colors
  return (
    <Card className='chart-background margin-bottom-15'>
      <Typography style={{ textAlign: 'center', paddingTop: '30px', fontWeight: 500 }}>{Xlabel}</Typography>
      <hr />
      <BarChart
        width={800}
        height={300}
        data={data}
        margin={{
          top: 50, right: 30, left: 150, bottom: 50
        }}
      >
        <CartesianGrid stroke='#cccaca' strokeDasharray='5 5' />
        <XAxis dataKey='name'>
          <Label value='Pipelines' position='bottom' />
        </XAxis>
        <YAxis domain={[0, ('dataMax+' + yExtra)]} unit={YUnit}>
          <Label value={Ylabel} position='insideTopLeft' angle={90} />
        </YAxis>
        <Tooltip />
        <Bar dataKey='YAxisData' fill='#8884d8'>
          {
            data.map((entry, index) => <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />)
          }
        </Bar>
      </BarChart>
    </Card>
  )
}

function MyPieChart ({ data, colors, instanceIdsWithColor }) {
  const groupData = {}
  const instanceData = []
  data.forEach(element => {
    if (!groupData[element.instanceId]) groupData[element.instanceId] = 0
    groupData[element.instanceId] += element.value
  })
  for (const instanceId in groupData) {
    if (Object.prototype.hasOwnProperty.call(groupData, instanceId)) {
      instanceData.push({
        name: instanceId, value: groupData[instanceId]
      })
    }
  }
  const COLORS = colors
  return (
    <Card className='chart-background margin-bottom-15'>
      <Grid container spacing={3}>
        <Grid item xs={12} style={{ paddingTop: '30px' }}>
          <Typography style={{ textAlign: 'center', fontWeight: 500 }}>Total time taken for Topology Run</Typography>
          <hr />
        </Grid>
        <Grid item xs={8} style={{ marginTop: '-45px' }}>
          <PieChart
            width={500}
            height={360}
          >
            <Pie dataKey='value' data={instanceData} cx={200} cy={200} outerRadius={60} fill='#82ca9d'>
              {
                instanceData.map((entry, index) => <Cell key={`cell-${index}`} fill={instanceIdsWithColor[entry.name]} />)
              }
            </Pie>
            <Pie dataKey='value' isAnimationActive={false} data={data} cx={200} cy={200} innerRadius={70} outerRadius={90} fill='#8884d8' label>
              {
                data.map((entry, index) => <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />)
              }
            </Pie>
            <Tooltip />

          </PieChart>
        </Grid>
        <Grid item xs={2} style={{ paddingTop: '50px' }}>
          <Typography className='underline-text'>Pipeline Details</Typography>
          <br />
          <div style={{ textAlign: 'center' }}>
            {data.map((element, i) => <Legend key={i} name={element.name} color={COLORS[i % COLORS.length]} />)}
          </div>
        </Grid>
        <Grid item xs={2} style={{ paddingTop: '50px' }}>
          <Typography className='underline-text'>Instance Details</Typography>
          <br />
          <div>
            {instanceData.map((entry, i) => <Legend key={i} name={entry.name} color={instanceIdsWithColor[entry.name]} />)}
          </div>
        </Grid>
      </Grid>
      <div style={{ display: 'flex' }} />
    </Card>
  )
}

function MyLineChart ({ data, yExtra, Xlabel, Ylabel, YUnit }) {
  return (
    <Card className='chart-background margin-bottom-15'>
      <Typography style={{ textAlign: 'center', paddingTop: '30px', fontWeight: 500 }}>Errors produced during Topology Run</Typography>
      <hr />
      <div className='line-chart-wrapper'>
        <LineChart
          width={800} height={300} data={data} syncId='test' margin={{
            top: 50, right: 30, left: 150, bottom: 50
          }}
        >
          <CartesianGrid stroke='#cccaca' strokeDasharray='5 5' />
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
    </Card>
  )
}
