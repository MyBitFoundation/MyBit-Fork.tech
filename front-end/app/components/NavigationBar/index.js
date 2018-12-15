import React from 'react';
import PropTypes from 'prop-types';
import styled from 'styled-components';
import Button from '../Button';
import Constants from '../Constants';
 import SidebarMobile from './sidebarMobile';
import HamburgerButton from './menu-icon.svg'
import Img from '../Img';

const StyledNav = styled.nav`

  .NavigationBar--is-desktop{
    display: flex;
    flex-direction: row;
    width: max-content;
    margin: 0 auto;
    padding-top: 30px;

    @media (max-width: 850px) {
      display: none;
    }
  }

  .Hamburger-button{
    position: absolute;
    right: 20px;
    top: 45px;
    cursor: pointer;

    @media (min-width: 850px) {
      display: none;
    }
  }
`;

const StyledNavLink = styled.div`
  margin: 10px;
`;

const StyledContributeButton = styled.div`
    position: absolute;
    top: 40px;
    right: 30px;
`;

const NavigationBar = (props) => {
  const {links, optionalButton, mobileMenuOpen, handleClickMobileMenu} = props;
  const { pathname } = window.location;

  //optional button shows up when the user is not in the home page
  const isInHome = pathname === "/";

  const toRender = links.filter(link => link.optional !== true).map(link => (
    <StyledNavLink
      key={link.text}
    >
      <Button
        styling={Constants.buttons.secondary.default}
        linkTo={link.linkTo}
        isActive={pathname == link.linkTo}
      >
        {link.text}
       </Button>
     </StyledNavLink>
  ))

  let contributeButton = undefined;

  //optional buttons are displayed when the user is not on the home page
  if(!isInHome && optionalButton){
    toRender.push(
      <StyledNavLink
        key={links[links.length - 1].text}
      >
        <Button
          styling={Constants.buttons.primary.green}
          linkTo={links[links.length - 1].linkTo}
        >
          {links[links.length - 1].text}
         </Button>
       </StyledNavLink>
    )
  }
  //Add button to buy MIB if user is in the home page
  if(isInHome){
    toRender.push(
      <StyledNavLink key="Header-buy-button">
        <Button
          styling={Constants.buttons.primary.blue}
          handleRoute={() => {
            if(BancorConvertWidget){
              BancorConvertWidget.showConvertPopup('buy')
            }}}
        >
          Buy MYB here
         </Button>
       </StyledNavLink>
     )
  }
  //Add contribute button if user is not in the home page
  else{
    contributeButton = (
      <StyledContributeButton>
        <Button
          styling={Constants.buttons.secondary.default}
          href="https://ddf.mybit.io"
          tooltipTitle="Make this dApp awesome here."
          tooltipPlacement="bottomLeft"
          hasTooltip
          pointArrowAtCenter
        >
          Contribute
         </Button>
       </StyledContributeButton>
    )
  }

  return(
    <StyledNav>
      <div
        className="Hamburger-button"
      >
        <a onClick={() => handleClickMobileMenu(true)}>
          <Img
            src={HamburgerButton}
            alt="Mobile menu button"
          />
        </a>
      </div>
      <SidebarMobile
        open={mobileMenuOpen}
        closePopup={handleClickMobileMenu}
        links={props.links}
      />
      <div className="NavigationBar--is-desktop">
        {toRender}
        {contributeButton}
      </div>
    </StyledNav>
  )
}

NavigationBar.propTypes = {
  links: PropTypes.arrayOf(PropTypes.shape({
     text: PropTypes.string.isRequired,
     optional: PropTypes.bool,
     linkTo: PropTypes.string.isRequired,
   })).isRequired,
  optionalButton: PropTypes.bool.isRequired,
  mobileMenuOpen: PropTypes.bool.isRequired,
  handleClickMobileMenu: PropTypes.func.isRequired,
};


export default NavigationBar;
