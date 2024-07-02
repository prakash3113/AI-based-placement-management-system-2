import React from 'react'
import App2 from './App2'
import codeCompiler from '../codeCompiler'
import { BrowserRouter as Router, Switch, Route } from 'react-router-dom'
// import Aptitude from '../AptiComponents/index'
import Aptitude from '../AptiComponents/userPages/AptitudePage'
import Module3 from './Module3'
import Module4 from './module4'
import MainHomePage from './MainHomePage'
import Admin from './Admin'
import Result from '../Components/Result/Result'
import CodeAdmin from '../Components/Admin/CodeAdmin'
import index from '../AdminPages/index'
import Login from '../Authentication/LoginScreen/LoginScreen'
import Register from '../Authentication/RegisterScreen/RegisterScreen'
import Logout from '../Authentication/Logout'
import { useState } from "react"
import MyNotes from "../AptiComponents/screens/MyNotes/MyNotes"
import SingleNote from "../AptiComponents/screens/SingleNote/SingleNote"
import CreateNote from "../AptiComponents/screens/SingleNote/CreateNote"
import ProfileScreen from "../AptiComponents/screens/ProfileScreen/ProfileScreen"
import ResumeParsing from "../ResumePrasing/ResumeParsing"

// import Dashboard from '../AdminPages/pages/Dashboard'
// import AdminAptitude from '../AdminPages/pages/AptiResult'
// import AdminGDResult from '../AdminPages/pages/GDResult'
// import AdminTechnicalResult from '../AdminPages/pages/TechnicalResult'
// import AdmincodeChallangeResult from '../AdminPages/pages/CodeChallangeResult'
// import AdminaddCodeQuestions from '../AdminPages/pages/AddCodeQuestions'
// import AdminCreateAptiTest from  '../AdminPages/pages/AptiCreateTest'



function Homepage(props) {
	const [search, setSearch] = useState("");

return (
	<Router>
	
	<Switch>
		<Route path='/' exact component={MainHomePage} />
		<Route path='/codepractice' exact component={codeCompiler} />
		<Route path='/adminDashboard' exact component={index} />
		<Route path='/getaptitude' component={Aptitude} />
		<Route path='/Module3' component={Module3} />
		<Route path='/Module4' component={Module4} />
		<Route path='/Admin' component={Admin} />
    	<Route path='/home' component={App2} />
		<Route path='/Result' component={Result} />
		<Route path='/CodeAdmin' component={CodeAdmin} />
		<Route path='/uploadresume' component = {ResumeParsing} />

		

		<Route path="/login" component={Login} />
		<Route path="/logout" component={Logout} />
		<Route path="/register" component={Register} />
        <Route
          path="/mynotes"
          component={({ history }) => (
            <MyNotes search={search} history={history} />
          )}
        />
        <Route path="/note/:id" component={SingleNote} />
        <Route path="/createnote" component={CreateNote} />
        <Route path="/profile" component={ProfileScreen} />

		{/* Admin Routes ______________________start_________________________*/}

			{/* <Route path='/admindashboard' exact component={Dashboard}/>
            <Route path='/adminaptitude' exact component={AdminAptitude}/>
            <Route path='/admintechnical' exact component={AdminTechnicalResult}/>
            <Route path='/admingd' exact component={AdminGDResult}/>
            <Route path='/admincodechallange' exact component={AdmincodeChallangeResult}/> 
            <Route path='/adminaddCodeQuestions' exact component={AdminaddCodeQuestions}/> 
            <Route path='/admincreateAptitest' exact component={AdminCreateAptiTest}/>  */}

		{/* Admin Routes ______________________End______________________*/}
		
	</Switch>
	</Router>
);
}

export default Homepage;
