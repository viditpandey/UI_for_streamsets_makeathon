import 'regenerator-runtime/runtime.js'

import React, { useState, Suspense } from 'react'
import BottomNavi from './BottomNavi'
import CircularProgress from '@material-ui/core/CircularProgress'
import routes from '../../configs/routes'
import AppTitleBar from './AppTitleBar'

import { Route } from 'react-router-dom'
export const AppBarContext = React.createContext({ text: '' })

const Home = (props) => {
  const [appBar, setAppBar] = useState({ text: '' })
  const setAppTitle = appBar => setAppBar(appBar)
  return (
    <div>
      <div className='app-bar'>
        <AppTitleBar text={appBar.text} button={appBar.button} />
      </div>
      <div className='app-body'>
        <Suspense fallback={<CircularProgress />}>
          <AppBarContext.Provider value={{
            setAppTitle: setAppTitle
          }}
          >
            {routes.map((route, i) => {
              return (
                <Route
                  key={i}
                  path={route.path}
                  exact={route.exact}
                  children={<route.component />}
                />
              )
            })}
          </AppBarContext.Provider>
        </Suspense>
      </div>
      <BottomNavi />
    </div>
  )
}

export default Home
