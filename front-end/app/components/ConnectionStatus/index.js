import React from 'react';
import styled from 'styled-components';

const StyledCircleIndicator = styled.div`
  width: 6px;
  height: 6px;
  background-color: ${props => props.circleColor};
  border-radius: 50%;
  display: inline-block;
`;

const StyledSpan = styled.span`
  margin-left: 10px;
`;

const StyledConnectionStatus = styled.div`
  text-align: center;
  position: relative;
  top: -17px;
`;

const ConnectionStatus = (props) => {
  const network = props.network === "main" ? "Mainnet" : props.network === "ropsten" ? "Testnet" : undefined;
  const circleColor = network === "Mainnet" ? props.constants.buttons.primary.green.backgroundColor : "red";
  let toRender = "";
  if(props.loading){
    toRender = "Loading network...";
  }
  else if(network){
    toRender = `Connected to ${network}`;
  }
  else{
    toRender = "Connected to unknown network";
  }

  return(
    <StyledConnectionStatus>
      <StyledCircleIndicator circleColor={circleColor} />
      <StyledSpan>{toRender}</StyledSpan>
    </StyledConnectionStatus>
  )
}

export default ConnectionStatus;
