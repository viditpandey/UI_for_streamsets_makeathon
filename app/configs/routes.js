import React from 'react'

import { useParams } from 'react-router-dom'

const PipelinesLayout = React.lazy(() => import('../components/Pipelines/PipelinesLayout'))
const PipelineLayout = React.lazy(() => import('../components/Pipelines/PipelineLayout'))
const TopologiesLayout = React.lazy(() => import('../components/Topologies/TopologiesLayout'))
const TopolgyRegisterationLayout = React.lazy(() => import('../components/Topologies/TopolgyRegisterationLayout'))
const TopologyLayout = React.lazy(() => import('../components/Topologies/TopologyLayout'))
const TopologyHistoryLayout = React.lazy(() => import('../components/Topologies/TopologyHistoryLayout'))

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
  },
  {
    path: '/topologies/:id/history',
    exact: true,
    component: () => <TopologyHistoryLayout />
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
