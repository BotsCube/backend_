let router = require('express').Router;

router.get('/:id', async(req, res) => {
  let term = req.params.id;
  console.log(term);
  console.log(typeof term);
})

module.exports = router;
