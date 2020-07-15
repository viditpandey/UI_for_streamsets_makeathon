import React from 'react'
// import { Chart, useChartConfig } from 'react-charts'
import { LineChart, Line, XAxis, CartesianGrid, Tooltip, YAxis, LabelList, Legend, Label, Brush } from 'recharts'
export default function MyChart () {
  const data02 = [
    { name: 'Page A', uv: 400, pv: 1, amt: 3400 },
    { name: 'Page B', uv: 200, pv: 2, amt: 2400 },
    { name: 'Page C', uv: 300, pv: 3, amt: 2400 },
    { name: 'Page D', uv: 100, pv: 4, amt: 2400 },
    { uv: 500, pv: 5 }
  ]

  return (

    <div className='line-chart-wrapper'>
      <LineChart width={800} height={800} data={data02} syncId='test'>
        <CartesianGrid stroke='#f5f5f5' fill='#e6e6e6' />
        <XAxis type='number' dataKey='pv' height={40}>
          <Label value='Pipelines' position='insideBottom' />
        </XAxis>
        <YAxis type='number' unit='rate' width={80}>
          <Label value='y' position='insideLeft' angle={90} />
        </YAxis>
        <Tooltip trigger='click' />
        <Line
          key='uv'
          type='monotone'
          dataKey='uv'
          stroke='#ff7300'
          strokeDasharray='3 3'
        >
          <LabelList position='bottom' offset={10} dataKey='name' />
        </Line>
        <Brush dataKey='name' height={30} />
      </LineChart>
    </div>

  )
}
