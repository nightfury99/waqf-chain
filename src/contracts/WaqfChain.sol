pragma solidity ^0.5.0;

contract WaqfChain {
    string public name;
    uint public productCount = 0;
    uint public sendCount = 0;
    uint public accountCount = 0;
    // APPLY ONLY OWNER!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!
    modifier onlyOwner {
        require(msg.sender == 0xc8136a608036C7FbbF7d052a70b76EDeAB864Ab4, 'You are not an admin');
        _;
    }
// nama user => {id waqf}
    struct WaqfEvent {
        uint id;
        string name;
        string details;
        string product_type;
        uint price;
        address payable owner;
        bool closed;
    }

    struct CreateAccount {
        uint id;
        string name;
        string username;
        string email;
        string password;
        address userAddress;
    }

    event WaqfEventCreated(
        uint id,
        string name,
        string details,
        string product_type,
        uint price,
        address payable owner,
        bool closed
    );

    event accountCreated(
        uint id,
        string name,
        string username,
        string email,
        string password,
        address userAddress
    );

    event SendWaqfCreated(
        uint id,
        uint waqfId,
        string name,
        uint price,
        address payable seller,
        address payable buyer
    );

    mapping(uint => WaqfEvent) public waqfEvents;
    mapping(uint => CreateAccount) public createAccount;

    constructor() public {
        name = "WaqfChain";
    }

    function createAccounts(string memory _name, string memory _username, string memory _email, string memory _password) public {
        require(bytes(_name).length > 0, 'name is empty');
        require(bytes(_username).length > 0, 'username is empty');
        require(bytes(_email).length > 0, 'email is empty');
        require(bytes(_password).length > 0, 'password is empty');
        accountCount++;
        createAccount[accountCount] = CreateAccount(accountCount, _name, _username, _email, _password, msg.sender);
        emit accountCreated(accountCount, _name, _username, _email, _password, msg.sender);
    }

    function createProduct(string memory _name, string memory _details, string memory _product_types, uint _price) public {
        require(bytes(_name).length > 0, 'name is empty');
        require(bytes(_details).length > 0, 'details is empty');
        require(bytes(_product_types).length > 0, 'product types is empty');
        require(_price > 0, 'prices types is empty');
        productCount ++;
        waqfEvents[productCount] = WaqfEvent(productCount, _name, _details, _product_types, _price, msg.sender, false);
        emit WaqfEventCreated(productCount, _name, _details, _product_types, _price, msg.sender, false);
    }

    function sendWaqf(uint _id) public payable{
        WaqfEvent memory _waqfevent = waqfEvents[_id];
        address payable _owner = _waqfevent.owner;
        address(_owner).transfer(msg.value);
        sendCount ++;
        emit SendWaqfCreated(sendCount, _id, _waqfevent.name, _waqfevent.price, _owner, msg.sender);
    }   
}