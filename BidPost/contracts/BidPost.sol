pragma solidity ^0.8.0;

contract BidPost {
    uint latestBid = 0;
    address public author;
    string public message;
    address public owner;

    constructor() {
        owner = msg.sender;
    }

    modifier onlyOwner() {
        require(msg.sender == owner);
        _;
    }

    function placeBid() public payable {
        require(latestBid < msg.value, "Bid is too low");
        latestBid = msg.value;
        author = msg.sender;
    }

    // do I need this function?
    function getLatestBid() public view returns (uint) {
        return latestBid;
    }

    function getBalance() public view onlyOwner returns (uint) {
        return address(this).balance;
    }

    // for testing purposes
    function resetLatestBid() public onlyOwner {
        latestBid = 0;
    }

    function getAuthor() public view returns (address) {
        return author;
    }

    function getMessage() public view returns (string memory) {
        return message;
    }

    function getOwner() public view returns (address) {
        return owner;
    }
}