import { FC } from "react";
import styled from "styled-components";
import { NavLink as RRNavLink } from "react-router-dom";
import { Nav, NavItem, NavLink } from "reactstrap";

const SidebarWrapper = styled.div`
  position: fixed;
  left: 0;
  top: 0;
  bottom: 0;
  width: 250px;
  background-color: ${({ theme }) => theme.colors.sidebarBg};
  color: ${({ theme }) => theme.colors.sidebarText};
  box-shadow: ${({ theme }) => theme.shadows.sidebar};
  z-index: 1000;
`;

const SidebarHeader = styled.div`
  padding: ${({ theme }) => theme.spacing.lg};
  border-bottom: 1px solid rgba(255, 255, 255, 0.1);
`;

const SidebarMenu = styled(Nav)`
  padding: ${({ theme }) => theme.spacing.md} 0;
`;

const SidebarLink = styled(NavLink)`
  color: ${({ theme }) => theme.colors.sidebarText} !important;
  padding: ${({ theme }) => theme.spacing.md} ${({ theme }) => theme.spacing.lg};

  &.active {
    background-color: rgba(255, 255, 255, 0.1);
    border-left: 4px solid ${({ theme }) => theme.colors.primary};
  }

  &:hover {
    background-color: rgba(255, 255, 255, 0.05);
  }
`;

const Sidebar: FC = () => {
  return (
    <SidebarWrapper>
      <SidebarHeader>
        <h3>Svix Admin</h3>
      </SidebarHeader>
      <SidebarMenu vertical>
        <NavItem>
          <SidebarLink tag={RRNavLink} to="/applications">
            Applications
          </SidebarLink>
        </NavItem>
        <NavItem>
          <SidebarLink tag={RRNavLink} to="/endpoints">
            Consumers
          </SidebarLink>
        </NavItem>
        <NavItem>
          <SidebarLink tag={RRNavLink} to="/messages">
            Messages
          </SidebarLink>
        </NavItem>
        <NavItem>
          <SidebarLink tag={RRNavLink} to="/event-types">
            Event Types
          </SidebarLink>
        </NavItem>
        {/* Add more sidebar items as needed */}
      </SidebarMenu>
    </SidebarWrapper>
  );
};

export default Sidebar;
