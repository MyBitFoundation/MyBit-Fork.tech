/*
 * Create New Fork Page
 *
 * Page to create fork contracts
 */

import React from 'react';
import PropTypes from 'prop-types';
import { Helmet } from 'react-helmet';
import styled from 'styled-components';
import ContainerCreate from 'components/ContainerCreate';
import Image from '../../images/secure.svg';
import Input from 'components/Input';
import Web3 from '../../utils/core';
import Constants from 'components/Constants';
import Checkbox from 'antd/lib/checkbox';
import LoadingIndicator from 'components/LoadingIndicator';
import ConnectionStatus from 'components/ConnectionStatus';

import 'antd/lib/checkbox/style/css';

const blocksPerSecond = 14;

const StyledTermsAndConditions = styled.s`
  font-size: 12px;
  font-family: 'Roboto';
  margin-bottom: 10px;
  text-decoration: none;

  a{
    color: #1890ff;
  }
`;

const StyledClickHere = styled.s`
  color: #1890ff;
  text-decoration: underline;
`;

const StyledTermsAndConditionsWrapper = styled.div`
  margin-bottom: 10px;
`;

export default class CreateNewPage extends React.Component {
  constructor(props){
    super(props);

    this.state = {
      shouldConfirm: false,
      isLoading: false,
      acceptedToS: false,
      recepients: [""],
    }
    this.details = [];
    this.handleConfirm = this.handleConfirm.bind(this);
    this.handleBack = this.handleBack.bind(this);
    this.handleClose = this.handleClose.bind(this);
    this.handleAlertClosed = this.handleAlertClosed.bind(this);
    this.handleTermsAndConditionsClicked = this.handleTermsAndConditionsClicked.bind(this);
  }

  handleClose(){
    this.setState({
      shouldConfirm: false,
      recepients: [""],
      amountEth: '',
      blockNumber: '',
    })
  }

  handleBack(){
    this.setState({shouldConfirm: false})
  }

  async handleConfirm(){
    const { recepients, blockNumber, amountEth } = this.state;

    let alertType = undefined;
    let alertMessage = undefined;
    this.setState({alertType})

    if(this.props.user.myBitBalance < 250){
      alertMessage = <span>Your MYB balance is below 250, click <StyledClickHere onClick={() => BancorConvertWidget.showConvertPopup('buy')}>here</StyledClickHere> to buy more.</span>
    } else if(!amountEth || amountEth == 0){
      alertMessage = "Amount of ETH needs to be higher than zero.";
    }
    let validRecepients = [];
    for (let i in recepients) {
      if (recepients[i] && !Web3.utils.isAddress(recepients[i])) {
        alertMessage = `Please enter a valid Ethereum address at recepient ${parseInt(i)+1}.`;
      } else if (recepients[i] && validRecepients.includes(recepients[i])) {
        alertMessage = `Recepient ${parseInt(i)+1} address is duplicated.`;
      } else if (recepients[i]) {
        validRecepients.push(recepients[i]);
      }
    }
    if (!alertMessage && validRecepients.length == 0) {
      alertMessage = "Please enter at least one recepient";
    }

    if(alertMessage){
      alertType = 'error';
      this.setState({
        alertType,
        alertMessage
      })
      return;
    }

    //generate details
    let amountEach = (amountEth / validRecepients.length);
    this.details = [];
    this.details.push({
      title: 'Request funds from',
      content: validRecepients.map(r => Constants.functions.shortenAddress(r))
    }, {
      title: 'Amount',
      content: [amountEach + " ETH/each"]
    })

    this.setState({shouldConfirm: true})
    this.setState({ alertType: 'info', alertMessage: "Waiting for confirmations." });

    console.log("hererere")

    try {
      let result = true;
      if(!this.props.userAllowed){
        result = await this.props.requestApproval();
      }

      console.log(result)

      if(result){
        result = await this.props.createBill(
          validRecepients,
          amountEach
        );
      }
      if (result) {
        this.setState({ alertType: 'success', alertMessage: "Transaction confirmed." });
      } else {
        this.setState({ alertType: 'error',  alertMessage: "Transaction failed. Please try again with more gas." });
      }
      this.props.checkAddressAllowed();
      this.props.getTransactions();
    } catch (err) {
      this.setState({ alertType: undefined});
    }
  }

  handleTermsAndConditionsClicked(e){
    this.setState({acceptedToS: e.target.checked});
  }

  handleAlertClosed(){
    this.setState({alertType: undefined})
  }

  handleInputChange(text, id){
    this.setState({
      [id]: text,
    })
  }

  handleRecipientChange(address, idx){
    this.state.recepients[idx] = address
    if (idx + 1 == this.state.recepients.length && address) this.state.recepients.push("")
    this.setState({
      recepients: this.state.recepients,
    })
  }

  render() {
    let toRender = [];
    if(this.props.loading){
      return <LoadingIndicator />
    }

    toRender.push(
      <ConnectionStatus
        network={this.props.network}
        constants={Constants}
        key={"connection status"}
        loading={this.props.loadingNetwork}
      />
    )

    const content = (
      <div key="content">
        <Input
          placeholder="Total Bill Amount"
          type="number"
          value={this.state.amountEth}
          onChange={(number) => this.handleInputChange(number, 'amountEth')}
          tooltipTitle="Enter the total amount you're owed?"
          hasTooltip
          min={0}
        />
        {this.state.recepients.map((item, i) => <Input
            key={i}
            placeholder={`Recipient ${i > 0 ? i + 1 : ""}`}
            value={item}
            onChange={(e) => this.handleRecipientChange(e.target.value, i)}
            tooltipTitle="Enter the address of people who owe you money"
            hasTooltip
          />
        )}
        <StyledTermsAndConditionsWrapper>
          <Checkbox
            onChange={this.handleTermsAndConditionsClicked}
          >
          <StyledTermsAndConditions>
            I agree to the <a href="#">Terms and Conditions</a>.
          </StyledTermsAndConditions>
          </Checkbox>
        </StyledTermsAndConditionsWrapper>
      </div>
    )

    if(this.state.shouldConfirm){
      toRender.push(
        <ContainerCreate
          key="containerConfirm"
          type="confirm"
          handleClose={this.handleClose}
          handleBack={this.handleBack}
          alertType={this.state.alertType}
          alertMessage={this.state.alertMessage}
          handleAlertClosed={this.handleAlertClosed}
          details={this.details}
        />
      )
    }
    else{
      toRender.push(
        <ContainerCreate
          key="containerCreate"
          type="input"
          image={Image}
          alt="Placeholder image"
          content={content}
          handleConfirm={this.handleConfirm}
          alertType={this.state.alertType}
          alertMessage={this.state.alertMessage}
          handleAlertClosed={this.handleAlertClosed}
          acceptedToS={this.state.acceptedToS}
        />
      )
    }

    return (
      <article>
        <Helmet>
          <title>Create - MyBit Fork</title>
          <meta
            name="Create"
            content="Create a transaction to take place on a given block on the MyBit Fork dApp"
          />
        </Helmet>
        {toRender}
      </article>
    );
  }
}

CreateNewPage.defaultProps = {
  userAllowed: false,
  currentBlock: 0,
};

CreateNewPage.propTypes = {
  userAllowed: PropTypes.bool.isRequired,
  currentBlock: PropTypes.number.isRequired,
  user: PropTypes.shape({
    myBitBalance: PropTypes.number.isRequired,
  }).isRequired,
  loading: PropTypes.bool.isRequired,
  network: PropTypes.string.isRequired,
  loadingNetwork: PropTypes.bool.isRequired,
};
