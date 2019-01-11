import React from 'react';
import styled from 'styled-components';
import NavigationBar from '../NavigationBar';
import ParticlesOverlay from '../ParticlesOverlay';
import Button from '../Button';
import Constants from '../Constants';

const StyledHeader = styled.header`
  height: 110px;
`;

const Header = ({ logo, links, mobileMenuOpen, handleClickMobileMenu, optionalButton=false }) => {
  return(
    <StyledHeader>
      <ParticlesOverlay/>
      {logo}
      <NavigationBar
        links={links}
        optionalButton={optionalButton}
        mobileMenuOpen={mobileMenuOpen}
        handleClickMobileMenu={handleClickMobileMenu}
      />
    </StyledHeader>
  )

}

export default Header;
