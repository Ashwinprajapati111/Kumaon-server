const axios = require("axios");

const sendSMS = async (mobile, otp) => {
  try {
    const response = await axios.get("https://api.msg91.com/api/v5/otp", {
      params: {
        template_id: process.env.MSG91_TEMPLATE_ID,
        mobile: `91${mobile}`, // India code
        authkey: process.env.MSG91_AUTH_KEY,
        otp: otp,
      },
    });

    console.log("SMS sent:", response.data);
  } catch (error) {
    console.error("SMS Error:", error.response?.data || error.message);
    throw error;
  }
};

module.exports = sendSMS;