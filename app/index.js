import React from 'react'
import Home from './components/Home'
import { BrowserRouter as Router, Route } from 'react-router-dom'
import routes from './configs/routes'
var ReactDOM = require('react-dom')
require('./index.css')

class App extends React.Component {
  render () {
    return (
      <Router>
        <Home />
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
      </Router>
    )
  }
}

ReactDOM.render(
  <App />,
  document.getElementById('app')
)
