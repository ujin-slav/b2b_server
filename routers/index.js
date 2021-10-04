const Router = require('express').Router;
const userController = require('../controllers/user-controller');
const askController = require('../controllers/ask-controller');
const loadController = require('../controllers/load-controller');
const offerController = require('../controllers/offer-controller');
const upload = require('../config/load-config');
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
router.post('/getuser',userController.getUser);
router.post('/changeuser',userController.changeuser);

router.post('/addask',  upload.array("file"), askController.addAsk);
router.post('/getask', askController.getAsk);
router.post('/getoneask', askController.getOneAsk);
router.post('/deleteask', askController.deleteAsk);
router.post('/fillask', askController.fillAsk);

router.post('/getoffers', offerController.getOffers);
router.post('/deleteoffer', offerController.deleteOffer);
router.post('/getuseroffers', offerController.getUserOffers);
router.post('/addoffer', upload.array("file"), offerController.addOffer);

router.get('/download/:file', loadController.download);

router.get('/parsing', loadController.parsing);

module.exports = router