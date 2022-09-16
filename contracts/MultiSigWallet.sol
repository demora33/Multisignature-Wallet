// SPDX-License-Identifier: MIT
pragma solidity ^0.8.7.;

contract MultiSigWallet {
    address[] public approvers;
    uint public quorum;

    struct Transfer {
        uint id;
        uint amount;
        address payable to;
        uint approvals;
        bool isSent;
    }

    modifier onlyApprover() {
        bool allowed = false;

        for (uint i = 0; i < approvers.length; i++) {
            if (approvers[i] == msg.sender) {
                allowed = true;
            }
        }

        require (allowed == true, 'User not approved');
        _;
    }

    Transfer[] public transfers;
    mapping(address => mapping(uint => bool)) public approvals;

    constructor(address[] memory _approvers, uint _quorum) {
        approvers = _approvers;
        quorum = _quorum;
    }

    function getTransfers() external view returns(Transfer[] memory) {
        return transfers;
    }

    function getApprovers() external view returns(address[] memory) {
        return approvers;
    }

    function createTransfer(uint amount, address payable to) external onlyApprover {
        transfers.push(Transfer(
            transfers.length,
            amount,
            to,
            0,
            false
        ));
    }

    function approveTransfer(uint id) external onlyApprover {
        require(transfers[id].isSent == false, 'transfer has already been sent');
        require(approvals[msg.sender][id] == false, 'transfer has already been approved');

        approvals[msg.sender][id] = true;
        transfers[id].approvals++;

        if (transfers[id].approvals >= quorum) {
            transfers[id].isSent = true;

            address payable to = transfers[id].to;
            uint amount = transfers[id].amount;
            to.transfer(amount);
        }
    }

    receive() external payable {}

  


}