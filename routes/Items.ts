const express = require('express')
const router = express.Router();
import ItemControl from "../controllers/Items";


router.route("/create").post(ItemControl.Create); // create
router.route("/delete/:id").delete(ItemControl.Delete); // create
router.route("/update/:id").put(ItemControl.Update); // get
const Accountroute = router;

export default Accountroute;