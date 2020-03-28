import * as React from "react";

import "../styles/NavMenu.css";

import { Link } from "react-router-dom";
import {
    Badge,
    Button,
    Collapse,
    Container,
    Navbar,
    NavbarBrand,
    NavbarText,
    NavbarToggler,
    NavItem,
    NavLink
} from "reactstrap";

import { UserContext } from "../../contracts";

const NavMenu: React.FC = () => {
	const [collapsed, setCollapsed] = React.useState<boolean>(true);
	const toggleNavbar = React.useCallback(
		() => setCollapsed(prevValue => !prevValue),
		[setCollapsed]
	);

	const { user, resetUser } = React.useContext(UserContext);

	const logout = React.useCallback(
		() => {
			async function requestLogout() {
                const response = await fetch(
					"account/logout",
					{ method: "POST" }
				);

                if (response.ok) {
                    resetUser();
				}
				// TODO: add error handling
            }

			requestLogout();
		},
		[resetUser]
	);

	return (
		<header>
			<Navbar className="navbar-expand-sm navbar-toggleable-sm ng-white border-bottom box-shadow mb-3" light>
				<Container>
					<NavbarBrand tag={Link} to="/">StShop</NavbarBrand>
					{user?.email && (
						<NavbarText>
							<Badge color="primary">{user.email}</Badge>
						</NavbarText>
					)}
					<NavbarToggler onClick={toggleNavbar} className="mr-2" />
					<Collapse className="d-sm-inline-flex flex-sm-row-reverse" isOpen={!collapsed} navbar>
						<ul className="navbar-nav flex-grow">
							<NavItem>
								<NavLink tag={Link} className="text-dark" to="/auth">Login/Sign up</NavLink>
							</NavItem>
							<NavItem>
								<NavLink tag={Link} className="text-dark" to="/users">All users</NavLink>
							</NavItem>
							{user?.email && (
								<NavItem>
									<NavLink tag={Button} outline color="danger" className="text-dark" onClick={logout}>Logout</NavLink>
								</NavItem>
							)}
						</ul>
					</Collapse>
				</Container>
			</Navbar>
		</header>
	);
}

export { NavMenu };
