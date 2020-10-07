const nodemailer = require('nodemailer')
const sendGridTransport = require('nodemailer-sendgrid-transport')
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const crypto = require('crypto')
const { validationResult } = require('express-validator');


const User = require('../models/User');
const HttpError = require('../models/http-error');

const transporter = nodemailer.createTransport(sendGridTransport({
  auth: {
    api_key: process.env.SEND_GRID_API_KEY
  }
}))

const signUp = async (req, res, next) => {
  const error = validationResult(req);
  if (!error.isEmpty()) {
    return next(new HttpError('Invalid inputs', 422));
  }
  let foundEmail;
  let hashedPassword;
  let token;
  const { name, email, password } = req.body;

  try {
    foundEmail = await User.findOne({ email: email });
  } catch (error) {
    return next(new HttpError('Auth failed!'));
  }
  if (foundEmail) {
    return next(new HttpError('Email exists, sign in!', 422));
  }

  try {
    hashedPassword = await bcrypt.hash(password, 12);
  } catch (error) {
    return next(new HttpError('Password hashing failed!', 500));
  }

  const newUser = new User({
    name,
    email,
    password: hashedPassword,
  });

  try {
    await newUser.save();
  } catch (error) {
    return next(new HttpError('Auth failed!', 500));
  }

  try {
    token = jwt.sign(
      { userId: newUser.id, email: newUser.email },
      'keepmeasecret',
      { expiresIn: '1h' }
    );
  } catch (error) {
    return next(new HttpError('Unable to generate tokens', 500));
  }
  try {
    await transporter.sendMail({
      to: email,
      from: 'adwera.shadrack@gmail.com',
      subject: 'Successful Sign up',
      html: `<!DOCTYPE html PUBLIC "-//W3C//DTD XHTML 1.0 Strict//EN" "http://www.w3.org/TR/xhtml1/DTD/xhtml1-strict.dtd"><html data-editor-version="2" class="sg-campaigns" xmlns="http://www.w3.org/1999/xhtml"><head>
      <meta http-equiv="Content-Type" content="text/html; charset=utf-8">
      <meta name="viewport" content="width=device-width, initial-scale=1, minimum-scale=1, maximum-scale=1">
      <!--[if !mso]><!-->
      <meta http-equiv="X-UA-Compatible" content="IE=Edge">
      <!--<![endif]-->
      <!--[if (gte mso 9)|(IE)]>
      <xml>
        <o:OfficeDocumentSettings>
          <o:AllowPNG/>
          <o:PixelsPerInch>96</o:PixelsPerInch>
        </o:OfficeDocumentSettings>
      </xml>
      <![endif]-->
      <!--[if (gte mso 9)|(IE)]>
  <style type="text/css">
    body {width: 600px;margin: 0 auto;}
    table {border-collapse: collapse;}
    table, td {mso-table-lspace: 0pt;mso-table-rspace: 0pt;}
    img {-ms-interpolation-mode: bicubic;}
  </style>
<![endif]-->
      <style type="text/css">
    body, p, div {
      font-family: courier, monospace;
      font-size: 16px;
    }
    body {
      color: #FFFFFF;
    }
    body a {
      color: #fe5d61;
      text-decoration: none;
    }
    p { margin: 0; padding: 0; }
    table.wrapper {
      width:100% !important;
      table-layout: fixed;
      -webkit-font-smoothing: antialiased;
      -webkit-text-size-adjust: 100%;
      -moz-text-size-adjust: 100%;
      -ms-text-size-adjust: 100%;
    }
    img.max-width {
      max-width: 100% !important;
    }
    .column.of-2 {
      width: 50%;
    }
    .column.of-3 {
      width: 33.333%;
    }
    .column.of-4 {
      width: 25%;
    }
    @media screen and (max-width:480px) {
      .preheader .rightColumnContent,
      .footer .rightColumnContent {
        text-align: left !important;
      }
      .preheader .rightColumnContent div,
      .preheader .rightColumnContent span,
      .footer .rightColumnContent div,
      .footer .rightColumnContent span {
        text-align: left !important;
      }
      .preheader .rightColumnContent,
      .preheader .leftColumnContent {
        font-size: 80% !important;
        padding: 5px 0;
      }
      table.wrapper-mobile {
        width: 100% !important;
        table-layout: fixed;
      }
      img.max-width {
        height: auto !important;
        max-width: 100% !important;
      }
      a.bulletproof-button {
        display: block !important;
        width: auto !important;
        font-size: 80%;
        padding-left: 0 !important;
        padding-right: 0 !important;
      }
      .columns {
        width: 100% !important;
      }
      .column {
        display: block !important;
        width: 100% !important;
        padding-left: 0 !important;
        padding-right: 0 !important;
        margin-left: 0 !important;
        margin-right: 0 !important;
      }
    }
  </style>
      <!--user entered Head Start-->

     <!--End Head user entered-->
    </head>
    <body>
      <center class="wrapper" data-link-color="#fe5d61" data-body-style="font-size:16px; font-family:courier, monospace; color:#FFFFFF; background-color:#f2f4fb;">
        <div class="webkit">
          <table cellpadding="0" cellspacing="0" border="0" width="100%" class="wrapper" bgcolor="#f2f4fb">
            <tbody><tr>
              <td valign="top" bgcolor="#f2f4fb" width="100%">
                <table width="100%" role="content-container" class="outer" align="center" cellpadding="0" cellspacing="0" border="0">
                  <tbody><tr>
                    <td width="100%">
                      <table width="100%" cellpadding="0" cellspacing="0" border="0">
                        <tbody><tr>
                          <td>
                            <!--[if mso]>
    <center>
    <table><tr><td width="600">
  <![endif]-->
                                    <table width="100%" cellpadding="0" cellspacing="0" border="0" style="width:100%; max-width:600px;" align="center">
                                      <tbody><tr>
                                        <td role="modules-container" style="padding:0px 0px 0px 0px; color:#FFFFFF; text-align:left;" bgcolor="#f2f4fb" width="100%" align="left"><table class="module preheader preheader-hide" role="module" data-type="preheader" border="0" cellpadding="0" cellspacing="0" width="100%" style="display: none !important; mso-hide: all; visibility: hidden; opacity: 0; color: transparent; height: 0; width: 0;">
    <tbody><tr>
      <td role="module-content">
        <p>You've found the secret!</p>
      </td>
    </tr>
  </tbody></table><table class="wrapper" role="module" data-type="image" border="0" cellpadding="0" cellspacing="0" width="100%" style="table-layout: fixed;" data-muid="98ndJyAY9BSGjoVqrr6FYx">
      <tbody><tr>
        <td style="font-size:6px; line-height:10px; padding:30px 0px 30px 0px;" valign="top" align="left">
          <img class="max-width" border="0" style="display:block; color:#000000; text-decoration:none; font-family:Helvetica, arial, sans-serif; font-size:16px; max-width:40% !important; width:40%; height:auto !important;" src="https://marketing-image-production.s3.amazonaws.com/uploads/9d9c1f3d8009c42bbe60c0355f1ed23e86c3f5619173e83a9328b9214e42e1c1d5e009ed5cc4c8f3efedfc33d46bba2f4577b143607025a29add6e89ab4662ad.png" alt="Off Grid Adventures" width="240" data-responsive="true" data-proportionally-constrained="false">
        </td>
      </tr>
    </tbody></table><table class="wrapper" role="module" data-type="image" border="0" cellpadding="0" cellspacing="0" width="100%" style="table-layout: fixed;" data-muid="3Ypdby9Xfsf2rN27zTDEfN">
      <tbody><tr>
        <td style="font-size:6px; line-height:10px; padding:0px 0px 0px 0px;" valign="top" align="center">
          <img class="max-width" border="0" style="display:block; color:#000000; text-decoration:none; font-family:Helvetica, arial, sans-serif; font-size:16px; max-width:100% !important; width:100%; height:auto !important;" src="https://marketing-image-production.s3.amazonaws.com/uploads/e324b295c47223f1a936198fbd4e5d4b239ff86c6d6c89d4d0eb8d7c61028921abfc4901ba607f6dcb7acc7067bb0c6df4313726b14b8274e0b2c98cdf8b58d2.png" alt="" width="600" data-responsive="true" data-proportionally-constrained="false">
        </td>
      </tr>
    </tbody></table><table class="module" role="module" data-type="text" border="0" cellpadding="0" cellspacing="0" width="100%" style="table-layout: fixed;" data-muid="7pyDCmyDaGcm5WsBBSaEgv">
      <tbody><tr>
        <td style="background-color:#FE5D61; padding:50px 0px 30px 0px; line-height:22px; text-align:inherit;" height="100%" valign="top" bgcolor="#FE5D61"><div><div style="font-family: inherit; text-align: center"><span style="font-size: 24px">Welcome to the family!</span></div><div></div></div></td>
      </tr>
    </tbody></table><table class="module" role="module" data-type="text" border="0" cellpadding="0" cellspacing="0" width="100%" style="table-layout: fixed;" data-muid="nSVYnVzPLnGZ4wUdynLiKo">
      <tbody><tr>
        <td style="background-color:#fe5d61; padding:30px 50px 30px 50px; line-height:22px; text-align:inherit;" height="100%" valign="top" bgcolor="#fe5d61"><div><div style="font-family: inherit; text-align: center">You've found a community of travelers that are just like you.</div>
<div style="font-family: inherit; text-align: center">&nbsp;</div>
<div style="font-family: inherit; text-align: center">We don't want to be stuck in tourist traps that isolate us from vibrant, local experiences. We want to discover the hidden gems and less-traveled roads of our next destination.</div>
<div style="font-family: inherit; text-align: center">&nbsp;</div>
<div style="font-family: inherit; text-align: center">Ready for your next authentic travel experience?</div><div></div></div></td>
      </tr>
    </tbody></table><table border="0" cellpadding="0" cellspacing="0" class="module" data-role="module-button" data-type="button" role="module" style="table-layout:fixed" width="100%" data-muid="4ywPd9vJ6WFyV1Si75h9vh"><tbody><tr><td align="center" bgcolor="#fe5d61" class="outer-td" style="padding:10px 10px 60px 10px; background-color:#fe5d61;"><table border="0" cellpadding="0" cellspacing="0" class="button-css__deep-table___2OZyb wrapper-mobile" style="text-align:center"><tbody><tr><td align="center" bgcolor="#ffffff" class="inner-td" style="border-radius:6px; font-size:16px; text-align:center; background-color:inherit;"><a style="background-color:#ffffff; border:1px solid #ffffff; border-color:#ffffff; border-radius:3px; border-width:1px; color:#fe5d61; display:inline-block; font-size:16px; font-weight:700; letter-spacing:1px; line-height:40px; padding:12px 20px 12px 20px; text-align:center; text-decoration:none; border-style:solid;" href="" target="_blank">Browse Gallery</a></td></tr></tbody></table></td></tr></tbody></table><table class="wrapper" role="module" data-type="image" border="0" cellpadding="0" cellspacing="0" width="100%" style="table-layout: fixed;" data-muid="6jxKSRk9dKQ1Tvi1wtnu8q">
      <tbody><tr>
        <td style="font-size:6px; line-height:10px; padding:0px 0px 0px 0px;" valign="top" align="center">
          <img class="max-width" border="0" style="display:block; color:#000000; text-decoration:none; font-family:Helvetica, arial, sans-serif; font-size:16px; max-width:100% !important; width:100%; height:auto !important;" src="https://marketing-image-production.s3.amazonaws.com/uploads/0accac77b1e34c614730ab732317a493478835c96bd549fb2df7a921ec1177fdb30d6d33e1d0a33d8c6c579344890ae408ce13aaed0e478f1fd6d2219d308365.png" alt="" width="600" data-responsive="true" data-proportionally-constrained="false">
        </td>
      </tr>
    </tbody></table><table class="module" role="module" data-type="spacer" border="0" cellpadding="0" cellspacing="0" width="100%" style="table-layout: fixed;" data-muid="iYySZ4rAB78PLoW7vU13Bb">
      <tbody><tr>
        <td style="padding:0px 0px 30px 0px;" role="module-content" bgcolor="">
        </td>
      </tr>
    </tbody></table><table class="module" role="module" data-type="divider" border="0" cellpadding="0" cellspacing="0" width="100%" style="table-layout: fixed;" data-muid="mVyZz43HETwfwb72TGh4iy">
      <tbody><tr>
        <td style="padding:0px 0px 0px 0px;" role="module-content" height="100%" valign="top" bgcolor="">
          <table border="0" cellpadding="0" cellspacing="0" align="center" width="100%" height="3px" style="line-height:3px; font-size:3px;">
            <tbody><tr>
              <td style="padding:0px 0px 3px 0px;" bgcolor="#ffffff"></td>
            </tr>
          </tbody></table>
        </td>
      </tr>
    </tbody></table><table class="module" role="module" data-type="spacer" border="0" cellpadding="0" cellspacing="0" width="100%" style="table-layout: fixed;" data-muid="sfek66tVLi5d2iy5jmSawj">
      <tbody><tr>
        <td style="padding:0px 0px 30px 0px;" role="module-content" bgcolor="">
        </td>
      </tr>
    </tbody></table><table class="module" role="module" data-type="social" align="center" border="0" cellpadding="0" cellspacing="0" width="100%" style="table-layout: fixed;" data-muid="kTqJe3Ke2movtrLxSjKW3C">
      <tbody>
        <tr>
          <td valign="top" style="padding:0px 0px 0px 0px; font-size:6px; line-height:10px;" align="center">
            <table align="center">
              <tbody>
                <tr><td style="padding: 0px 5px;">
      <a role="social-icon-link" href="https://www.facebook.com/sendgrid/" target="_blank" alt="Facebook" title="Facebook" style="display:inline-block; background-color:#fe5d61; height:30px; width:30px; border-radius:2px; -webkit-border-radius:2px; -moz-border-radius:2px;">
        <img role="social-icon" alt="Facebook" title="Facebook" src="https://marketing-image-production.s3.amazonaws.com/social/white/facebook.png" style="height:30px; width:30px;" height="30" width="30">
      </a>
    </td><td style="padding: 0px 5px;">
      <a role="social-icon-link" href="https://twitter.com/sendgrid?ref_src=twsrc%5egoogle%7ctwcamp%5eserp%7ctwgr%5eauthor" target="_blank" alt="Twitter" title="Twitter" style="display:inline-block; background-color:#fe5d61; height:30px; width:30px; border-radius:2px; -webkit-border-radius:2px; -moz-border-radius:2px;">
        <img role="social-icon" alt="Twitter" title="Twitter" src="https://marketing-image-production.s3.amazonaws.com/social/white/twitter.png" style="height:30px; width:30px;" height="30" width="30">
      </a>
    </td><td style="padding: 0px 5px;">
      <a role="social-icon-link" href="https://www.instagram.com/sendgrid/?hl=en" target="_blank" alt="Instagram" title="Instagram" style="display:inline-block; background-color:#fe5d61; height:30px; width:30px; border-radius:2px; -webkit-border-radius:2px; -moz-border-radius:2px;">
        <img role="social-icon" alt="Instagram" title="Instagram" src="https://marketing-image-production.s3.amazonaws.com/social/white/instagram.png" style="height:30px; width:30px;" height="30" width="30">
      </a>
    </td><td style="padding: 0px 5px;">
      <a role="social-icon-link" href="https://www.pinterest.com/sendgrid/" target="_blank" alt="Pinterest" title="Pinterest" style="display:inline-block; background-color:#fe5d61; height:30px; width:30px; border-radius:2px; -webkit-border-radius:2px; -moz-border-radius:2px;">
        <img role="social-icon" alt="Pinterest" title="Pinterest" src="https://marketing-image-production.s3.amazonaws.com/social/white/pinterest.png" style="height:30px; width:30px;" height="30" width="30">
      </a>
    </td></tr>
              </tbody>
            </table>
          </td>
        </tr>
      </tbody>
    </table><div data-role="module-unsubscribe" class="module unsubscribe-css__unsubscribe___2CDlR" role="module" data-type="unsubscribe" style="color:#FFFFFF; font-size:12px; line-height:20px; padding:16px 16px 16px 16px; text-align:center;" data-muid="txBUUpmixSjuZ5Ad69p1sX">
    
    <p style="font-family:arial,helvetica,sans-serif; font-size:12px; line-height:20px;"><a class="Unsubscribe--unsubscribeLink" href="{{{unsubscribe}}}" style="">Unsubscribe</a> - <a href="{{{unsubscribe_preferences}}}" target="_blank" class="Unsubscribe--unsubscribePreferences" style="">Unsubscribe Preferences</a></p></div></td>
                                      </tr>
                                    </tbody></table>
                                    <!--[if mso]>
                                  </td>
                                </tr>
                              </table>
                            </center>
                            <![endif]-->
                          </td>
                        </tr>
                      </tbody></table>
                    </td>
                  </tr>
                </tbody></table>
              </td>
            </tr>
          </tbody></table>
        </div>
      </center>
    
  
</body></html>`
    })
  } catch (error) {
    console.log(error.message)
  }
  res.status(201).json({
    message: 'Sign up successful',
    user: {
      id: newUser._id.toString(),
      name: newUser.name,
      email: newUser.email,
      token: token,
    },
  });
};

const login = async (req, res, next) => {
  const { email, password } = req.body;

  let foundEmail;
  let isPassword;
  let token;

  try {
    foundEmail = await User.findOne({ email: email });
  } catch (error) {
    return next(new HttpError('Unable to find emails', 500));
  }
  if (!foundEmail) {
    return next(new HttpError('Email dont exist! Sign up instead', 422));
  }

  try {
    isPassword = await bcrypt.compare(password, foundEmail.password);
  } catch (error) {
    return next(new HttpError('Unable to compare passwords', 500));
  }

  if (!isPassword) {
    return next(new HttpError('Wrong password', 422));
  }

  try {
    token = jwt.sign({ userId: foundEmail.id, email: foundEmail.email },'keepmeasecret',{expiresIn:'1h'});
  } catch (error) {
    return next(new HttpError('Token generation failed!', 500));
  }

  res
    .status(200)
    .json({
      message: 'Login Successful',
      user: {
        id: foundEmail._id.toString(),
        name: foundEmail.name,
        email: foundEmail.email,
        token: token,
      },
    });
};

const resetPassword = async(req,res,next) => {
  const error = validationResult(req)
  if(!error.isEmpty()) {
    return next(new HttpError('Invalid email, try again',422))
  }
  const { email } = req.body
  let foundEmail
  
  try {
    foundEmail = await User.findOne({email: email})
  } catch (error) {
    return next(new HttpError('Unable to fetch email',500))
  }
  if(!foundEmail) {
    return next(new HttpError('Email does not exist!',422))
  }
  crypto.randomBytes(32, async(err, buffer)=>{
    if(err) {
      console.log(err)
      return next(new HttpError('Server error',500))
    }
    const token = buffer.toString('hex')
    foundEmail.resetToken = token
    foundEmail.resetTokenExpiration = Date.now() + 3600000
    try {
      await foundEmail.save()
    } catch (error) {
      return next(new HttpError('Unable to save user',500))
    }
    try {
      await transporter.sendMail({
        from:"adwera.shadrack@gmail.com",
        to: email,
        subject:"Email Reset",
        html:`
        <!DOCTYPE html>
<html>
<head>

  <meta charset="utf-8">
  <meta http-equiv="x-ua-compatible" content="ie=edge">
  <title>Password Reset</title>
  <meta name="viewport" content="width=device-width, initial-scale=1">
  <style type="text/css">
  /**
   * Google webfonts. Recommended to include the .woff version for cross-client compatibility.
   */
  @media screen {
    @font-face {
      font-family: 'Source Sans Pro';
      font-style: normal;
      font-weight: 400;
      src: local('Source Sans Pro Regular'), local('SourceSansPro-Regular'), url(https://fonts.gstatic.com/s/sourcesanspro/v10/ODelI1aHBYDBqgeIAH2zlBM0YzuT7MdOe03otPbuUS0.woff) format('woff');
    }

    @font-face {
      font-family: 'Source Sans Pro';
      font-style: normal;
      font-weight: 700;
      src: local('Source Sans Pro Bold'), local('SourceSansPro-Bold'), url(https://fonts.gstatic.com/s/sourcesanspro/v10/toadOcfmlt9b38dHJxOBGFkQc6VGVFSmCnC_l7QZG60.woff) format('woff');
    }
  }

  /**
   * Avoid browser level font resizing.
   * 1. Windows Mobile
   * 2. iOS / OSX
   */
  body,
  table,
  td,
  a {
    -ms-text-size-adjust: 100%; /* 1 */
    -webkit-text-size-adjust: 100%; /* 2 */
  }

  /**
   * Remove extra space added to tables and cells in Outlook.
   */
  table,
  td {
    mso-table-rspace: 0pt;
    mso-table-lspace: 0pt;
  }

  /**
   * Better fluid images in Internet Explorer.
   */
  img {
    -ms-interpolation-mode: bicubic;
  }

  /**
   * Remove blue links for iOS devices.
   */
  a[x-apple-data-detectors] {
    font-family: inherit !important;
    font-size: inherit !important;
    font-weight: inherit !important;
    line-height: inherit !important;
    color: inherit !important;
    text-decoration: none !important;
  }

  /**
   * Fix centering issues in Android 4.4.
   */
  div[style*="margin: 16px 0;"] {
    margin: 0 !important;
  }

  body {
    width: 100% !important;
    height: 100% !important;
    padding: 0 !important;
    margin: 0 !important;
  }

  /**
   * Collapse table borders to avoid space between cells.
   */
  table {
    border-collapse: collapse !important;
  }

  a {
    color: #1a82e2;
  }

  img {
    height: auto;
    line-height: 100%;
    text-decoration: none;
    border: 0;
    outline: none;
  }
  </style>

</head>
<body style="background-color: #e9ecef;">

  <!-- start preheader -->
  <div class="preheader" style="display: none; max-width: 0; max-height: 0; overflow: hidden; font-size: 1px; line-height: 1px; color: #fff; opacity: 0;">
    A preheader is the short summary text that follows the subject line when an email is viewed in the inbox.
  </div>
  <!-- end preheader -->

  <!-- start body -->
  <table border="0" cellpadding="0" cellspacing="0" width="100%">

    <!-- start hero -->
    <tr>
      <td align="center" bgcolor="#e9ecef">
        <table border="0" cellpadding="0" cellspacing="0" width="100%" style="max-width: 600px;">
          <tr>
            <td align="left" bgcolor="#ffffff" style="padding: 36px 24px 0; font-family: 'Source Sans Pro', Helvetica, Arial, sans-serif; border-top: 3px solid #d4dadf;">
              <h1 style="margin: 0; font-size: 32px; font-weight: 700; letter-spacing: -1px; line-height: 48px;">Reset Your Password</h1>
            </td>
          </tr>
        </table>
      </td>
    </tr>
    <!-- end hero -->

    <!-- start copy block -->
    <tr>
      <td align="center" bgcolor="#e9ecef">
        <table border="0" cellpadding="0" cellspacing="0" width="100%" style="max-width: 600px;">

          <!-- start copy -->
          <tr>
            <td align="left" bgcolor="#ffffff" style="padding: 24px; font-family: 'Source Sans Pro', Helvetica, Arial, sans-serif; font-size: 16px; line-height: 24px;">
              <p style="margin: 0;">Tap the button below to reset your account password. If you didn't request a new password, you can safely delete this email.</p>
            </td>
          </tr>
          <!-- end copy -->

          <!-- start button -->
          <tr>
            <td align="left" bgcolor="#ffffff">
              <table border="0" cellpadding="0" cellspacing="0" width="100%">
                <tr>
                  <td align="center" bgcolor="#ffffff" style="padding: 12px;">
                    <table border="0" cellpadding="0" cellspacing="0">
                      <tr>
                        <td align="center" bgcolor="#1a82e2" style="border-radius: 6px;">
                          <a href="http://localhost:3000/reset-password/${token}" target="_blank" style="display: inline-block; padding: 16px 36px; font-family: 'Source Sans Pro', Helvetica, Arial, sans-serif; font-size: 16px; color: #ffffff; text-decoration: none; border-radius: 6px;">Reset Password</a>
                        </td>
                      </tr>
                    </table>
                  </td>
                </tr>
              </table>
            </td>
          </tr>
          <!-- end button -->

          <!-- start copy -->
          <tr>
            <td align="left" bgcolor="#ffffff" style="padding: 24px; font-family: 'Source Sans Pro', Helvetica, Arial, sans-serif; font-size: 16px; line-height: 24px; border-bottom: 3px solid #d4dadf">
              <p style="margin: 0;">Cheers,<br> Admin</p>
            </td>
          </tr>
          <!-- end copy -->

        </table>
      </td>
    </tr>
    <!-- end copy block -->

    <!-- start footer -->
    <tr>
      <td align="center" bgcolor="#e9ecef" style="padding: 24px;">
        <table border="0" cellpadding="0" cellspacing="0" width="100%" style="max-width: 600px;">

          <!-- start permission -->
          <tr>
            <td align="center" bgcolor="#e9ecef" style="padding: 12px 24px; font-family: 'Source Sans Pro', Helvetica, Arial, sans-serif; font-size: 14px; line-height: 20px; color: #666;">
              <p style="margin: 0;">You received this email because we received a request for password reset for your account. If you didn't request this you can safely delete this email.</p>
            </td>
          </tr>
          <!-- end permission -->

          <!-- start unsubscribe -->
          <tr>
            <td align="center" bgcolor="#e9ecef" style="padding: 12px 24px; font-family: 'Source Sans Pro', Helvetica, Arial, sans-serif; font-size: 14px; line-height: 20px; color: #666;">
              <p style="margin: 0;">To stop receiving these emails, you can <a href="https://sendgrid.com" target="_blank">unsubscribe</a> at any time.</p>
              <p style="margin: 0;">Adwesh Limited, Nairobi, Kenya</p>
            </td>
          </tr>
          <!-- end unsubscribe -->

        </table>
        <!--[if (gte mso 9)|(IE)]>
        </td>
        </tr>
        </table>
        <![endif]-->
      </td>
    </tr>
    <!-- end footer -->

  </table>
  <!-- end body -->

</body>
</html>
        `
      })
      console.log('Were here now...')
    } catch (error) {
      console.log(error.message)
      return next(new HttpError('Server error',500))
    }
  })
}

const updatePassword = async(req,res,next) => {
  const error = validationResult(req)
  if(!error.isEmpty()) {
    return next(new HttpError('Password too short',422))
  }

  const { newPassword } = req.body
  let foundUser
  let hashedPassword
  const token = req.params.token
  try {
    foundUser = await User.findOne({resetToken: token, resetTokenExpiration: {$gt: Date.now()}})
  } catch (error) {
    return next(new HttpError('Unable yo verify user',500))
  }
  if(!foundUser) {
    return next(new HttpError('Unable to reset password, try again',500))
  }
  if(req.userData.userId !==foundUser._id.toString()) {
    return next(new HttpError('You are not authorized to perform this action',403))
  }
  try {
    hashedPassword = bcrypt.hash(newPassword, 12)
  } catch (error) {
    return next(new HttpError('Reset failed!',500))
  }

  foundUser.password = hashedPassword
  foundUser.resetToken = null
  foundUser.resetTokenExpiration = undefined

  try {
    await foundUser.save()
  } catch (error) {
    return next(new HttpError('Reset failed!',500))
  }
  res.status(200).json({message: 'Successfully Reset Password'})

}

exports.signUp = signUp
exports.login = login
exports.resetPassword = resetPassword
exports.updatePassword = updatePassword
