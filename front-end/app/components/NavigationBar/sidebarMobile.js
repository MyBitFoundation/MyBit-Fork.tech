import React from 'react';
import styled from 'styled-components';
import classNames from 'classnames'
import StyledMobileMenu from './StyledMobileMenu';
import StyledIconList from './StyledIconList';
import { socialIcons } from './socialIcons';

const SidebarMobile = ({links, open, closePopup}) => {

  //we need to add another link (contribute)
  let mobileLinks = links.slice();

  mobileLinks.push({
    text: 'Contribute',
    linkTo: 'https://ddf.mybit.io',
    external: true
  })

  const linksToRender = mobileLinks.map((link) => {
      return(
        <a
          key={link.linkTo}
          href={link.linkTo}
          className={
          classNames({
            'SidebarMobile__overlay-link': true,
            'SidebarMobile__overlay-link--is-visible' : open
          })
        }

          target={link.external ? "_blank" : ""}
          rel="noopener noreferrer"
        >
          {link.text}
        </a>
      )
    })

  const socialToRender = (
    <StyledIconList>
      <div className="IconList">
      {
        socialIcons.map(icon => {
          return (
            <a
              key={icon.name}
              href={icon.href}
              target="_blank"
              rel='noopener noreferrer'
            >
              <div className="socialIcon">
                <div className={`socialIcon__wrapper socialIcon--is-${icon.name}`} />
              </div>
            </a>
          )})
      }
      </div>
    </StyledIconList>
  )

  return(
    <StyledMobileMenu>
      <div className={
          classNames({
            'SidebarMobile': true,
            'SidebarMobile--is-visible' : open,
          })
        }
      >
          <a
            className={
              classNames({
                'SidebarMobile__overlay-btn-close': true,
                'SidebarMobile__overlay-btn-close--is-visible' : open,
              })
            }
            onClick={() => closePopup(false)}
          >
            &times;
          </a>
        {linksToRender}
        {socialToRender}
      </div>
    </StyledMobileMenu>
  )
}

export default SidebarMobile;
