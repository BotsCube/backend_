let express = require('express');
let router = express.Router;

router.get('/:id', async(req, res) => {
  let term = req.params.id;
  console.log(term);
  console.log(typeof term);

  res.send(term + '||' + typeof term)
})

module.exports = router;
