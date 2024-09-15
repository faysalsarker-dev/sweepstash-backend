const express = require('express');
const { User } = require('../Shcemas/Shcemas'); 
const router = express.Router();

router.get('/editors', async (req, res) => {
    const search = req.query.search || "";
    const page = parseInt(req.query.page) || 1;
    const limit = req.query.limit || 10;
    const skip = (page - 1) * limit;
    
    const query = {};
    if (search) {
        query.name = { $regex: search, $options: "i" }; 
    }

    const totalUsers = await User.countDocuments(query); 
    const result = await User.find(query) 
                             .sort({ createdAt: -1 }) 
                             .skip(skip)
                             .limit(limit);
                             
    res.send({
        data: result,
        currentPage: page,
        totalPages: Math.ceil(totalUsers / limit),
        totalUsers
    });
});


module.exports = router;