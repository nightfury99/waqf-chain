const { assert } = require("chai");
require('chai')
    .use(require('chai-as-promised'))
    .should();

const WaqfChain = artifacts.require('./WaqfChain.sol');

contract('WaqfChain', ([deployer, seller, buyer]) => {
    let waqfChain;

    before(async () => {
        waqfChain = await WaqfChain.deployed();
    });

    describe('deployment', async () => {
        it('deploys succeessfully', async ()=> {
            const address = await waqfChain.address
            assert.notEqual(address, 0x0);
            assert.notEqual(address, '');
            assert.notEqual(address, null);
            assert.notEqual(address, undefined);
        });

        it('has a name', async () => {
            const name = await waqfChain.name();
            assert.equal(name, 'WaqfChain');
        });
    });

    describe('products', async () => {
        let result, productCount, sendCount;
        before(async () => {
            result = await waqfChain.createProduct('waqf event for children', 'Lorem ipsum the quick brown fox', 'education', web3.utils.toWei('0.62', 'Ether'), { from: seller });
            productCount = await waqfChain.productCount();
        });
        // SUCCESS
        it('creates product', async () => {
            assert.equal(productCount, 1);
            
            const event = result.logs[0].args;
            assert.equal(event.id.toNumber(), productCount, 'ID is valid');
            assert.equal(event.name, 'waqf event for children', 'waqf name is valid');
            assert.equal(event.details, 'Lorem ipsum the quick brown fox', 'waqf details is valid');
            assert.equal(event.product_type, 'education', 'waqf type is valid');
            assert.equal(event.price, web3.utils.toWei('0.62', 'Ether'), 'price is valid');
            assert.equal(event.closed, false, 'is valid');
            
            //FAILURE
            await waqfChain.createProduct('', 'Lorem ipsum the quick brown fox', 'education', web3.utils.toWei('0.62', 'Ether'), { from: seller }).should.be.rejected;
            await waqfChain.createProduct('asaada', '', 'education', web3.utils.toWei('0.62', 'Ether'), { from: seller }).should.be.rejected;
            await waqfChain.createProduct('swegrw', 'Lorem ipsum the quick brown fox', '', web3.utils.toWei('0.62', 'Ether'), { from: seller }).should.be.rejected;
            await waqfChain.createProduct('sddsfsf', 'Lorem ipsum the quick brown fox', 'education', web3.utils.toWei('0', 'Ether'), { from: seller }).should.be.rejected;
        });

        it('lists products', async () => {
            const product = await waqfChain.waqfEvents(productCount);
            assert.equal(product.id.toNumber(), productCount, 'ID is valid');
            assert.equal(product.name, 'waqf event for children', 'waqf name is valid');
            assert.equal(product.details, 'Lorem ipsum the quick brown fox', 'waqf details is valid');
            assert.equal(product.product_type, 'education', 'waqf type is valid');
            assert.equal(product.price, web3.utils.toWei('0.62', 'Ether'), 'price is valid');
            assert.equal(product.closed, false, 'is valid');
        });

        it('sells products', async () => {
            result = await waqfChain.sendWaqf(productCount, { from: buyer, value: web3.utils.toWei('0.62', 'Ether') });
            sendCount = await waqfChain.sendCount();
            const event = result.logs[0].args;
            assert.equal(sendCount, 1);
            assert.equal(event.id.toNumber(), sendCount, 'ID is valid');
            assert.equal(event.waqfId.toNumber(), productCount, 'waqf id is valid');
            assert.equal(event.name, 'waqf event for children', 'waqf name is valid');
            assert.equal(event.price, web3.utils.toWei('0.62', 'Ether'), 'price is valid');
            assert.equal(event.seller, seller, 'seller address is valid');
            assert.equal(event.buyer, buyer, 'buyer address is valid');
        });
    });
});