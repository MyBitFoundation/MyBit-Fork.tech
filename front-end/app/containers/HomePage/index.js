/*
 * HomePage
 *
 * This is the first thing users see of our App, at the '/' route
 */

import React from 'react';
import PropTypes from 'prop-types';
import { Helmet } from 'react-helmet';
import { FormattedMessage } from 'react-intl';
import styled from 'styled-components';

import H1 from 'components/H1';
import P from 'components/P';
import Button from 'components/Button';
import Constants from 'components/Constants';
import ReposList from 'components/ReposList';
import AtPrefix from './AtPrefix';
import CenteredSection from './CenteredSection';
import Form from './Form';
import Input from './Input';
import Section from './Section';
import messages from './messages';

const StyledNote = styled.div`
  margin-top: 40px;
`;

const StyledHowTo = styled.span`
  span{
    margin: 0px 0px;
    display: block;
  }
`;

const StyledMetamaskLink = styled.a`
  color: #ffffff;
  text-decoration: underline;

  &:hover{
    color: #ffffff;
    text-decoration: underline;
  }
`;

const StyledParagraphGroupText = styled.div`
  margin-top: 30px;
`;

const StyledCreateNewButton = styled.div`
  margin-top: 50px;
`;

const StyledMakeDappAwesome = styled.div`
  margin-top: 80px;
`;

const StyledCenterButton = styled.div`
  margin: 0 auto;
  width: max-content;
`;

const StyledPage = styled.article`
  text-align: center;
  margin-top: 30px;
`;

export class HomePage extends React.PureComponent {
  render() {
    return (
      <StyledPage>
        <Helmet>
          <title>MyBit Fork</title>
          <meta
            name="MyBit Fork"
            content="Create a transactions on the MyBit Fork dApp"
          />
        </Helmet>
        <H1>
          Split a bill and request payment in Ether.
        </H1>
        <StyledParagraphGroupText>
          <P
            fontSize={Constants.paragraphs.homePage.fontSize}
            textAlign={Constants.paragraphs.homePage.textAlign}
            text="How it works:"
          />
          <P
            fontSize={Constants.paragraphs.homePage.fontSize}
            textAlign={Constants.paragraphs.homePage.textAlign}
            text="MyBit Fork is a tool to make it easy to split bills"
          />
          <P
            fontSize={Constants.paragraphs.homePage.fontSize}
            textAlign={Constants.paragraphs.homePage.textAlign}
          >
            <StyledHowTo>
              <span>1. Enable Metamask</span>
              <span>2. Enter amount of ETH owed for bill</span>
              <span>3. Enter ETH addresses which will be used to pay. All will be requested the same amount</span>
            </StyledHowTo>
          </P>
          <StyledNote>
            <P
              fontSize={Constants.paragraphs.homePage.fontSize}
              textAlign={Constants.paragraphs.homePage.textAlign}
              text="Please note: although live, this dApp is still under development."
            />
          </StyledNote>
        </StyledParagraphGroupText>
        <StyledCenterButton>
          <StyledCreateNewButton>
            <Button
              styling={Constants.buttons.primary.green}
              linkTo="/create-new"
              size="large"
            >
              Create new
             </Button>
           </StyledCreateNewButton>
         </StyledCenterButton>
         <StyledMakeDappAwesome>
           <P
              fontSize={Constants.paragraphs.homePage.fontSize}
              textAlign={Constants.paragraphs.homePage.textAlign}
              text="Make this dApp awesome here:"
            />
          </StyledMakeDappAwesome>
          <StyledCenterButton>
            <Button
              styling={Constants.buttons.secondary.default}
              href="https://ddf.mybit.io"
            >
              Contribute
             </Button>
          </StyledCenterButton>
      </StyledPage>
    );
  }
}

HomePage.propTypes = {
  loading: PropTypes.bool,
  error: PropTypes.oneOfType([PropTypes.object, PropTypes.bool]),
  repos: PropTypes.oneOfType([PropTypes.array, PropTypes.bool]),
  onSubmitForm: PropTypes.func,
  username: PropTypes.string,
  onChangeUsername: PropTypes.func,
};

export default HomePage;
