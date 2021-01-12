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

    describe('update waqf', async () => {
        let productCounts, result, closeCount, closeResult, updateCount, update;
        before(async () => {
            result = await waqfChain.createProduct('1 waqf event for children', 'Lorem ipsum the quick brown fox', 'educatio', web3.utils.toWei('0.62', 'Ether'), { from: seller });
            
            update = await waqfChain.updatingWaqf(2, "first update for you guys", "17-10-2010", "Kuala Lumpur", "700", { from: seller });
            productCounts = await waqfChain.productCount();
            updateCount = await waqfChain.updateCount();
            closeResult = await waqfChain.closeWaqfStatus(1, { from: seller });
            closeCount = await waqfChain.closeCount();
        });
        
        it('update part', async() => {
            //assert.equal(productCounts, 1, "product count is not the same");
            assert.equal(updateCount, 1, "update count is not the same");
            const event = update.logs[0].args;
            assert.equal(event.id.toNumber(), 1, "id is not equal");
            assert.equal(event.waqfId.toNumber(), 2, "waqf id is not equal");
            assert.equal(event.data_1, "first update for you guys", "data is not equal");
            assert.equal(event.date_1, "17-10-2010", "date is not equal");
            assert.equal(event.location, "Kuala Lumpur", "location is not same");
            assert.equal(event.moneyUsed, "700", "money is not same");
            assert.equal(event.admin, seller, "admin is not correct");
        });

        it('update error', async() => {
            await waqfChain.createProduct('', 'Lorem ipsum the quick brown fox', 'education', web3.utils.toWei('0.62', 'Ether'), { from: seller }).should.be.rejected;
            await waqfChain.updatingWaqf(2, "", "17-10-2010", "Kuala Lumpur", "700", { from: seller }).should.be.rejected;
            await waqfChain.updatingWaqf(2, "first update for you guys", "", "Kuala Lumpur", "700", { from: seller }).should.be.rejected;
            await waqfChain.updatingWaqf(2, "first update for you guys", "17-10-2010", "", "700", { from: seller }).should.be.rejected;
            await waqfChain.updatingWaqf(2, "first update for you guys", "17-10-2010", "Kuala Lumpur", "", { from: seller }).should.be.rejected;
            await waqfChain.updatingWaqf(2, "first update for you guys", "17-10-2010", "Kuala Lumpur", "700", { from: buyer }).should.be.rejected;
        });
        
        it('closed waqf', async () => {
            assert.equal(closeCount, 1, 'closed count is invalid');
            const event = await waqfChain.waqfEvents(1);
            assert.equal(event.closed, true, 'not closed');    
        });
        // it('update manage part', async () => {
        //     assert.equal(productCounts, 4);
        //     const event = result.logs[0].args;
        //     const product = await waqfChain.updateWaqfEvents(2);
        //     //console.log(product);
        //     assert.equal(event.id.toNumber(), 2, 'id is invalid');
        //     assert.equal(event.waqfId.toNumber(), 2, 'waqf id is incorrect');
        //     assert.equal(event.manageData, 'barang sedang dibeli', 'manage data is incorrect');
        //     assert.equal(event.manageDate, '34/3/2012', 'manage date is incorrect');
        //     assert.equal(event.developData, 'barang sedang dibuat', 'develop data is incorrect');
        //     assert.equal(event.developDate, '24/3/2012', 'develop date is incorrect');
        //     assert.equal(event.completedData, 'barang sudah', 'completed data is incorrect');
        //     assert.equal(event.completedDate, '2/6/2012', 'completed date is incorrect');
        // });
    });
    
    describe('waqf project', async () => {
        let result, productCount, sendCount;
        before(async () => {
            result = await waqfChain.createProduct('waqf event for children', 'Lorem ipsum the quick brown fox', 'education', web3.utils.toWei('0.62', 'Ether'), { from: seller });
            productCount = await waqfChain.productCount();
        });
        // SUCCESS
        it('creates waqf', async () => {
            const event = result.logs[0].args;
            assert.equal(event.id.toNumber(), productCount, 'ID is valid');
            assert.equal(event.name, 'waqf event for children', 'waqf name is valid');
            assert.equal(event.details, 'Lorem ipsum the quick brown fox', 'waqf details is valid');
            assert.equal(event.product_type, 'education', 'waqf type is invalid');
            assert.equal(event.price, web3.utils.toWei('0.62', 'Ether'), 'price is valid');
            assert.equal(event.owner, seller, 'admin addr is invalid');
            assert.equal(event.ownerAddress, seller, 'admin addr is invalid');
            assert.equal(event.closed, false, 'is valid');
        });

        it('failure create waqf', async () => {
            //FAILURE
            await waqfChain.createProduct('', 'Lorem ipsum the quick brown fox', 'education', web3.utils.toWei('0.62', 'Ether'), { from: seller }).should.be.rejected;
            await waqfChain.createProduct('asaada', '', 'education', web3.utils.toWei('0.62', 'Ether'), { from: seller }).should.be.rejected;
            await waqfChain.createProduct('swegrw', 'Lorem ipsum the quick brown fox', '', web3.utils.toWei('0.62', 'Ether'), { from: seller }).should.be.rejected;
            await waqfChain.createProduct('sddsfsf', 'Lorem ipsum the quick brown fox', 'education', web3.utils.toWei('0', 'Ether'), { from: seller }).should.be.rejected;
            await waqfChain.createProduct('swegrw', 'Lorem ipsum the quick brown fox', '', web3.utils.toWei('0.62', 'Ether'), { from: buyer }).should.be.rejected;
        });

        it('lists products', async () => {
            const product = await waqfChain.waqfEvents(productCount);
            assert.equal(product.id.toNumber(), productCount, 'ID is valid');
            assert.equal(product.name, 'waqf event for children', 'waqf name is valid');
            assert.equal(product.details, 'Lorem ipsum the quick brown fox', 'waqf details is valid');
            assert.equal(product.product_type, 'education', 'waqf type is invalid');
            assert.equal(product.price, web3.utils.toWei('0.62', 'Ether'), 'price is valid');
            assert.equal(product.closed, false, 'is valid');
        });

        it('donate waqf', async () => {
            result = await waqfChain.sendWaqf(productCount, 43, { from: buyer, value: web3.utils.toWei('0.001', 'Ether') });
            sendCount = await waqfChain.sendCount();
            const event = result.logs[0].args;
            assert.equal(sendCount, 1);
            assert.equal(event.id.toNumber(), sendCount, 'ID is valid');
            assert.equal(event.waqfId.toNumber(), productCount, 'waqf id is valid');
            assert.equal(event.name, 'waqf event for children', 'waqf name is valid');
            assert.equal(event.price, 43, 'price is valid');
            assert.equal(event.seller, seller, 'seller address is valid');
            assert.equal(event.sender, buyer, 'buyer address is valid');
            assert.equal(event.senderAddress, buyer, 'buyer address is valid');
        });
    });
});