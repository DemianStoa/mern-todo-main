const express = require('express')
const router = express.Router()
const verifyToken = require('../middleware/verifyToken')
const list = require('../controllers/list')


router.get("/",verifyToken, list.getAllList)
router.post("/", verifyToken, list.createList)
  

router.get("/:userId", verifyToken, list.getListByCreator)

router.patch('/:id', verifyToken, list.updateList)

router.delete('/:id',verifyToken, list.deleteList)

module.exports = router