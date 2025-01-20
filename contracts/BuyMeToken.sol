// SPDX-License-Identifier: UNLICENSED
pragma solidity ^0.8.28;

contract BuyMeToken {

    struct Memo {
        address from;
        uint256 timestamp;
        string name;
        string message;
    }   

    event NewMemo(address indexed from, uint256 timestamp, string name, string message);

    address payable owner;

    Memo[] memos;

    constructor() {
        owner = payable(msg.sender);
    }
    
    function buyToken(
        string memory _name,
        string memory _message
    )
    public
    payable
    {
        require(msg.value > 0, "Can't Buy token with 0 eth value");

        memos.push(Memo({
            from: msg.sender,
            timestamp: block.timestamp,
            name: _name,
            message: _message
        }));

        emit NewMemo(msg.sender, block.timestamp, _name, _message);
    }


    function withdrawTips()
    public
    {
        require(owner.send(address(this).balance), "Failed to withdraw tips");
    }

    function getMemos()
    public
    view
    returns (Memo[] memory)
    {
        return memos;
    }
}
