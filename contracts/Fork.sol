pragma solidity ^0.4.24;

/// @title Fork smart contract for simple bill spliting 
/// @author Bakaoh

import './SafeMath.sol';
import './Database.sol';
import './MyBitBurner.sol';

contract Fork {
  using SafeMath for uint;

  Database private database;
  MyBitBurner private mybBurner;
  address private owner;
  uint private idx = 0;

  uint public mybFee = 250;

  constructor(address _database, address _mybTokenBurner) public{
    owner = msg.sender;
    database = Database(_database);
    mybBurner = MyBitBurner(_mybTokenBurner);
  }

  function addBill(address[] _recepients, uint _amountEach)
  external {
    require(_recepients.length < uint8(100));    // uint8 overflows at 256. Dont loop through more than
    require( !database.boolStorage(keccak256(abi.encodePacked("folkIsOwner", idx, msg.sender))) );
    require(mybBurner.burn(msg.sender, mybFee));

    database.setBool(keccak256(abi.encodePacked("folkIsOwner", idx, msg.sender)), true);
    database.setUint(keccak256(abi.encodePacked("folkAmountEach", idx)), _amountEach);
    database.setAddress(keccak256(abi.encodePacked("folkOwner", idx)), msg.sender);

    for (uint i = 0; i < _recepients.length; i++) {
      assert(_recepients[i] != address(0));
      database.setBool(keccak256(abi.encodePacked("folkIsRecepient", idx, _recepients[i])), true);

      emit LogNewRequest(msg.sender, _recepients[i], _amountEach, idx);
    }
    idx++;
  }

  // @notice recepient can send funds here to pay their portion of the bill
  // @param (uint) id = The id of the bill
  function payBill(uint id)
  external
  payable {
    require( database.boolStorage(keccak256(abi.encodePacked("folkIsRecepient", id, msg.sender))) );
    uint amount = database.uintStorage(keccak256(abi.encodePacked("folkAmountEach", id)));
    require( amount == msg.value );

    address billOwner = database.addressStorage(keccak256(abi.encodePacked("folkOwner", id)));
    billOwner.transfer(amount);
    database.deleteBool(keccak256(abi.encodePacked("folkIsRecepient", id, msg.sender)));
    emit LogNewPayment(id, msg.sender);
  }

  function changeMYBFee(uint _newFee)
  external {
    require(msg.sender == owner);
    mybFee = _newFee;
  }

  event LogNewRequest(address indexed _creator, address indexed _recepient, uint _amount, uint _idx);
  event LogNewPayment(uint indexed _idx, address indexed _recepient);

}
