import { FC, ReactNode } from "react";
import styled from "styled-components";
import { Container } from "reactstrap";
import Navbar from "./Navbar";
import Sidebar from "./Sidebar";

interface LayoutProps {
  children: ReactNode;
}

const LayoutWrapper = styled.div`
  display: flex;
  min-height: 100vh;
`;

const Content = styled.main`
  flex: 1;
  padding: ${({ theme }) => theme.spacing.md};
  margin-left: 250px; // Width of the sidebar
`;

const Layout: FC<LayoutProps> = ({ children }) => {
  return (
    <LayoutWrapper>
      <Sidebar />
      <Content>
        <Navbar />
        <Container fluid className="mt-4">
          {children}
        </Container>
      </Content>
    </LayoutWrapper>
  );
};

export default Layout;
