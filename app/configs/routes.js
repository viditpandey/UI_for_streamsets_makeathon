import React from 'react'
import { useParams } from 'react-router-dom'
import PipelinesLayout from '../components/Pipelines/PipelinesLayout'
import PipelineLayout from '../components/Pipelines/PipelineLayout'
import TopologiesLayout from '../components/Topologies/TopologiesLayout'
import TopolgyRegisterationLayout from '../components/Topologies/TopolgyRegisterationLayout'
import TopologyLayout from '../components/Topologies/TopologyLayout'

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
  }
]

const Pipeline = () => {
  const { id } = useParams()
  return <PipelineLayout id={id} />
}
const Topolgy = () => {
  const { id } = useParams()
  if (id && id.toLowerCase() === 'new') return <TopolgyRegisterationLayout propsSelectedPipelines={[]} />
  return <TopologyLayout id={id} />
}

export default routes
