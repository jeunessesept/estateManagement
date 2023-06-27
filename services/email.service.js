const nodemailer = require('nodemailer');
const transporter = require('../config/sendmail.config')
const fs = require("fs")

const transport = transporter.transporter
const urlClient = process.env.URL_CLIENT



/// sendEmail set up
const sendEmail = async (to, subject, mailBody,fileName, attachment) => {       /// attachment ? 
  const mailOptions = {
    from: process.env.SMTP_EMAIL_FROM,
    to,
    subject,
    html: mailBody
  };

  const filePath = `/Users/jiacintobranducci/Documents/STAGE/leaseAgreement/${fileName}`;    /// filePath needs to be change to a proper cloud path or whatever will be use


  if (attachment) {
    mailOptions.attachments = [
      {
        path : filePath
      },
    ]
  }

  await transport.sendMail(mailOptions, (error, data) => {
    if (error) {
      console.log(error);
      return error
    } else {
      console.log("Email sent successfully");
    }
  });

};

//// email for resetting password after the first connection
const sendResetPasswordEmail = async (to, token, id) => {
  const subject = 'Reset password';
  const resetPasswordUrl = `http://${urlClient}/password/id/${id}/token/${token}`;
  const text = `Dear user,<br><br>
  To reset your password, click on this link:<br><br> ${resetPasswordUrl}<br><br>
  If you did not request any password resets, then ignore this email`;
  await sendEmail(to, subject, text);
};


/// confirmation sent to the user after he has updated his password
const sendPasswordChangedConfirmation = async (to) => {  
  const subject = 'Password has been changed';
  const text = `Dear user,
  Your password has been updated successfully`;
  await sendEmail(to, subject, text);
};


/// email for registration of a new tenant 
const sendTenantRegisterForm = async (to, tenantId, token) => {
  const subject = 'Registration';
  const registrationUrl = `http://${urlClient}/tenant/registration/${tenantId}/token/${token}`;
  const text = `Dear futur tenant, <br><br>
  click on the following link to register your informations to rent our room <br><br>
  ${registrationUrl} <br><br>
  thanks for your time `;

  await sendEmail(to, subject, text)
}

//confirmation email after the prospective tenant has completed the registration form
const sendTenantRegisterConfirmation = async (to, tenantName) => {
  const subject = "Confirmation";
  const text = `Dear ${tenantName}, <br><br>
  thank you for registered your informations. <br><br>
  See you soon :)`;

  await sendEmail(to, subject, text, tenantName)
}

//mail sending the lease contract to the signatory owners/managers
const sendLeaseAgreement = async (to, tenantName, tenantFullname) => {
  const subject = `Contrat de bail ${tenantName}`;
  const fileName = `${tenantName}Contract.pdf`
  const text = `hello, <br><br>
  voici le contrat de bail de ${tenantFullname} `;


  await sendEmail(to, subject, text, fileName, tenantFullname, true)
}


module.exports = { sendEmail, 
  sendResetPasswordEmail, 
  sendPasswordChangedConfirmation, 
  sendTenantRegisterForm, 
  sendTenantRegisterConfirmation,
  sendLeaseAgreement
 }