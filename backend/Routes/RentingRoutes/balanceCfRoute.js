const express =require('express')
const router =express.Router()

const{ 
    tenatRegistration,
    
    fetchRecentBalance
} =require('../../controllers/Renting/balanceCfController')
const {requireAuth} =require('../../middlleware/requireAuth')

const { hasAdmin  } = require("../../middlleware/checkRoles");
const { verifyToken } = require('../../middlleware/token');




router.get('/bcf/',verifyToken, hasAdmin  , fetchRecentBalance)


module.exports= router ;