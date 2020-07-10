import React from 'react'
import { useParams } from 'react-router-dom'
import PipelinesLayout from '../components/PipelinesLayout'
import PipelineLayout from '../components/PipelineLayout'
import TopologiesLayout from '../components/TopologiesLayout'
import TopolgyRegisterationLayout from '../components/TopolgyRegisterationLayout'
import TopologyLayout from '../components/TopologyLayout'

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
  if (id && id.toLowerCase() === 'new') return <TopolgyRegisterationLayout />
  return <TopologyLayout id={id} />
}

export default routes
