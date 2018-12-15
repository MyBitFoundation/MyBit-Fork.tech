/*
 * TransactionsPage
 *
 * List all transactions
 */
import React from 'react';
import PropTypes from 'prop-types';
import { Helmet } from 'react-helmet';
import styled from 'styled-components';
import Table from 'antd/lib/table';
import Pagination from 'antd/lib/pagination';
import 'antd/lib/table/style/css';
import 'antd/lib/pagination/style/css';
import Constants from 'components/Constants';
// import QuestionMark from 'components/input/questionMark.svg';
import Img from 'components/Img';
import Button from 'components/Button';
import Tooltip from 'components/Tooltip';
import ConnectionStatus from 'components/ConnectionStatus';
import Collapse from 'antd/lib/collapse';
import 'antd/lib/collapse/style/css';

const Panel = Collapse.Panel;

const StyledCollapse = styled.div`

  .Transactions__external-icon{
    width: 20px;
    display: none;
    float: right;

    @media (max-width: 540px) {
     display: block;
    }
  }

  .Transactions__external-text{
    @media (max-width: 540px) {
     display: none;
    }
  }

  .Transactions__amount {
    margin-left: 100px;
    @media (max-width: 720px) {
      margin-left: 40px;
    }
  }

  .Transactions__hash {
    float: right;
    
    @media (max-width: 390px) {
      display: none;
    }
  }

  .Transactions__address-small{
    display: none;
    @media (max-width: 390px) {
     display: ininial;
    }
  }

  .Transactions__address-medium{
    display: none;
    @media (max-width: 720px) {
     display: inline-block;
    }

    @media (max-width: 390px) {
     display: none;
    }
  }

  .Transactions__address-big{
    display: ininial;

    @media (max-width: 720px) {
     display: none;
    }

  }

  .ant-table-placeholder{
    border-bottom-left-radius: 4px;
    border-bottom-right-radius: 4px;
  }

  .ant-table-content{
    background-color: white;
    border-radius: 4px;
  }

  .ant-collapse{
    width: 650px;

    @media (max-width: 720px) {
     width: 500px;
    }

    @media (max-width: 540px) {
     width: 400px;
    }

    @media (max-width: 430px) {
     width: 340px;
    }

    @media (max-width: 390px) {
     width: 280px;
    }
  }
`;

export default class TransactionsPage extends React.Component {
  constructor(props){
    super(props);
    this.state = {
      currentPage: 0,
      transactionsProcessing: [],
    }
    this.itemsPerPage = 5;
    this.removeTransactionFromProcess = this.removeTransactionFromProcess.bind(this);
  }

  async removeTransactionFromProcess(id){
    await this.props.getTransactions();
    let newTransactionsProcessing = Object.assign([], this.state.transactionsProcessing);
    const indexOfContract = newTransactionsProcessing.indexOf(id);
    if(indexOfContract > -1){
      newTransactionsProcessing.splice(indexOfContract, 1);
      this.setState({transactionsProcessing: newTransactionsProcessing})
    }
  }

  render() {
    const {requestedTransactions, receivedTransactions} = this.props;
    return (
      <div>
        <Helmet>
          <title>Transactions - MyBit Fork</title>
          <meta
            name="Transactions"
            content="Your tansactions on the MyBit Fork dApp"
          />
        </Helmet>
        <ConnectionStatus
          network={this.props.network}
          constants={Constants}
          loading={this.props.loadingNetwork}
        />
        <StyledCollapse>
          <Collapse defaultActiveKey={['1']}>
            {requestedTransactions.length > 0 &&
              <Panel header="Payment Requested" key="1">
                {requestedTransactions.map(transaction => {
                  return <div>
                    <span className="Transactions__address-big">
                      {Constants.functions.shortenAddress(transaction.to)}
                    </span>
                    <span className="Transactions__address-medium">
                      {Constants.functions.shortenAddress(transaction.to, 7, 4)}
                    </span>
                    <span className="Transactions__address-small">
                      {Constants.functions.shortenAddress(transaction.to, 5, 3)}
                    </span>
                    <span className="Transactions__amount">{transaction.amount} ETH</span>
                    <span className="Transactions__hash">Not paid</span>
                  </div>
                })}
              </Panel>
            }
            {receivedTransactions.length > 0 &&
              <Panel header="Payment Received" key="2">
                {receivedTransactions.map(transaction => {
                  return <div>
                    <span className="Transactions__address-big">
                      {Constants.functions.shortenAddress(transaction.to)}
                    </span>
                    <span className="Transactions__address-medium">
                      {Constants.functions.shortenAddress(transaction.to, 7, 4)}
                    </span>
                    <span className="Transactions__address-small">
                      {Constants.functions.shortenAddress(transaction.to, 5, 3)}
                    </span>
                    <span className="Transactions__amount">{transaction.amount} ETH</span>
                    <a className="Transactions__hash" href={`https://etherscan.io/tx/${transaction.transactionHash}`}>View on Ethscan</a>
                  </div>
                })}
              </Panel>
            }
          </Collapse>
        </StyledCollapse>
      </div>
    );
  }
}

TransactionsPage.propTypes = {
  getTransactions: PropTypes.func.isRequired,
  receivedTransactions: PropTypes.arrayOf(PropTypes.shape({
    to: PropTypes.string.isRequired,
    id: PropTypes.string.isRequired,
    amount: PropTypes.string.isRequired,
    transactionHash: PropTypes.string.isRequired
   })).isRequired,
  requestedTransactions: PropTypes.arrayOf(PropTypes.shape({
    to: PropTypes.string.isRequired,
    id: PropTypes.string.isRequired,
    amount: PropTypes.string.isRequired,
    transactionHash: PropTypes.string.isRequired
  })).isRequired,
  loading: PropTypes.bool.isRequired,
  network: PropTypes.string.isRequired,
  loadingNetwork: PropTypes.bool.isRequired,
};
