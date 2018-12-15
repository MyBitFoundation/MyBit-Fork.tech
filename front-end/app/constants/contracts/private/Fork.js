export const ADDRESS = '0x9fbda871d559710256a2502a2517b794b482db40';
export const ABI = [
  {
    "constant": true,
    "inputs": [],
    "name": "mybFee",
    "outputs": [
      {
        "name": "",
        "type": "uint256"
      }
    ],
    "payable": false,
    "stateMutability": "view",
    "type": "function"
  },
  {
    "inputs": [
      {
        "name": "_database",
        "type": "address"
      },
      {
        "name": "_mybTokenBurner",
        "type": "address"
      }
    ],
    "payable": false,
    "stateMutability": "nonpayable",
    "type": "constructor"
  },
  {
    "anonymous": false,
    "inputs": [
      {
        "indexed": true,
        "name": "_creator",
        "type": "address"
      },
      {
        "indexed": true,
        "name": "_recepient",
        "type": "address"
      },
      {
        "indexed": false,
        "name": "_amount",
        "type": "uint256"
      },
      {
        "indexed": false,
        "name": "_idx",
        "type": "uint256"
      }
    ],
    "name": "LogNewRequest",
    "type": "event"
  },
  {
    "anonymous": false,
    "inputs": [
      {
        "indexed": true,
        "name": "_idx",
        "type": "uint256"
      },
      {
        "indexed": true,
        "name": "_recepient",
        "type": "address"
      }
    ],
    "name": "LogNewPayment",
    "type": "event"
  },
  {
    "constant": false,
    "inputs": [
      {
        "name": "_recepients",
        "type": "address[]"
      },
      {
        "name": "_amountEach",
        "type": "uint256"
      }
    ],
    "name": "createBill",
    "outputs": [],
    "payable": false,
    "stateMutability": "nonpayable",
    "type": "function"
  },
  {
    "constant": false,
    "inputs": [
      {
        "name": "id",
        "type": "uint256"
      }
    ],
    "name": "payBill",
    "outputs": [],
    "payable": true,
    "stateMutability": "payable",
    "type": "function"
  },
  {
    "constant": false,
    "inputs": [
      {
        "name": "_newFee",
        "type": "uint256"
      }
    ],
    "name": "changeMYBFee",
    "outputs": [],
    "payable": false,
    "stateMutability": "nonpayable",
    "type": "function"
  }
  ]