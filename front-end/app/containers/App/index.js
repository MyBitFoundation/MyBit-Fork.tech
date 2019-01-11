/**
 *
 * App
 *
 * This component is the skeleton around the actual pages, and should only
 * contain code that should be seen on all pages. (e.g. navigation bar)
 */

import React from 'react';
import { Helmet } from 'react-helmet';
import styled from 'styled-components';
import { Switch, Route } from 'react-router-dom';

import HomePage from 'containers/HomePage/Loadable';
import CreateNewPage from 'containers/CreateNewPage/Loadable';
import TransactionsPage from 'containers/TransactionsPage/Loadable';
import PayPage from 'containers/PayPage/Loadable';
import NotFoundPage from 'containers/NotFoundPage/Loadable';
import Header from 'components/Header';
import Footer from 'components/Footer';
import AppWrapper from 'components/AppWrapper';
import MyBitForkLogo from 'components/MyBitForkLogo';
import PageWrapper from 'components/PageWrapper';
import Button from 'components/Button';
import Constants from 'components/Constants';
import NavigationBar from 'components/NavigationBar';
import BlockchainInfoContext from 'components/Context/BlockchainInfoContext';
import { Links } from '../../constants';

class App extends React.Component {
  constructor(props){
    super(props);
    this.state = {mobileMenuOpen: false}
    this.handleClickMobileMenu = this.handleClickMobileMenu.bind(this);
  }

  handleClickMobileMenu(mobileMenuOpen){
    this.setState({mobileMenuOpen});
  }

  render(){
    const { mobileMenuOpen } = this.state;
    return (
      <AppWrapper
        mobileMenuOpen={mobileMenuOpen}
      >
        <Helmet
          defaultTitle="MyBit Fork"
        >
          <meta name="description" content="Schedule a transaction in the ethereum network" />
        </Helmet>
        <Header
          logo={MyBitForkLogo}
          links={Links}
          optionalButton
          mobileMenuOpen={mobileMenuOpen}
          handleClickMobileMenu={this.handleClickMobileMenu}
        />
        <PageWrapper>
          <Switch>
            <Route exact path="/" component={HomePage} />
            <Route path="/pay" component={() =>
              <BlockchainInfoContext.Consumer>
                {({ requestTransactions, loading, pay, getTransactions, network }) =>  (
                    <PayPage
                      requestTransactions={requestTransactions}
                      loading={loading.transactionHistory}
                      pay={pay}
                      getTransactions={getTransactions}
                      network={network}
                      loadingNetwork={loading.network}
                    />
                  )
                }
              </BlockchainInfoContext.Consumer>
            }
            />
            <Route path="/create-new" component={() =>
              <BlockchainInfoContext.Consumer>
                {({ createBill, currentBlock, getTransactions, userAllowed, requestApproval, checkAddressAllowed, user, loading, network }) =>  (
                    <CreateNewPage
                      createBill={createBill}
                      currentBlock={currentBlock}
                      getTransactions={getTransactions}
                      userAllowed={userAllowed}
                      requestApproval={requestApproval}
                      checkAddressAllowed={checkAddressAllowed}
                      user={user}
                      loading={loading.user}
                      network={network}
                      loadingNetwork={loading.network}
                    />
                  )
                }
              </BlockchainInfoContext.Consumer>
            }
            />
            <Route path="/transactions" component={() =>
              <BlockchainInfoContext.Consumer>
                {({ receivedTransactions, requestedTransactions, loading, getTransactions, network }) =>  (
                    <TransactionsPage
                      receivedTransactions={receivedTransactions}
                      requestedTransactions={requestedTransactions}
                      loading={loading.transactionHistory}
                      getTransactions={getTransactions}
                      network={network}
                      loadingNetwork={loading.network}
                    />
                  )
                }
              </BlockchainInfoContext.Consumer>
            }
            />
          </Switch>
        </PageWrapper>
        <Footer />
      </AppWrapper>
    );
  }
}

export default App;
