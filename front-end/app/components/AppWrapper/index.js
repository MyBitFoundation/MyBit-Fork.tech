import React from 'react';
import PropTypes from 'prop-types';
import Constants from '../Constants';
import styled from 'styled-components'
import classNames from 'classnames'

const StyledAppWrapper = styled.div`
  .AppWrapper{
    background: ${Constants.colors.backgroundGradient}
    margin: 0 auto;
    height: 100%;
    padding: 0 16px;
    color: white;
    min-height: 100vh;

    &--is-mobile-menu-open{
      height: 100vh;
      overflow: hidden;
    }
  }
`;

const AppWrapper = ({mobileMenuOpen, children}) => (
	<StyledAppWrapper>
    <div className={classNames({
            'AppWrapper': true,
            'AppWrapper--is-mobile-menu-open' : mobileMenuOpen
          })}>
      {children}
    </div>
  </StyledAppWrapper>
)

AppWrapper.propTypes = {
  mobileMenuOpen: PropTypes.bool.isRequired,
  children: PropTypes.oneOfType([
    PropTypes.arrayOf(PropTypes.node),
    PropTypes.node
  ]).isRequired,
};

export default AppWrapper;
