import * as React from "react";

import "../styles/NavMenu.css";

import { Link } from "react-router-dom";
import {
    Collapse,
    Container,
    Navbar,
    NavbarBrand,
    NavbarToggler,
    NavItem,
    NavLink
} from "reactstrap";

const NavMenu: React.FC = () => {
	const [collapsed, setCollapsed] = React.useState<boolean>(true);
	const toggleNavbar = React.useCallback(
		() => setCollapsed(prevValue => !prevValue),
		[setCollapsed]
	);

	return (
		<header>
			<Navbar className="navbar-expand-sm navbar-toggleable-sm ng-white border-bottom box-shadow mb-3" light>
				<Container>
					<NavbarBrand tag={Link} to="/">StShop</NavbarBrand>
					<NavbarToggler onClick={toggleNavbar} className="mr-2" />
					<Collapse className="d-sm-inline-flex flex-sm-row-reverse" isOpen={!collapsed} navbar>
						<ul className="navbar-nav flex-grow">
							<NavItem>
								<NavLink tag={Link} className="text-dark" to="/auth">Login/Sign up</NavLink>
							</NavItem>
							<NavItem>
								<NavLink tag={Link} className="text-dark" to="/users">All users</NavLink>
							</NavItem>
						</ul>
					</Collapse>
				</Container>
			</Navbar>
		</header>
	);
}

export { NavMenu };
