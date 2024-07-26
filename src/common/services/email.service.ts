import { Injectable } from '@nestjs/common';
import { SendMailOptions, Transporter, createTransport } from 'nodemailer';
import { AppConfigService } from 'src/config/env/env.config.service';
import { BRAND_NAME } from '../constants';

@Injectable()
export class EmailService {
  private transporter: Transporter;

  constructor(private readonly configService: AppConfigService) {
    this.transporter = createTransport({
      service: this.configService.nodeMailService,
      auth: {
        user: this.configService.brandEmail,
        pass: this.configService.brandEmailPwd,
      },
    });
  }

  async sendVerificationEmail(email: string, confirmationLink: string) {
    const { brandEmail, contactUsEmail } = this.configService;

    const brandAddress = '';

    const mailOptions: SendMailOptions = {
      from: brandEmail, // Sender address
      to: email, // List of recipients
      subject: 'Action Required: Please confirm your account', // Subject line
      html: `<div class="inbox-data-content-intro">
         <span>Welcome to ${BRAND_NAME}!</span>
         <span style="color: transparent; display: none; height: 0px; max-height: 0px; max-width: 0px; opacity: 0; overflow: hidden; visibility: hidden; width: 0px;">Welcome to ${BRAND_NAME}! Please verify your account.</span>
         <table role="presentation" border="0" cellpadding="0" cellspacing="0" style="background-color: rgb(248, 250, 252); width: 100%; border-collapse: separate;">
           <tbody><tr>
             <td style="font-family: Inter, sans-serif; font-size: 14px; vertical-align: top;">&nbsp;</td>
             <td style="display: block; max-width: 580px; padding: 10px; width: 580px; margin: 0px auto; font-family: Inter, sans-serif; font-size: 14px; vertical-align: top;">
               <div style="box-sizing: border-box; display: block; margin: 0px auto; max-width: 580px; padding: 10px;">
                 
                 <table role="presentation" style="background: rgb(255, 255, 255); border: 1px solid rgb(241, 245, 249); border-radius: 8px; width: 100%; border-collapse: separate;">
                   
                   <tbody><tr>
                     <td style="box-sizing: border-box; padding: 20px; font-family: Inter, sans-serif; font-size: 14px; vertical-align: top;">
                       <table role="presentation" border="0" cellpadding="0" cellspacing="0" style="border-collapse: separate; width: 100%;">
                         <tbody><tr>
                           <td style="font-family: Inter, sans-serif; font-size: 14px; vertical-align: top;">
                             <img src="" alt="${BRAND_NAME} Logo" height="28" width="120" border="0" style="border: 0px; outline: none; text-decoration: none; display: block; max-width: 100%;">
                             <hr style="border-width: 0px 0px 1px; border-top-style: initial; border-right-style: initial; border-left-style: initial; border-top-color: initial; border-right-color: initial; border-left-color: initial; border-image: initial; border-bottom-style: solid; border-bottom-color: rgb(241, 245, 249); margin: 12px 0px 28px;">
                           </td>
                         </tr>
                         <tr>
                           <td style="font-family: Inter, sans-serif; font-size: 14px; vertical-align: top;">
                             <h1 style="text-align: left; color: rgb(0, 0, 0); font-family: Inter, sans-serif; font-weight: 400; line-height: 1.4; margin: 0px 0px 30px; font-size: 30px;">Hi there! 👋</h1>
                             <p style="font-family: Inter, sans-serif; font-size: 14px; font-weight: normal; margin: 0px 0px 15px;">
                               Please verify your email address by clicking the
                               following link:
                             </p>
                             <table role="presentation" border="0" cellpadding="0" cellspacing="0" style="box-sizing: border-box; width: 100%; border-collapse: separate;">
                               <tbody>
                                 <tr>
                                   <td align="left" style="padding-bottom: 15px; font-family: Inter, sans-serif; font-size: 14px; vertical-align: top;">
                                     <table role="presentation" border="0" cellpadding="0" cellspacing="0" style="width: auto; border-collapse: separate;">
                                       <tbody>
                                         <tr>
                                           <td style="background-color: rgb(59, 130, 246); border-radius: 8px; text-align: center; font-family: Inter, sans-serif; font-size: 14px; vertical-align: top;">
                                             <a href="${confirmationLink}" target="_blank" style="background-color: rgb(59, 130, 246); border: 1px solid rgb(59, 130, 246); color: rgb(255, 255, 255); border-radius: 6px; box-sizing: border-box; cursor: pointer; display: inline-block; font-size: 14px; font-weight: 500; line-height: 20px; margin: 0px; padding: 6px 10px; text-decoration: none;">Confirm my account</a>
                                           </td>
                                         </tr>
                                       </tbody>
                                     </table>
                                   </td>
                                 </tr>
                               </tbody>
                             </table>
                             <p style="font-family: Inter, sans-serif; font-size: 14px; font-weight: normal; margin: 0px 0px 15px;">
                               <b>This link will be valid for the next 10 days, so
                                 please confirm at your earliest convenience.</b>
                             </p>
             
                             <p style="font-family: Inter, sans-serif; font-size: 14px; font-weight: normal; margin: 0px 0px 15px;">
                               If you are having any issues with your account, please
                               don’t hesitate to contact us by replying to this
                               email.
                             </p>
             
                             <p style="font-family: Inter, sans-serif; font-size: 14px; font-weight: normal; margin: 0px 0px 15px;">Thanks! <br>The ${BRAND_NAME} Team</p>
                           </td>
                         </tr>
                       </tbody></table>
                     </td>
                   </tr>
                 </tbody></table>
                 <div style="clear: both; margin-top: 12px; text-align: center; width: 100%;">
                   <table role="presentation" border="0" cellpadding="0" cellspacing="0" style="border-collapse: separate; width: 100%;">
                     <tbody><tr>
                       <td style="color: rgb(153, 153, 153); font-size: 12px; text-align: center; padding-bottom: 10px; padding-top: 10px; font-family: Inter, sans-serif; vertical-align: top;">
                         <span style="color: rgb(153, 153, 153); font-size: 12px; text-align: center;">${brandAddress}</span>
                       </td>
                     </tr>
                     <tr>
                       <td style="color: rgb(153, 153, 153); font-size: 12px; text-align: center; padding-bottom: 10px; padding-top: 10px; font-family: Inter, sans-serif; vertical-align: top;">
                         <a href="" style="color: rgb(153, 153, 153); font-size: 12px; text-align: center; text-decoration: none;">${BRAND_NAME}</a> -
                         <a href="" style="color: rgb(153, 153, 153); font-size: 12px; text-align: center; text-decoration: none;">${contactUsEmail}</a>.
                       </td>
                     </tr>
                   </tbody></table>
                 </div>
               </div>
             </td>
             <td style="font-family: Inter, sans-serif; font-size: 14px; vertical-align: top;">&nbsp;</td>
           </tr>
         </tbody></table>
       <img src="" height="1" width="1" alt="" style="border: none; max-width: 100%;">
     </div>`,
    };

    try {
      await this.transporter.sendMail(mailOptions);
    } catch (error) {
      console.error('Error sending verification email:', error);
    }
  }
}
