const express = require("express");
const router = express.Router();
const appConfigController = require("../../controllers/appconfig.controller");
const { upload } = require("../../middlewares/upload.middlewares");
const { verifyAccessToken } = require("../../configs/jwt.config");
const { PERMISSIONS } = require("../../models/admin.model");
const MAX_FILES = 50;

// GET
/* Response:
{
    "_id": "",
    "version": "1.0.0",
    "images": [
        "url1.com",
        "url2.com",
        ...
    ],
    "createdAt": "2024-10-03T13:26:34.078Z",
    "updatedAt": "2024-10-03T13:38:43.742Z",
}
*/
router.get("/slider", appConfigController.getConfig);

router.get("/permission", (req, res) => { res.json(PERMISSIONS); });

// PUT SLIDER
router.put(
  "/slider",
  (req, res, next) => {
    req.folder = process.env.APP_FOLDER; // Folder name in cloud
    next();
  },
  verifyAccessToken,
  upload.array("images", MAX_FILES),
  appConfigController.updateHome
); // FOR ADMIN

// GET ORDER-POINT
router.get("/orderPoints", verifyAccessToken, appConfigController.getOrderPoints);

// CREATE ORDER-POINT
router.post("/orderPoints", verifyAccessToken, appConfigController.createOrderPoint);

// UPDATE ORDER-POINT
router.put(
  "/orderPoints/:orderPointId",
  verifyAccessToken,
  appConfigController.updateOrderPoint
);

// DELETE ORDER-POINT
router.delete(
  "/orderPoints/:orderPointId",
  verifyAccessToken,
  appConfigController.deleteOrderPoint
);

// GET COMMISSION
router.get("/commission", verifyAccessToken, appConfigController.getCommission);

// UPDATE COMMISSION
router.put(
  "/commission",
  verifyAccessToken,
  appConfigController.updateCommissionInformation
);

module.exports = router;
