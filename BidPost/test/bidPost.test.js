const truffleAssert = require('truffle-assertions');
const BidPost = artifacts.require('BidPost');

contract('BidPost', () => {
    let bidPost;

    beforeEach('setup a new contract instance for each test', async () => {
        bidPost = await BidPost.new();
    });
    

    it('Should update latest bid', async () => {
        await bidPost.placeBid({ value: 10 });
        latestBid = await bidPost.getLatestBid();
        assert(latestBid.toNumber() === 10);
    });

    it('Can not update the string with a low bid', async () => {
        await truffleAssert.reverts(bidPost.placeBid({ value: 0 }), "Bid is too low");
    });


});


