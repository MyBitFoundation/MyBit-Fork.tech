import React from 'react';
import styled from 'styled-components'

const StyledPageWrapper = styled.div`
  max-width: 1025px;
  margin: 0 auto;
  display: flex;
  align-items: center;
  flex-direction: column;
  position: relative;
  min-height: 620px;
`;

const PageWrapper = ({ children }) => {
  <StyledPageWrapper>
    {children}
  </StyledPageWrapper>
}

export default StyledPageWrapper;
