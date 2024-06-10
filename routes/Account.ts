const express = require('express')
const router = express.Router();
import AccountControl from "../controllers/Account";


router.route("/create").post(AccountControl.Create); // create
router.route("/display/:id").get(AccountControl.Get); // get
router.route("/delete/:id").delete(AccountControl.Delete); // get
router.route("/login").post(AccountControl.Login); // glogin
router.route("/test").get(AccountControl.Test); // get
router.route("/update/:id").put(AccountControl.Update); // get
router.route("/countlist/:id").get(AccountControl.CountLists); // get
router.route("/countitems/:id").get(AccountControl.CountItems); 
const Accountroute = router;

export default Accountroute;