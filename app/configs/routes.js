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
    component: ({ setAppTitle }) => <PipelinesLayout setAppTitle={setAppTitle} />
  },
  {
    path: '/pipelines',
    exact: true,
    component: ({ setAppTitle }) => <PipelinesLayout setAppTitle={setAppTitle} />
  },
  {
    path: '/pipelines/:id',
    exact: true,
    component: ({ setAppTitle }) => <Pipeline setAppTitle={setAppTitle} />
  },
  {
    path: '/topologies',
    exact: true,
    component: ({ setAppTitle }) => <TopologiesLayout setAppTitle={setAppTitle} />
  },
  {
    path: '/topologies/:id',
    exact: true,
    component: ({ setAppTitle }) => <Topolgy setAppTitle={setAppTitle} />
  }
]

const Pipeline = ({ setAppTitle }) => {
  const { id } = useParams()
  return <PipelineLayout id={id} setAppTitle={setAppTitle} />
}
const Topolgy = ({ setAppTitle }) => {
  const { id } = useParams()
  if (id && id.toLowerCase() === 'new') return <TopolgyRegisterationLayout setAppTitle={setAppTitle} propsSelectedPipelines={[]} />
  return <TopologyLayout id={id} setAppTitle={setAppTitle} />
}

export default routes
