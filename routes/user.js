const express = require('express');
const { rawListeners, deleteOne } = require('../models/User');
const bcrypt = require('bcrypt');
const User = require('../models/User');

// Create a new router instance
const router = express.Router();

//update user
router.put("/:id",async(req,res)=>{
    if(req.body.userId === req.params.id || req.body.isAdmin){
        if(req.body.password){
            try{
               const salt = await bcrypt.genSalt(10);
               req.body.password = await bcrypt.hash(req.body.password,salt);
            }
            catch(err){
                return res.status(500).json(err);
            }
        }
        try{
            const user = await User.findByIdAndUpdate(req.params.id,{
                $set:req.body,
            });
            res.status(200).json("Account has been updated");
        }
        catch(err){
            return res.status(500).json(err);
        }
    }else{
        return res.status(403).json("You can update only your account");
    }
});

//delete user

router.delete("/:id",async(req,res)=>{
    console.log("aaaa",req.body.userId,req.params.id)
    if(req.body.userId == req.params.id || req.body.isAdmin){
        try{
            await User.findByIdAndDelete(req.params.id);
            console.log("bbbb")
            res.status(200).json("Account has been updated");
        }catch(err){
            return res.status(500).json(err);
        }
    }else{
        return res.status(403).json("You can delete only user account!");
    }
});

//get user

router.get("/:id",async(req,res)=>{
    try {
        const user = await User.findById(req.params.id);
        const {password,updatedAt,...other} = user._doc  // this will give user all except password and updatedAt
        res.status(200).json(other)
    }catch(err){
        res.status(500).json(err)
    }
});

//follow user

router.put("/:id/follow", async(req,res)=>{
    if(req.body.userId != req.params.id){
        try{
            const user = await User.findById(req.params.id);
            const currentUser = await User.findById(req.body.userId);
            if(!user.followers.includes(req.body.userId)){
                await user.updateOne({$push:{followers:req.body.userId}})
                await currentUser.updateOne({$push:{followings:req.params.id}});
                res.status(200).json("user has been followed");

            }else{
                res.status(200).json("user has already follow this user");
            }


        }catch(err){
            res.status(500).json(err)
        }
    }
    else{
        res.status(403).json("you cannot follow yourself");
    }
});

//unfollow

router.put("/:id/Unfollow", async(req,res)=>{
    if(req.body.userId != req.params.id){
        try{
            const user = await User.findById(req.params.id);
            const currentUser = await User.findById(req.body.userId);
            if(!user.followers.includes(req.body.userId)){
                await user.updateOne({$pull:{followers:req.body.userId}})
                await currentUser.updateOne({$pull:{followings:req.params.id}});
                res.status(200).json(user);
                res.status(200).json("user has been unfollowed");

            }else{
                res.status(200).json("you dont follow this");
            }


        }catch(err){
            res.status(500).json(err)
        }
    }
    else{
        res.status(403).json("you cannot follow yourself");
    }
})


module.exports = router