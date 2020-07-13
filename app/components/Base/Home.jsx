import React, { useState } from 'react'
import BottomNavi from './BottomNavi'
import routes from '../../configs/routes'
import AppTitleBar from './AppTitleBar'

import { Route } from 'react-router-dom'

const Home = (props) => {
  const [appBar, setAppBar] = useState({ text: 'Streamsets Orchestrator' })
  return (
    <div>
      <AppTitleBar text={appBar.text} button={appBar.button} />
      {routes.map((route, i) => {
        return (
          <Route
            key={i}
            path={route.path}
            exact={route.exact}
            children={<route.component setAppTitle={(appBar) => setAppBar(appBar)} />}
          />
        )
      })}
      <BottomNavi />
    </div>
  )
}

export default Home
