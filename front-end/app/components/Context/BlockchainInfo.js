import React from 'react';
import PropTypes from 'prop-types';
import BlockchainInfoContext from './BlockchainInfoContext';
import * as Core from '../../utils/core';
import Web3 from '../../utils/core';

class BlockchainInfo extends React.Component {
  constructor(props) {
    super(props);

    this.loadMetamaskUserDetails = this.loadMetamaskUserDetails.bind(this);
    this.createBill = this.createBill.bind(this);
    this.getCurrentBlockNumber = this.getCurrentBlockNumber.bind(this);
    this.getTransactions = this.getTransactions.bind(this);
    this.pay = this.pay.bind(this);
    this.requestApproval = this.requestApproval.bind(this);
    this.checkAddressAllowed = this.checkAddressAllowed.bind(this);
    this.getNetwork = this.getNetwork.bind(this);

    this.state = {
      loading: {
        user: true,
        transactionHistory: true,
        network: true,
      },
      receivedTransactions: [],
      requestedTransactions: [],
      requestTransactions: [],
      user: {
        myBitBalance: 0,
        etherBalance: 0,
        userName: ""
      },
      createBill: this.createBill,
      currentBlock: 0,
      getTransactions: this.getTransactions,
      pay: this.pay,
      requestApproval: this.requestApproval,
      checkAddressAllowed: this.checkAddressAllowed,
      //can be ropsten or main - else unknown
      network: ""
    };
  }

  async componentWillMount() {
    this.getTransactionsInterval = setInterval(this.getTransactions, 10000);
    this.getUserDetailsInterval = setInterval(this.loadMetamaskUserDetails, 5000);

    try {
      //we need this to pull the user details
      await this.getNetwork();

      // we need the prices and the user details before doing anything
      await Promise.all([this.loadMetamaskUserDetails(this.state.network), this.getCurrentBlockNumber()]);
      do {
        await this.checkAddressAllowed();
      } while (!this.state.user.userName)
      await this.getTransactions();
    } catch (err) {
      console.log(err);
    }
    window.web3.currentProvider.publicConfigStore.on("update", data => {
      if (
        data["selectedAddress"].toUpperCase() !==
        this.state.user.userName.toUpperCase()
      )
        window.location.reload();
    });
  }

  async getNetwork() {
    try {
      new Promise(async (resolve, reject) => {
        let network = await Web3.eth.net.getNetworkType();

        this.setState({
          network, loading: {
            ...this.state.loading,
            network: false,
          }
        }, () => resolve())
      });
    } catch (err) {
      setTimeout(this.getNetwork, 1000);
    }
  }

  async componentWillUnmount() {
    clearInterval(this.getTransactionsInterval);
    clearInterval(this.getUserDetailsInterval);
  }

  async requestApproval() {
    return Core.requestApproval(this.state.user.userName, this.state.network);
  }

  async checkAddressAllowed() {
    try {
      const allowed = await Core.getAllowanceOfAddress(this.state.user.userName, this.state.network);
      this.setState({ userAllowed: allowed });
    } catch (err) {
      console.log(err);
    }
  }

  async getCurrentBlockNumber() {
    try {
      const currentBlock = await Web3.eth.getBlockNumber();
      this.setState({ currentBlock })
    } catch (err) {
      setTimeout(this.getCurrentBlockNumber, 1000);
    }
  }

  createBill(to, amount) {
    return Core.createBill(this.state.user.userName, to, amount, this.state.network);
  }

  pay(id, amount) {
    return Core.pay(id, amount, this.state.user.userName, this.state.network);
  }

  async getTransactions() {
    await Core.getLogNewRequest(this.state.network)
      .then(async (response) => {
        const userAddress = this.state.user.userName;
        const receivedTransactions = [];
        const requestedTransactions = [];
        const requestTransactions = [];
        let paids = [];
        const payments = await Core.getLogNewPayment(this.state.network);
        payments.forEach(payment => {
          paids.push(payment.returnValues._idx + "_" + payment.returnValues._recepient);
        })

        try {
          response.forEach(transaction => {
            if (transaction.returnValues._recepient === userAddress) {
              requestTransactions.push({
                id: transaction.returnValues._idx,
                from: transaction.returnValues._creator,
                amount: Web3.utils.fromWei(transaction.returnValues._amount.toString(), 'ether'),
                paid: paids.includes(transaction.returnValues._idx + "_" + transaction.returnValues._recepient),
                transactionHash: transaction.transactionHash
              })
            }
            if (transaction.returnValues._creator === userAddress) {
              if (paids.includes(transaction.returnValues._idx + "_" + transaction.returnValues._recepient)) {
                receivedTransactions.push({
                  id: transaction.returnValues._idx,
                  to: transaction.returnValues._recepient,
                  amount: Web3.utils.fromWei(transaction.returnValues._amount.toString(), 'ether'),
                  transactionHash: transaction.transactionHash
                })
              } else {
                requestedTransactions.push({
                  id: transaction.returnValues._idx,
                  to: transaction.returnValues._recepient,
                  amount: Web3.utils.fromWei(transaction.returnValues._amount.toString(), 'ether'),
                  transactionHash: transaction.transactionHash
                })
              }
            }
          })
        } catch (err) {
          console.log(err)
        }
        
        this.setState({
          receivedTransactions,
          requestedTransactions,
          requestTransactions,
          loading: {
            ...this.state.loading,
            transactionHistory: false,
          }
        })

      })
      .catch((err) => {
        console.log(err);
      });
  }

  async loadMetamaskUserDetails() {
    await Core.loadMetamaskUserDetails(this.state.network)
      .then((response) => {
        this.setState({
          user: response,
          loading: { ...this.state.loading, user: false },
        });
      })
      .catch((err) => {
        setTimeout(this.loadMetamaskUserDetails, 1000);
      });
  }

  render() {
    return (
      <BlockchainInfoContext.Provider value={this.state}>
        {this.props.children}
      </BlockchainInfoContext.Provider>
    );
  }
}

export default BlockchainInfo;

BlockchainInfo.propTypes = {
  children: PropTypes.node.isRequired,
};
