const express = require('express')
const router = express.Router();
import ListControl from "../controllers/List";


router.route("/create").post(ListControl.Create); // create
router.route("/delete/:id").delete(ListControl.Delete); // get
router.route("/update/:id").put(ListControl.Update); // get
const Listroute = router;

export default Listroute;