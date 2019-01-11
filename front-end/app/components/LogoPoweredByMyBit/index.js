import React from 'react';
import styled from 'styled-components'
import Logo from './logo.svg';
import Img from '../Img';

const StyledLogo = styled.div`
  position: relative;
  text-align: right;
  padding-right: 10px;
  margin-bottom: 20px;
  margin-top: 50px;
`

const LogoPoweredByMyBit = () => (
    <StyledLogo>
      <Img
        src={Logo}
        alt="Powered By MyBit"
      />
    </StyledLogo>
);

export default LogoPoweredByMyBit;
