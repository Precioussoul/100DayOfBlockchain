// SPDX-License-Identifier: SEE LICENSE IN LICENSE
pragma solidity 0.8.19;

contract MyContract{
    string value;

    constructor(){
        value = 'Hello, world';
    }

    function get() public view  returns (string memory) {
        return value;
    }

    function set(string memory _value) public  {
        value = _value;
    }
}