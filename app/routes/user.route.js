const userController = require('../controllers/user.controller');
const express = require('express');
const router = express.Router();
const authorizeToken=require('../services/user.service')
router.post('/registerMe', userController.registerMe);
router.post('/googleUserLogin', userController.googleUserlogin);
router.post('/loginMe', userController.getToken);
router.get('/usersMe',authorizeToken.authorizeToken, userController.getAll);
router.get('/current', userController.getCurrent);
router.get('/:id', userController.getById);
router.get('/userName/:username',authorizeToken.authorizeToken, userController.getByUserName);
router.put('/:id', userController.update);
router.delete('/:id', userController._delete);
router.post('/getToken',userController.getToken)

module.exports = router;


