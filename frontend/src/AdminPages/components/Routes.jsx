import React from 'react'

import { Route, Switch } from 'react-router-dom'

// import Dashboard from '../pages/Dashboard'
// import Customers from '../pages/Customers'
// import AdminAptitude from '../pages/AptiResult'
// import AdminGDResult from '../pages/GDResult'
// import AdminTechnicalResult from '../pages/TechnicalResult'
// import AdmincodeChallangeResult from '../pages/CodeChallangeResult'
// import AdminaddCodeQuestions from '../pages/AddCodeQuestions'
// import AdminCreateAptiTest from  '../pages/AptiCreateTest'


import Dashboard from '../pages/Dashboard'
import Customers from '../pages/Customers'
import AdminAptitude from '../pages/AptiResult'
import AdminGDResult from '../pages/GDResult'
import AdminTechnicalResult from '../pages/TechnicalResult'
import AdmincodeChallangeResult from '../pages/CodeChallangeResult'
import AdminaddCodeQuestions from '../pages/AddCodeQuestions'
import AdminCreateAptiTest from  '../pages/AptiCreateTest'

const Routes = () => {
    return (
        <Switch>
            <Route path='/admindashboard' exact component={Dashboard}/>
            <Route path='/customers' exact component={Customers}/>
            <Route path='/adminaptitude' exact component={AdminAptitude}/>
            <Route path='/admintechnical' exact component={AdminTechnicalResult}/>
            <Route path='/admingd' exact component={AdminGDResult}/>
            <Route path='/admincodechallange' exact component={AdmincodeChallangeResult}/> 
            <Route path='/adminaddCodeQuestions' exact component={AdminaddCodeQuestions}/> 
            <Route path='/admincreateAptitest' exact component={AdminCreateAptiTest}/> 
        </Switch>
    )
}

export default Routes
