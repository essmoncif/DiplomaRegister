pragma solidity ^0.6.1;

contract Diploma {
 
 
    address private _student;
    string private _title;
    string private _mention;
    uint256 private _date;
    address private _dean;
    
    constructor(address student, address dean, string memory title, string memory mention) public {
        _student = student;
        _dean = dean;
        _title = title;
        _mention = mention;
        _date = now;
    }
    
    function student() public view returns(address) {
        return _student;
    }
    
    function dean() public view returns(address) {
        return _dean;
    }
    
    function date() public view returns(uint256) {
        return _date;
    }
    
    function title() public view returns(string memory) {
        return _title;
    }
    
    function mention() public view returns(string memory) {
        return _mention;
    }
}