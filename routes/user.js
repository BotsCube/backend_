let express = require('express');
let router = express.Router();

let userData = [
  {
    name: "Test User",
    username: "user.test",
    id: 1010
  }
  ];
router.get('/:id', async(req, res) => {
  let userId = req.params.id;
})

module.exports = router;
