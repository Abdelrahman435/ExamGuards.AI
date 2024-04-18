// Public Key:
// BCPli_w-CwPlB6hqWdKk7vmgnGlJVpEhgxFoXENf0Tr9hvpVJgqjNi1UW_Y-fDuAWDGoMyFTSKO8-yLwo8I381o

// Private Key:
// VTvF-byc35JUuvKxwE4bjs-bWPlYX684YRla9d5LslM
const catchAsync = require("./../utils/catchAsync");
const NotificationSubscription = require("../../models/notificationSubscription");
const Notification = require("../../models/notification");
const webpushpush = require("web-push");
const mongoose = require("mongoose");
const factory = require("../controllers/handlerFactory");

let publicVapidKey = "";
let privateVapidKey = "";

webpush.setVapidDetails("", publicVapidKey, privateVapidKey);

push.sendNotification(sub, "test message");

exports.setUserId = catchAsync(async(req, res, next)=>{
    req.body
})

const createNotification = factory.createOne(Notification);
