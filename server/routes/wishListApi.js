const express = require('express');
const router = express.Router();
// const Sequelize = require('sequelize');
// const Op = Sequelize.Op;
const user = require('../dataAccess/user-model');
const wishList = require('../dataAccess/wishList-model');

// get wishlist  by user_id 
router.get('/:userId', async (req, res) => {
    let userID = req.params.userId;
    try {
        res.send(JSON.stringify(await wishList.getAllRows(userID)));
    } catch (err) {
        console.log(err);
    }
})

//add new item to wishlist
router.post('/addToWishList', async (req, res) =>{
    let item = req.body.newitem;
    try {
        await wishList.addToWishList(item);
        console.log(item.title+ 'added to your wishlist!')
        res.send((await wishList.getAllRows(item.user_id)));
    } catch (err) {
        console.log(err)
    }

})

//remove item from the wishlist

router.delete('/removeFromWishList/:wishId/user/:userId', async (req, res) => {
    let wish = req.params.wishId
    let user = req.params.userId
    console.log(wish);
    console.log(user);
    try {
        await wishList.removeFromWishList(wish);
         res.send(JSON.stringify(await wishList.getAllRows(user)));
    } catch (err){
        console.log(err);
    }
})

//deduct from balance on item purchase

router.put('/deductFromBalance', async (req, res) =>{
    let wish = req.body.wish;
    let userId = req.body.wish.user_id;
    console.log(wish);
    try{
        await user.buyNow(wish);
        res.send(JSON.stringify(await user.getChildById(userId)));
    } catch (err){
        console.log(err);
    }
})

module.exports = router;