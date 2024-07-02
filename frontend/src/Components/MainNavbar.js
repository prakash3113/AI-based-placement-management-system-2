import React from 'react';
import Loading from "../AptiComponents/components/Loading";
import ErrorMessage from "../AptiComponents/components/ErrorMessage";
import { logout } from "../AptiComponents/actions/userActions";
import { useDispatch, useSelector } from "react-redux";
import {
	Nav,
	NavLink,
	Bars,
	NavMenu,
	NavBtn,
	NavBtnLink,
} from './NavbarElements';

const Navbar = ({ history }) => {

	const userLogin = useSelector((state) => state.userLogin);
	const { userInfo } = userLogin;

	const dispatch = useDispatch();
  
	const logoutHandler = () => {
	  dispatch(logout());
	};
	// useEffect(() => {
	// 	if (!userInfo) {
	// 	  history.push("/login");
	// 	}
	//   }, [history, userInfo]);

	return (

		<>
			<Nav>
				<Bars />

				<NavMenu>
					<NavLink exact to='/' activeStyle>
						Home
					</NavLink>
					<NavLink exact to='/codepractice' activeStyle>
						Code Practice
					</NavLink>
					<NavLink exact to='/getaptitude' activeStyle>
						Aptitude Practice
					</NavLink>
					<NavLink exact to='/Module3' activeStyle>
						Technical Round
					</NavLink>
					<NavLink exact to='/Module4' activeStyle>
						Group Descussion
					</NavLink>
					<NavLink exact to='/Admin' activeStyle>
						Admin
					</NavLink>
					<NavLink exact to='/Result' activeStyle>
						My Results
					</NavLink>
					{/* <NavBtn>
						<NavBtnLink to='/logout'>Logout</NavBtnLink>
					</NavBtn> */}
					{userInfo ? <NavBtn onClick = {logoutHandler}>
						<NavBtnLink to='/logout'>Logout</NavBtnLink>
					</NavBtn> : <NavBtn>
						<NavBtnLink to='/login'>Login</NavBtnLink>
					</NavBtn>
					}
					
				</NavMenu>

			</Nav>
		</>
	);
};

export default Navbar;
