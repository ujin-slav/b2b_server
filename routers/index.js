const Router = require('express').Router;
const userController = require('../controllers/user-controller');
const askController = require('../controllers/ask-controller');
const router = new Router();
const {body} = require('express-validator');
const authMiddleware = require('../middleware/auth-midleware');

router.post('/registration',
body('email').isEmail(),
body('password').isLength({min: 3, max: 32}),
userController.registration);

router.post('/login', userController.login);
router.post('/logout', userController.logout);
router.post('/forgot', userController.forgot);
router.post('/reset', userController.reset);
router.get('/activate/:link', userController.activate);
router.get('/refresh', userController.refresh);
router.get('/users', authMiddleware,userController.getUsers);

router.post('/addask', askController.addAsk);
router.get('/getask', askController.getAsk);
router.post('/getoneask', askController.getOneAsk);



module.exports = router