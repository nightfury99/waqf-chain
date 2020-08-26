pragma solidity ^0.5.0;

contract WaqfChain {
    string public name;
    uint public productCount = 0;
 
    modifier onlyOwner {
        require(msg.sender == 0xaF8Ee7b8a7ceE30DF29239418B4407D7C19214AB, 'You are not an admin');
        _;
    }

    struct WaqfEvent {
        uint id;
        string name;
        string details;
        string product_type;
        uint price;
        bool closed;
    }

    event WaqfEventCreated(
        uint id,
        string name,
        string details,
        string product_type,
        uint price,
        bool closed
    );

    mapping(uint => WaqfEvent) public waqfEvents;

    constructor() public {
        name = "WaqfChain";
    }

    function createProduct(string memory _name, string memory _details, string memory _product_types, uint _price) public {
        require(bytes(_name).length > 0, 'name is empty');
        require(bytes(_details).length > 0, 'details is empty');
        require(bytes(_product_types).length > 0, 'product types is empty');
        require(_price > 0, 'prices types is empty');
        productCount ++;
        waqfEvents[productCount] = WaqfEvent(productCount, _name, _details, _product_types, _price, false);
        emit WaqfEventCreated(productCount, _name, _details, _product_types, _price, false);
    }
}