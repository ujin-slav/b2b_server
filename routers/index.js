const Router = require('express').Router;
const userController = require('../controllers/user-controller');
const askController = require('../controllers/ask-controller');
const loadController = require('../controllers/load-controller');
const offerController = require('../controllers/offer-controller');
const specOfferController = require('../controllers/specOffer-controller');
const orgController = require('../controllers/org-controller');
const priceController = require('../controllers/price-controller');
const contrController = require('../controllers/contr-controller')
const questionController = require('../controllers/question-controller')
const reviewOrgController = require('../controllers/reviewOrg-controller')
const upload = require('../config/load-config');
const uploadPic = require('../config/load-config-pic');
const uploadPrice = require('../config/load-config-price');
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
router.post('/activate', userController.activate);
router.get('/refresh', userController.refresh);
router.post('/getuser',userController.getUser);
router.post('/getuserbyid',userController.getUserById);
router.post('/getusers',userController.getUsers);
router.post('/getuserlist',userController.getUserList);
router.post('/changeuser',userController.changeuser);

router.post('/addprice', uploadPrice.single("file"), priceController.addPrice);
router.post('/getprice', priceController.getPrice);
router.post('/getpriceunit', priceController.getPriceUnit);
router.post('/clearprice',authMiddleware, priceController.clearPrice);

router.post('/addspecoffer',  uploadPic.array("file"),specOfferController.addSpecOffer);
router.post('/modifyspecoffer',  uploadPic.array("file"),specOfferController.modifySpecOffer);
router.post('/getfilterspecoffer', specOfferController.getFilterSpecOffer);
router.post('/getspecofferuser', specOfferController.getSpecOfferUser);
router.post('/getspecofferid', specOfferController.getSpecOfferId);
router.post('/getspecaskuser', specOfferController.getSpecAskUser);
router.post('/deletespecoffer', specOfferController.deleteSpecOffer);
router.post('/specaskfiz', specOfferController.specAskFiz);

router.post('/saveask', priceController.saveAsk);
router.post('/getaskprice', priceController.getAskPrice);
router.post('/getaskpriceid', priceController.getAskPriceId);
router.post('/deletepriceask', priceController.deletePriceAsk);
router.post('/updatepriceask', priceController.updatePriceAsk);

router.post('/addask',  upload.array("file"), askController.addAsk);
router.post('/getask', askController.getAsk);
router.post('/getfilterask', askController.getFilterAsk);
router.post('/getinvitedask', askController.getInvitedAsk);
router.post('/getoneask', askController.getOneAsk);
router.post('/getuserasks', askController.getUserAsks);
router.post('/deleteask', askController.deleteAsk);
router.post('/fillask', askController.fillAsk);
router.post('/modifyask', authMiddleware,upload.array("file"),askController.modifyAsk);

router.post('/getoffers', offerController.getOffers);
router.post('/deleteoffer', offerController.deleteOffer);
router.post('/getuseroffers', offerController.getUserOffers);
router.post('/addoffer', upload.array("file"), offerController.addOffer);

router.post('/getorg', orgController.getOrg);
router.post('/getorgcat', orgController.getOrgCat);
router.post('/getcontr', contrController.getContr);
router.post('/addcontr', contrController.addContr);
router.post('/delcontr', contrController.delContr);

router.post('/addquest', questionController.addQuest);
router.post('/getquest', questionController.getQuest);
router.post('/getquestuser', questionController.getQuestUser);
router.post('/getunreadquest', questionController.getUnreadQuest);
router.post('/delquest', questionController.delQuest);
router.post('/delanswer', questionController.delAnswer);

router.post('/addrevieworg', reviewOrgController.addQuest);
router.post('/getrevieworg', reviewOrgController.getQuest);
router.post('/delrevieworg', reviewOrgController.delReviewOrg);

router.get('/getpic/:file', loadController.getPic);
router.get('/download/:file', loadController.download);
router.get('/static/:path/:file', loadController.getStatic);

router.get('/parsing', loadController.parsing);

module.exports = router