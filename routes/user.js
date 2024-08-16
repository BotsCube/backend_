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
  try {
    let userId = req.params.id;
    if(isNaN(userId)){
      return res.json({
        success: false,
        type: "invalid userid",
        message: "An Invalid ID Is Provided!",
        isNaN: isNaN(userId)
      });
    }
    let userDetails = userData.filter(i => i.id === Number(userId));
    if(!userDetails || typeof userDetails !== "array" || userDetails.length < 1){
      return res.json({
        success: false,
        type: "account not found",
        message: "No Account Found With This UserId",
        isNaN: isNaN(userId)
      });
    }
    res.json(userDetails[0]);
  } catch (er) {
    console.log(er);
    return res.json({
        success: false,
        type: "server error",
        message: "An Unknown Error Occurred!",
        isNaN: undefined 
      });
  }
})

module.exports = router;
