const Router = require('express').Router;
const userController = require('../controllers/user-controller');
const askController = require('../controllers/ask-controller');
const loadController = require('../controllers/load-controller');
const offerController = require('../controllers/offer-controller');
const specOfferController = require('../controllers/specOffer-controller');
const orgController = require('../controllers/org-controller');
const priceController = require('../controllers/price-controller');
const chatController = require('../controllers/chat-controller');
const contrController = require('../controllers/contr-controller')
const questionController = require('../controllers/question-controller')
const reviewOrgController = require('../controllers/reviewOrg-controller')
const messageController = require('../controllers/message-controller')
const carouselController = require('../controllers/carousel-controller')
const lentController = require('../controllers/lent-controller')
const upload = require('../config/load-config');
const uploadPic = require('../config/load-config-pic');
const uploadChat = require('../config/load-config-chat');
const uploadPrice = require('../config/load-config-price');
const uploadLogo = require('../config/load-config-logo');
const uploadStatus = require('../config/load-config-status');
const uploadStatusAsk = require('../config/load-config-statusAsk');
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
router.post('/changeuser', uploadLogo.single("file"),userController.changeuser);

router.post('/getmessage', messageController.getMessage);

router.post('/getlent', lentController.getLent);

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
router.post('/specaskorg', specOfferController.specAskOrg);

router.post('/saveask', priceController.saveAsk);
router.post('/getaskprice', priceController.getAskPrice);
router.post('/getaskpricefiz', priceController.getAskPriceFiz);
router.post('/getaskpriceid', priceController.getAskPriceId);
router.post('/deletepriceask', priceController.deletePriceAsk);
router.post('/updatepriceask', priceController.updatePriceAsk);
router.post('/setstatuspriceask',uploadStatus.array("file"), priceController.setStatusPriceAsk);
router.post('/getstatuspriceask',priceController.getStatusPriceAsk);
router.post('/deletestatuspriceaskfile',priceController.deleteStatusPriceAskFile);

router.post('/addask',  upload.array("file"), askController.addAsk);
router.post('/setwinner', askController.setWinner);
router.post('/getask', askController.getAsk);
router.post('/getfilterask', askController.getFilterAsk);
router.post('/getinvitedask', askController.getInvitedAsk);
router.post('/getoneask', askController.getOneAsk);
router.post('/getuserasks', askController.getUserAsks);
router.post('/deleteask', askController.deleteAsk);
router.post('/fillask', askController.fillAsk);
router.post('/modifyask', authMiddleware,upload.array("file"),askController.modifyAsk);
router.post('/setstatusask',uploadStatusAsk.array("file"), askController.setStatusAsk);
router.post('/getstatusask',askController.getStatusAsk);
router.post('/deletestatusaskfile',askController.deleteStatusAskFile);

router.post('/getoffers', offerController.getOffers);
router.post('/deleteoffer', offerController.deleteOffer);
router.post('/getuseroffers', offerController.getUserOffers);
router.post('/addoffer', upload.array("file"), offerController.addOffer);

router.post('/getorg', orgController.getOrg);
router.post('/getorgcat', orgController.getOrgCat);
router.post('/getcontr', contrController.getContr);
router.post('/getcontrparty', contrController.getContrParty);
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
router.get('/getlogo/:file', loadController.getLogo);
router.get('/download/:file', loadController.download);
router.get('/getstatusfile/:file', loadController.getStatusFile);
router.get('/getstatusaskfile/:file', loadController.getStatusAskFile);
router.get('/static/:path/:file', loadController.getStatic);
router.post('/uploadchatfile',uploadChat.single("file"), loadController.upLoadChatFile);

router.get('/parsing', loadController.parsing);

router.post('/getconnectedfriend', chatController.getStatus);

router.post('/getcarousel', carouselController.getCarousel);

module.exports = router