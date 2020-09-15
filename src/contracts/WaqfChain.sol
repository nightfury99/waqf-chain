pragma solidity ^0.5.0;

contract WaqfChain {
    string public name;
    uint public productCount = 0;
    uint public sendCount = 0;
    uint public accountCount = 0;
    uint public closeCount = 0;
    address public adminAccount = 0x39705346dceC9822D353AF654D0fdCE712d6A8B7;
    // APPLY ONLY OWNER!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!
    modifier onlyOwner {
        require(msg.sender == adminAccount, 'You are not an admin');
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

    struct UpdateWaqfEvent {
        uint id;
        uint waqfId;
        string manageData;
        string manageDate;
        string developData;
        string developDate;
        string completedData;
        string completedDate;
        address admin;
    }

    event WaqfEventCreated(
        uint indexed id,
        string name,
        string details,
        string product_type,
        uint price,
        address payable owner,
        address indexed ownerAddress,
        bool closed
    );

    event accountCreated(
        uint indexed id,
        string name,
        string username,
        string email,
        string password,
        address indexed userAddress
    );

    event SendWaqfCreated(
        uint indexed id,
        uint indexed waqfId,
        string name,
        uint price,
        address payable seller,
        address payable sender, 
        address indexed senderAddress
    );

    event updatedWaqf(
        uint indexed id,
        uint indexed waqfId,
        string manageData,
        string manageDate,
        string developData,
        string developDate,
        string completedData,
        string completedDate,
        address admin
    );

    event waqfClosedCreated(
        uint id,
        uint waqfId,
        address sender
    );
    
    mapping(uint => UpdateWaqfEvent) public updateWaqfEvents;
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

    function createProduct(string memory _name, string memory _details, string memory _product_types, uint _price) onlyOwner public {
        require(bytes(_name).length > 0, 'name is empty');
        require(bytes(_details).length > 0, 'details is empty');
        require(bytes(_product_types).length > 0, 'product types is empty');
        require(_price > 0, 'prices types is empty');
        productCount ++;
        waqfEvents[productCount] = WaqfEvent(productCount, _name, _details, _product_types, _price, msg.sender, false);
        emit WaqfEventCreated(productCount, _name, _details, _product_types, _price, msg.sender, msg.sender, false);
        updateWaqfEvents[productCount] = UpdateWaqfEvent(productCount, productCount, '', '', '', '', '', '', msg.sender);
        emit updatedWaqf(productCount, productCount, '', '', '', '', '', '', msg.sender);
    }

    function sendWaqf(uint _id, uint _price) public payable{
        WaqfEvent memory _waqfevent = waqfEvents[_id];
        address payable _owner = _waqfevent.owner;
        address(_owner).transfer(msg.value);
        sendCount ++;
        emit SendWaqfCreated(sendCount, _id, _waqfevent.name, _price, _owner, msg.sender, msg.sender);
    }

    function updateWaqfManage(uint _waqfId, string memory _data, string memory _date) onlyOwner public {
        require(_waqfId > 0, 'waqf id is invalid');
        require(bytes(_data).length > 0, 'data is empty');
        require(bytes(_date).length > 0, 'date is empty');
        
        UpdateWaqfEvent memory _waqfevent = updateWaqfEvents[_waqfId];
        _waqfevent.manageData = _data;
        _waqfevent.manageDate = _date;
        updateWaqfEvents[_waqfId] = _waqfevent;
        emit updatedWaqf(_waqfevent.id, _waqfId, _data, _date, '', '', '', '', msg.sender);
    }

    function updateWaqfDevelop(uint _waqfId, string memory _data, string memory _date) onlyOwner public {
        require(_waqfId > 0, 'waqf id is invalid');
        require(bytes(_data).length > 0, 'data is empty');
        require(bytes(_date).length > 0, 'date is empty');
        
        UpdateWaqfEvent memory _waqfevent = updateWaqfEvents[_waqfId];
        _waqfevent.developData = _data;
        _waqfevent.developDate = _date;
        updateWaqfEvents[_waqfId] = _waqfevent;
        emit updatedWaqf(_waqfevent.id, _waqfId, _waqfevent.manageData,_waqfevent.manageDate, _data, _date, '', '', msg.sender);
    }

    function updateWaqfCompleted(uint _waqfId, string memory _data, string memory _date) onlyOwner public {
        require(_waqfId > 0, 'waqf id is invalid');
        require(bytes(_data).length > 0, 'data is empty');
        require(bytes(_date).length > 0, 'date is empty');
        
        UpdateWaqfEvent memory _waqfevent = updateWaqfEvents[_waqfId];
        _waqfevent.completedData = _data;
        _waqfevent.completedDate = _date;
        updateWaqfEvents[_waqfId] = _waqfevent;
        emit updatedWaqf(_waqfevent.id, _waqfId, _waqfevent.manageData,_waqfevent.manageDate, _waqfevent.developData,_waqfevent.developDate, _data, _date, msg.sender);
    }

    function closeWaqfStatus(uint _waqfId) onlyOwner public {
        require(_waqfId > 0, 'waf id is invalid');
        closeCount++;
        WaqfEvent memory _waqfevent = waqfEvents[_waqfId];
        _waqfevent.closed = true;
        waqfEvents[_waqfId] = _waqfevent;
        emit waqfClosedCreated(closeCount, _waqfId, msg.sender);
    }
}