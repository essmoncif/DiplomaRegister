pragma solidity ^0.6.1;
pragma experimental ABIEncoderV2;

import "./Diploma.sol";

contract Register {
    
    
    struct Student {
        string first_name;
        string last_name;
        uint256 birthday;
        uint8 number_of_diploma;
        bool _default ;
    }
    
    struct Dean {
        string first_name;
        string last_name;
        string faculty;
    }
    
    struct SignedDiploma {
        Diploma diploma;
        bytes signature;
    }
    
    event Graduate(address indexed _student, address indexed _diploma);
    
    Dean private _dean;
    address private _owner;
    mapping(address => Student) private _students;
    mapping(address => mapping(address => SignedDiploma)) _diplomas;
    
    constructor(string memory first_name, string memory last_name, string memory faculty) public {
        _dean = Dean(first_name, last_name, faculty);
        _owner = msg.sender;
    }
    
    function getDean() public view returns(Dean memory) {
        return _dean;
    }
    
    modifier onlyOwner() {
        require( _owner == msg.sender);
        _;
    }
    
    function addStudent(address student_address, string memory _first_name, string memory _last_name, uint256 _birhtday) public onlyOwner {
        _students[student_address] = Student(_first_name, _last_name, _birhtday, 0, true);
    }
    
    function getStudent(address student_address) public view returns(Student memory){
        return _students[student_address];
    }
    
    function registerDiploma(string memory _title, string memory _mention, address _student, bytes memory _signature) public onlyOwner {
        if(_students[_student]._default){
            Diploma dip = new Diploma(_student, _owner, _title, _mention);
            _diplomas[_student][address(dip)] = SignedDiploma(dip, _signature);
            _students[_student].number_of_diploma++;
            emit Graduate(_student, address(dip));
        }
    }
    
    function getDiplomaOfStudent(address _student_address, address _diploma) public view returns(SignedDiploma memory _signed, Student memory _student, string memory _title, string memory _mention, uint256 _date_creation ) {
        if(_students[_student_address]._default && _students[_student_address].number_of_diploma > 0) {
            _signed = _diplomas[_student_address][_diploma];
            _student = _students[_student_address];
            _title = _signed.diploma.title();
            _mention = _signed.diploma.mention();
            _date_creation = _signed.diploma.date();
        }
    }
}