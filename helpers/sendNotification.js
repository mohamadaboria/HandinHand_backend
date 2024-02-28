const axios = require("axios");
const { Message } = require("../models/message");
const serverKey =
  "AAAAZRdqRN0:APA91bFL6aib9cEoH97BAI5mrglWpx5o_hHEeHVSh1phnjOtVFOrXXc565Bv5j74BZOTUYJWg2_EwnTBt724oa1qQembqLJR4a35IrdVP_mL3VbRZil0vlHFAHqz0y4lCRKRItxnMtht";
const fcmEndpoint = "https://fcm.googleapis.com/fcm/send";

//push notification
exports.sendPushNotification = async (user, title, body, type, research) => {
  try {
    let notificatioObj = {
      user: user._id,
      title,
      body,
      type,
      research,
      //  image:'http://178.62.69.123/public/uploads/accountant_logo.jpeg'
    };

    const message = {
      to: user.fbToken,
      notification: {
        title: title,
        body: body,
      },
      data: notificatioObj,
    };

    axios
      .post(fcmEndpoint, JSON.stringify(message), {
        headers: {
          Authorization: `key=${serverKey}`,
          "Content-Type": "application/json",
        },
      })
      .then((response) => {
        console.log("Notification sent successfully:", response.data);
      })
      .catch((error) => {
        console.error("Error sending notification:");
      });

    let newNotification = new Message(notificatioObj);
    newNotification = await newNotification.save();

    // console.log("newNotification");
    // console.log(newNotification);
  } catch (error) {
    console.log("errrrrorrrrrrrrrrrrr");
    console.log(error);
  }
};
