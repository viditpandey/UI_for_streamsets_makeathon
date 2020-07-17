import Line from '../components/Graphs/DataProcessRateGraph'
// import PipelinesLayout from '../components/Pipelines/PipelinesLayout'
import React from 'react'

import { useParams } from 'react-router-dom'
import MetricsLayout from '../components/Graphs/MetricsLayout'
const PipelinesLayout = React.lazy(() => import('../components/Pipelines/PipelinesLayout'))
const PipelineLayout = React.lazy(() => import('../components/Pipelines/PipelineLayout'))
const TopologiesLayout = React.lazy(() => import('../components/Topologies/TopologiesLayout'))
const TopolgyRegisterationLayout = React.lazy(() => import('../components/Topologies/TopolgyRegisterationLayout'))
const TopologyLayout = React.lazy(() => import('../components/Topologies/TopologyLayout'))

const routes = [
  {
    path: '/',
    exact: true,
    component: () => <PipelinesLayout />
  },
  {
    path: '/pipelines',
    exact: true,
    component: () => <PipelinesLayout />
  },
  {
    path: '/pipelines/:id',
    exact: true,
    component: () => <Pipeline />
  },
  {
    path: '/topologies',
    exact: true,
    component: () => <TopologiesLayout />
  },
  {
    path: '/topologies/:id',
    exact: true,
    component: () => <Topolgy />
  }, {
    path: '/metrics',
    exact: true,
    component: () => <MetricsLayout />
  }
]

const Pipeline = () => {
  const { id } = useParams()
  return <PipelineLayout id={id} />
}
const Topolgy = () => {
  const { id } = useParams()
  if (id && id.toLowerCase() === 'create') return <TopolgyRegisterationLayout propsSelectedPipelines={[]} />
  return <TopologyLayout id={id} />
}

export default routes
