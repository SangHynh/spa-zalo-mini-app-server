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
  "/",
  (req, res, next) => {
    req.folder = process.env.APP_FOLDER; // Folder name in cloud
    next();
  },
  verifyAccessToken,
  upload.array("images", MAX_FILES),
  appConfigController.updateHome
); // FOR ADMIN

// GET ORDER-POINT
router.get("/", verifyAccessToken, appConfigController.getOrderPoints);

// CREATE ORDER-POINT
router.post("/", verifyAccessToken, appConfigController.updateOrderPoint);

// UPDATE ORDER-POINT
router.put(
  "/:orderPointId",
  verifyAccessToken,
  appConfigController.createOrderPoint
);

// DELETE ORDER-POINT
router.delete(
  "/:orderPointId",
  verifyAccessToken,
  appConfigController.deleteOrderPoint
);

module.exports = router;
