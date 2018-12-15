/*
 * PayPage
 *
 * List all the features
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

const StyledButton = styled.div`
  float: right;
`;

const StyledQuestionMark = styled.span`
  margin-left: 10px;
`;

const StyledTable = styled.div`

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

  .Transactions__address-small{
    display: none;
    @media (max-width: 390px) {
     display: block;
    }
  }

  .Transactions__address-medium{
    display: none;
    @media (max-width: 720px) {
     display: block;
    }

    @media (max-width: 390px) {
     display: none;
    }
  }

  .Transactions__address-big{
    display: block;

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

  .ant-table-body{
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

    tr:last-child td{
      border: none;
    }

     th:last-child{
       display: none;
     }

     tr td:last-child{
       display: none;
     }

     th:nth-child(3){
        border-top-right-radius: 4px;
     }
  }
`;

const StyledSymbol = styled.span`
  font-weight: 500;
`;

const StyledPagination = styled.div`
  float: right;
  margin-top: 10px;
`;

export default class PayPage extends React.Component {
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

  async handlePay(id, amount){
    let newTransactionsProcessing = Object.assign([], this.state.transactionsProcessing);
    newTransactionsProcessing.push(id);
    this.setState({transactionsProcessing: newTransactionsProcessing})
    try{
       await this.props.pay(id, amount);
    }catch(err){
      this.removeTransactionFromProcess(id);
    }
    setTimeout( async () => {
      this.removeTransactionFromProcess(id);
    }, 4000);

  }

  buildData(){
    const statusHeader = (
      <div>
        Status:
        <Tooltip
          title="Here you can pay a bill you've requested."
          arrowPointAtCenter={true}
          placement="topRight"
        >
        </Tooltip>

      </div>
    )

    const columns = [{
      title: 'From:',
      dataIndex: 'from',
      key: 'from',
    }, {
      title: 'Amount:',
      dataIndex: 'amount',
      key: 'amount',
      align: 'center',
    }, {
      title: statusHeader,
      dataIndex: 'status',
      key: 'status',
      align: 'right'
    }, {
    }];

    const { currentPage } = this.state;
    const requestTransactions = this.props.requestTransactions.slice();
    const startIndex = currentPage * this.itemsPerPage;
    let endIndex = (currentPage + 1) * this.itemsPerPage;
    const rows = requestTransactions.reverse().slice(startIndex, endIndex).map(transaction => {

      let status = "";
        if (transaction.paid) {
          status = "Payment Sent"
        } else if(this.state.transactionsProcessing.includes(transaction.id)){
         status = "Paying..."
        } else {
          status = (
            <StyledButton>
              <Button
                styling={Constants.buttons.primary.blue}
                handleRoute={this.handlePay.bind(this, transaction.id, transaction.amount)}
              >
                Pay
              </Button>
            </StyledButton>
          )
        }

      return{
        key: transaction.id,
        from:
        <div>
          {/* solution to render the table on mobile */}
          <span className="Transactions__address-big">
            {Constants.functions.shortenAddress(transaction.from)}
          </span>
          <span className="Transactions__address-medium">
            {Constants.functions.shortenAddress(transaction.from, 7, 4)}
          </span>
          <span className="Transactions__address-small">
            {Constants.functions.shortenAddress(transaction.from, 5, 3)}
          </span>
        </div>,
        amount:
          <span>
            {transaction.amount}{' '}
            <StyledSymbol>
              ETH
            </StyledSymbol>
          </span>,
        status: status
        }
      }
    );

    return {
      columns,
      rows
    }
  }

  render() {
    const {columns, rows} = this.buildData();
    const config = {
      bordered: false,
      loading: this.props.loading,
      size: 'default',
    }
    const shouldRenderPagination = !this.props.loading && rows.length > 0;
    return (
      <div>
        <Helmet>
          <title>Pay - MyBit Fork</title>
          <meta
            name="Pay"
            content="Pay a bill on the MyBit Fork dApp"
          />
        </Helmet>
        <ConnectionStatus
          network={this.props.network}
          constants={Constants}
          loading={this.props.loadingNetwork}
        />
        <StyledTable>
          <Table {...config} columns={columns} dataSource={rows} pagination={false} />
        </StyledTable>
        {shouldRenderPagination &&
          <StyledPagination>
            <Pagination
              onChange={(currentPage) => this.setState({currentPage: currentPage - 1})}
              total={this.props.requestTransactions.length}
              current={this.state.page + 1}
              pageSize={5}
              defaultCurrent={1}
            />
          </StyledPagination>
        }
      </div>
    );
  }
}

PayPage.propTypes = {
  getTransactions: PropTypes.func.isRequired,
  pay: PropTypes.func.isRequired,
  requestTransactions: PropTypes.arrayOf(PropTypes.shape({
     from: PropTypes.string.isRequired,
     id: PropTypes.string.isRequired,
     amount: PropTypes.string.isRequired,
     paid: PropTypes.bool.isRequired,
   })).isRequired,
  loading: PropTypes.bool.isRequired,
  network: PropTypes.string.isRequired,
  loadingNetwork: PropTypes.bool.isRequired,
};
