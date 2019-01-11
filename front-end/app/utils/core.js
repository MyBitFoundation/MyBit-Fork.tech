import dayjs from 'dayjs';
import getWeb3Async from './web3';

import * as ForkRopsten from '../constants/contracts/ropsten/Fork';
import * as MyBitBurnerRopsten from '../constants/contracts/ropsten/MyBitBurner';
import * as MyBitTokenRopsten from '../constants/contracts/ropsten/MyBitToken';

import * as ForkMainnet from '../constants/contracts/mainnet/Fork';
import * as MyBitBurnerMainnet from '../constants/contracts/mainnet/MyBitBurner';
import * as MyBitTokenMainnet from '../constants/contracts/mainnet/MyBitToken';

import * as ForkPrivate from '../constants/contracts/private/Fork';
import * as MyBitBurnerPrivate from '../constants/contracts/private/MyBitBurner';
import * as MyBitTokenPrivate from '../constants/contracts/private/MyBitToken';

import { ETHERSCAN_TX, ETHERSCAN_TX_FULL_PAGE } from '../constants';
import axios from 'axios';
const Web3 = getWeb3Async();

const burnValue = "250";
const burnValueWei = Web3.utils.toWei(burnValue, 'ether');

const getMyBitBurnerAddress = (network) => {
  if (network === "private") {
    return MyBitBurnerPrivate.ADDRESS;
  } else if (network === "ropsten") {
    return MyBitBurnerRopsten.ADDRESS;
  } else {
    return MyBitBurnerMainnet.ADDRESS;
  }
}

const getContract = (name, network, address) => {
  let contract = undefined;
  if (network === "private") {
    switch (name) {
      case 'Fork':
        contract = ForkPrivate;
        break;
      case 'MyBitBurner':
        contract = MyBitBurnerPrivate;
        break;
      case 'MyBitToken':
        contract = MyBitTokenPrivate;
        break;
    }
  } else if (network === "ropsten") {
    switch (name) {
      case 'Fork':
        contract = ForkRopsten;
        break;
      case 'MyBitBurner':
        contract = MyBitBurnerRopsten;
        break;
      case 'MyBitToken':
        contract = MyBitTokenRopsten;
        break;
    }
  } else {
    switch (name) {
      case 'Fork':
        contract = ForkMainnet;
        break;
      case 'MyBitBurner':
        contract = MyBitBurnerMainnet;
        break;
      case 'MyBitToken':
        contract = MyBitTokenMainnet;
        break;
    }
  }

  return new Web3.eth.Contract(
    contract.ABI,
    address ? address : contract.ADDRESS
  );
}

export const loadMetamaskUserDetails = async (network) =>

  new Promise(async (resolve, reject) => {
    try {
      const accounts = await Web3.eth.getAccounts();
      const balance = await Web3.eth.getBalance(accounts[0]);

      const myBitTokenContract = getContract("MyBitToken", network);

      let myBitBalance = await myBitTokenContract.methods
        .balanceOf(accounts[0])
        .call();

      if (myBitBalance > 0) {
        myBitBalance = myBitBalance / Math.pow(10, 18);
      }

      myBitBalance = parseInt(myBitBalance);
      const details = {
        userName: accounts[0],
        ethBalance: Web3.utils.fromWei(balance, 'ether'),
        myBitBalance,
      };
      resolve(details);
    } catch (error) {
      reject(error);
    }
  });

export const getApprovalLogs = async (network) =>
  new Promise(async (resolve, reject) => {
    try {

      const mybitTokenContract = getContract("MyBitToken", network);

      const logApprovals = await mybitTokenContract.getPastEvents(
        'Approval',
        { fromBlock: 0, toBlock: 'latest' },
      );

      resolve(logApprovals);

    } catch (error) {
      reject(error);
    }
  });

export const requestApproval = async (address, network) =>
  new Promise(async (resolve, reject) => {
    try {
      const burnerAddress = getMyBitBurnerAddress(network);
      const mybitTokenContract = getContract("MyBitToken", network);

      const estimatedGas = await mybitTokenContract.methods.approve(burnerAddress, burnValueWei).estimateGas({ from: address });
      const gasPrice = await Web3.eth.getGasPrice();

      const approveResponse = await mybitTokenContract.methods
        .approve(burnerAddress, burnValueWei)
        .send({
          from: address,
          gas: estimatedGas,
          gasPrice: gasPrice
        });

      const { transactionHash } = approveResponse;

      checkTransactionStatus(transactionHash, resolve, reject, network);

    } catch (error) {
      reject(error);
    }
  });

export const getAllowanceOfAddress = async (address, network) =>
  new Promise(async (resolve, reject) => {
    try {

      const mybitTokenContract = getContract("MyBitToken", network);

      const allowance = await mybitTokenContract.methods.allowance(address, getMyBitBurnerAddress(network)).call();
      resolve(allowance >= burnValueWei);

    } catch (error) {
      reject(error);
    }
  });

export const getLogNewRequest = async (network) =>

  new Promise(async (resolve, reject) => {
    try {
      const forkContract = getContract("Fork", network);

      const logTransactions = await forkContract.getPastEvents(
        'LogNewRequest',
        { fromBlock: 0, toBlock: 'latest' },
      );

      resolve(logTransactions);
    } catch (error) {
      reject(error);
    }
  });

export const getLogNewPayment = async (network) =>

  new Promise(async (resolve, reject) => {
    try {
      const forkContract = getContract("Fork", network);

      const logTransactions = await forkContract.getPastEvents(
        'LogNewPayment',
        { fromBlock: 0, toBlock: 'latest' },
      );

      resolve(logTransactions);
    } catch (error) {
      reject(error);
    }
  });

export const createBill = async (from, to, amount, network) =>
  new Promise(async (resolve, reject) => {
    console.log("createBill")
    try {
      const forkContract = getContract("Fork", network);

      const weiAmount = Web3.utils.toWei(amount.toString(), 'ether');
      console.log("weiAmount", weiAmount, to)

      const estimatedGas = await forkContract.methods.createBill(to, weiAmount).estimateGas({ from: from });
      const gasPrice = await Web3.eth.getGasPrice();

      const billResponse = await forkContract.methods
        .createBill(to, weiAmount)
        .send({
          from: from,
          gas: estimatedGas,
          gasPrice: gasPrice
        });

      const { transactionHash } = billResponse;
      console.log("billResponse", billResponse)

      checkTransactionStatus(transactionHash, resolve, reject, network);
    } catch (error) {
      console.log("error", error)

      reject(error);
    }
  });

export const pay = async (id, amount, user, network) =>
  new Promise(async (resolve, reject) => {
    try {

      const billContract = getContract("Fork", network);
      const weiAmount = Web3.utils.toWei(amount.toString(), 'ether');

      const payResponse = await billContract.methods.payBill(id)
        .send({
          from: user,
          value: weiAmount
        });

      const { transactionHash } = payResponse;

      checkTransactionStatus(transactionHash, resolve, reject, network);
    } catch (error) {
      console.log(error)
      reject(error);
    }
  });

const checkTransactionStatus = async (
  transactionHash,
  resolve,
  reject,
  network,
) => {
  try {
    const endpoint = ETHERSCAN_TX(transactionHash, network);
    const result = await fetch(endpoint);
    const jsronResult = await result.json();
    if (jsronResult.status === '1') {
      //checkTransactionConfirmation(transactionHash, resolve, reject, network);
      resolve(true)
    } else if (jsronResult.status === '0') {
      resolve(false);
    } else {
      setTimeout(
        () => checkTransactionStatus(transactionHash, resolve, reject, network),
        1000,
      );
    }
  } catch (err) {
    reject(err);
  }
};

const checkTransactionConfirmation = async (
  transactionHash,
  resolve,
  reject,
  network,
) => {
  try {
    const url = ETHERSCAN_TX_FULL_PAGE(transactionHash, network);
    const response = await axios.get(url);
    var myRe = new RegExp('(<font color=\'green\'>Success</font>)', 'g');
    var r = myRe.exec(response.data);
    if (r.length > 0) {
      resolve(true);
    }

    myRe = new RegExp('(<font color=\'red\'>Fail</font>)', 'g');
    r = myRe.exec(response.data);
    if (r.length > 0) {
      resolve(false);
    }
    else {
      setTimeout(
        () => checkTransactionConfirmation(transactionHash, resolve, reject),
        1000,
      );
    }
  } catch (err) {
    setTimeout(
      () => checkTransactionConfirmation(transactionHash, resolve, reject),
      1000,
    );
  }
}

export default Web3;
