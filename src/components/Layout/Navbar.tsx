import { FC } from "react";
import styled from "styled-components";
import { Navbar as RSNavbar, NavbarBrand } from "reactstrap";

const StyledNavbar = styled(RSNavbar)`
  background-color: ${({ theme }) => theme.colors.white};
  box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
  padding: ${({ theme }) => theme.spacing.md} ${({ theme }) => theme.spacing.lg};
`;

const Navbar: FC = () => {
  return (
    <StyledNavbar light expand="md">
      <NavbarBrand>Svix Dashboard</NavbarBrand>
      {/* You can add more navbar items here like a search bar, notifications, user profile, etc. */}
    </StyledNavbar>
  );
};

export default Navbar;
