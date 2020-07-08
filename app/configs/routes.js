import React from 'react'
import { useParams } from 'react-router-dom'

const routes = [
    {
      path: "/",
      exact: true,
      component: () => <Pipelines/>
    },
    {
      path: "/pipelines",
      exact: true,
      component: () => <Pipelines/>
    },
    {
      path: "/pipelines/:id",
      exact: true,
      component: () => <Pipeline />
    },
    {
      path: "/topologies",
      exact: true,
      component: () => <Topologies />
    },
    {
      path: "/topologies/:id",
      exact: true,
      component: () => <Topolgy />
    }
  ]
const Pipelines = () => <h3>Pipelines</h3>
const Pipeline = (props) => {
    const { id } = useParams()
    return <h3>Pipeline with ID:{id}</h3>
}
const Topologies = () => <h3>Topologies</h3>
const Topolgy = (props) => {
    const { id } = useParams()
    return <h3>Topolgy with ID:{id}</h3>
}

  export default routes