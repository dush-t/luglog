const bookingConfirmationEmailUser = (storageSpace, booking, user) => {
    return `
    <!doctype html>
<html xmlns="http://www.w3.org/1999/xhtml" xmlns:v="urn:schemas-microsoft-com:vml" xmlns:o="urn:schemas-microsoft-com:office:office">

<head>
    <title>

    </title>

    <meta http-equiv="X-UA-Compatible" content="IE=edge">
   
    <meta http-equiv="Content-Type" content="text/html; charset=UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1">
    

    <style type="text/css">
@media only screen and (max-width:480px) {
  @-ms-viewport {
    width: 320px;
  }

  @viewport {
    width: 320px;
  }
}
</style>

    <style type="text/css">
@media only screen and (min-width:480px) {
  .mj-column-per-100 {
    width: 100% !important;
  }
}
</style>


    

</head>

<body style="margin: 0; padding: 0; -webkit-text-size-adjust: 100%; -ms-text-size-adjust: 100%; background-color: #f9f9f9;">


    <div style="background-color:#f9f9f9;">


        <div style="background:#f9f9f9;background-color:#f9f9f9;Margin:0px auto;max-width:600px;">

            <table align="center" border="0" cellpadding="0" cellspacing="0" role="presentation" style="border-collapse: collapse; mso-table-lspace: 0pt; mso-table-rspace: 0pt; background: #f9f9f9; background-color: #f9f9f9; width: 100%;" width="100%" bgcolor="#f9f9f9">
                <tbody>
                    <tr>
                        <td style="border-collapse: collapse; mso-table-lspace: 0pt; mso-table-rspace: 0pt; border-bottom: #333957 solid 5px; direction: ltr; font-size: 0px; padding: 20px 0; text-align: center; vertical-align: top;" align="center" valign="top">
                   
                        </td>
                    </tr>
                </tbody>
            </table>

        </div>


        <div style="background:#fff;background-color:#fff;Margin:0px auto;max-width:600px;">

            <table align="center" border="0" cellpadding="0" cellspacing="0" role="presentation" style="border-collapse: collapse; mso-table-lspace: 0pt; mso-table-rspace: 0pt; background: #fff; background-color: #fff; width: 100%;" width="100%" bgcolor="#fff">
                <tbody>
                    <tr>
                        <td style="border-collapse: collapse; mso-table-lspace: 0pt; mso-table-rspace: 0pt; border: #dddddd solid 1px; border-top: 0px; direction: ltr; font-size: 0px; padding: 20px 0; text-align: center; vertical-align: top;" align="center" valign="top">
                           
                            <div class="mj-column-per-100 outlook-group-fix" style="font-size:13px;text-align:left;direction:ltr;display:inline-block;vertical-align:bottom;width:100%;">

                                <table border="0" cellpadding="0" cellspacing="0" role="presentation" style="border-collapse: collapse; mso-table-lspace: 0pt; mso-table-rspace: 0pt; vertical-align: bottom;" width="100%" valign="bottom">

                                    <tr>
                                        <td align="center" style="border-collapse: collapse; mso-table-lspace: 0pt; mso-table-rspace: 0pt; font-size: 0px; padding: 10px 25px; word-break: break-word;">

                                            <table align="center" border="0" cellpadding="0" cellspacing="0" role="presentation" style="mso-table-lspace: 0pt; mso-table-rspace: 0pt; border-collapse: collapse; border-spacing: 0px;">
                                                <tbody>
                                                    <tr>
                                                        <td style="border-collapse: collapse; mso-table-lspace: 0pt; mso-table-rspace: 0pt; width: 64px;" width="64">

                                                            <img src="https://goluggagefree.com/static/media/hero-img-blue.d5bcd689.png" style="height: 80px; line-height: 100%; -ms-interpolation-mode: bicubic; border: 0; display: block; outline: none; text-decoration: none; width=auto;" >

                                                        </td>
                                                    </tr>
                                                </tbody>
                                            </table>

                                        </td>
                                    </tr>

                                    <tr>
                                        <td align="center" style="border-collapse: collapse; mso-table-lspace: 0pt; mso-table-rspace: 0pt; font-size: 0px; padding: 10px 25px; word-break: break-word;">

                                            <div style="font-family:'Helvetica Neue',Arial,sans-serif;font-size:24px;font-weight:bold;line-height:22px;text-align:center;color:#333;">
                                                Booking Confirmed
                                            </div>

                                        </td>
                                    </tr>

                                    <tr>
                                        <td align="left" style="border-collapse: collapse; mso-table-lspace: 0pt; mso-table-rspace: 0pt; font-size: 0px; padding: 10px 25px; word-break: break-word;">

                                            <div style="font-family:'Helvetica Neue',Arial,sans-serif;font-size:14px;line-height:22px;text-align:left;color:#525252;">
                                                <p style="display: block; margin: 13px 0;">Hi ${user.name},</p>

                                                <p style="display: block; margin: 13px 0;">Thank you for choosing GoLuggageFree. Your luggage is safe with us.<br><br>Please follow the below instructions to enjoy a hassle-free experience:</p>
                                                <ol type="1">
                                                    <li>Please produce your booking ticket along with the government approved ID as mentioned in the booking ticket</li>
                                                    <li>You must take a picture of the unique code printed on the security seal for extra safety</li>
                                                    <li>Please allow our partner to check the bags(for security reasons) before submitting the bags</li>
                                                    <li>Please avoid keeping any illegal or prohibited items like <strong>drugs, alchohol, explosives, cash, jewellery,etc</strong>. GoLuggageFree will not be liable for such items as mentioned in the <a href="https://goluggagefree.com/terms.html">Terms and Conditions</a>.</li>
                                                </ol>
                                            </div>

                                        </td>
                                    </tr>
                                    <tr>
                                            <td align="left" style="border-collapse: collapse; mso-table-lspace: 0pt; mso-table-rspace: 0pt; font-size: 0px; padding: 10px 25px; word-break: break-word;">
                                            <table 0="[object Object]" 1="[object Object]"  border="0" style="border-collapse: collapse; mso-table-lspace: 10pt; mso-table-rspace: 10pt; cellspacing: 0; color: #000; font-family: 'Helvetica Neue',Arial,sans-serif; font-size: 13px; line-height: 22px; table-layout: auto; width: 100%;" width="100%">
                                            <tr>
                                                    <td align="left" style="border-collapse: collapse; mso-table-lspace: 0pt; mso-table-rspace: 0pt; font-size: 0px; padding: 30px 45px; word-break: break-word;">
                                                            <img src="http://luglog.herokuapp.com/image/${storageSpace.storeImages[0].toString()}" height="80" width="auto" >                                              
                                                    </td>   
                                                    <td>
                                                        <p style="font-weight: 600;color: #444;font-size: 14px">${storageSpace.name}<br></p>
                                                        <p style="font-weight: 400;color: #666;font-size: 12px">${storageSpace.longAddress}</p>
                                                        <a href="${storageSpace.location}" style="font-weight: bold">Directions?</a>
                                                    </td>
                                            </tr>
                                            </table>
                                            </td>
                                    </tr>
                                    
                                    <tr>
                                        <td align="left" style="border-collapse: collapse; mso-table-lspace: 0pt; mso-table-rspace: 0pt; font-size: 0px; padding: 10px 25px; word-break: break-word;">
                                        
                                            <table 0="[object Object]" 1="[object Object]"  border="0" style="border-collapse: collapse; mso-table-lspace: 10pt; mso-table-rspace: 10pt; cellspacing: 0; color: #000; font-family: 'Helvetica Neue',Arial,sans-serif; font-size: 13px; line-height: 22px; table-layout: auto; width: 100%;" width="100%">                                                
                                                <tr style="border-bottom:1px solid #ecedee;text-align:left;">
                                                    <td style="border-collapse: collapse; mso-table-lspace: 0pt; mso-table-rspace: 0pt; padding: 0 15px 5px 0;">Booking ID</td>
                                                    <td style="border-collapse: collapse; mso-table-lspace: 0pt; mso-table-rspace: 0pt; padding: 0 0 0 15px;" align="right">${booking.bookingId}</td>
                                                </tr>
                                                <tr>
                                                    <td style="border-collapse: collapse; mso-table-lspace: 0pt; mso-table-rspace: 0pt; padding: 0 15px 5px 0;">Name</td>
                                                    <td style="border-collapse: collapse; mso-table-lspace: 0pt; mso-table-rspace: 0pt; padding: 0 0 0 15px;" align="right">${user.name}</td>
                                                </tr>   
                                                <tr>
                                                    <td style="border-collapse: collapse; mso-table-lspace: 0pt; mso-table-rspace: 0pt; padding: 0 15px 5px 0;">Govt. ID</td>
                                                    <td style="border-collapse: collapse; mso-table-lspace: 0pt; mso-table-rspace: 0pt; padding: 0 0 0 15px;" align="right">${booking.userGovtId}</td>
                                                </tr>
                                                <tr>
                                                    <td style="border-collapse: collapse; mso-table-lspace: 0pt; mso-table-rspace: 0pt; padding: 0 15px 5px 0;">Check-in(time)</td>
                                                    <td style="border-collapse: collapse; mso-table-lspace: 0pt; mso-table-rspace: 0pt; padding: 0 0 0 15px;" align="right">${booking.checkInTime}</td>
                                                </tr>
                                                <tr>
                                                    <td style="border-collapse: collapse; mso-table-lspace: 0pt; mso-table-rspace: 0pt; padding: 0 15px 5px 0;">Check-out(time)</td>
                                                    <td style="border-collapse: collapse; mso-table-lspace: 0pt; mso-table-rspace: 0pt; padding: 0 0 0 15px;" align="right">${booking.checkOutTime}</td>
                                                </tr>
                                                <tr>
                                                    <td style="border-collapse: collapse; mso-table-lspace: 0pt; mso-table-rspace: 0pt; padding: 0 15px 5px 0;">No. of days</td>
                                                    <td style="border-collapse: collapse; mso-table-lspace: 0pt; mso-table-rspace: 0pt; padding: 0 0 0 15px;" align="right">${booking.numberOfDays}</td>
                                                </tr>
                                                <tr>
                                                    <td style="border-collapse: collapse; mso-table-lspace: 0pt; mso-table-rspace: 0pt; padding: 0 15px 5px 0;">No. of Bags</td>
                                                    <td style="border-collapse: collapse; mso-table-lspace: 0pt; mso-table-rspace: 0pt; padding: 0 0 0 15px;" align="right">${booking.numberOfBags}</td>
                                                </tr>
                                                <tr>
                                                    <td style="border-collapse: collapse; mso-table-lspace: 0pt; mso-table-rspace: 0pt; padding: 0 15px 5px 0;">Price per bag</td>
                                                    <td style="border-collapse: collapse; mso-table-lspace: 0pt; mso-table-rspace: 0pt; padding: 0 0 0 15px;" align="right">${booking.netStorageCost/booking.numberOfBags}</td>
                                                </tr>
                                                <tr style="border-bottom:1px solid #ecedee;text-align:left;">
                                                    <td style="border-collapse: collapse; mso-table-lspace: 0pt; mso-table-rspace: 0pt; padding: 0 15px 5px 0;">Subtotal</td>
                                                    <td style="border-collapse: collapse; mso-table-lspace: 0pt; mso-table-rspace: 0pt; padding: 0 0 0 15px;" align="right">${booking.netStorageCost}</td>
                                                </tr>
                                                <tr>
                                                    <td style="border-collapse: collapse; mso-table-lspace: 0pt; mso-table-rspace: 0pt; padding: 0 15px 5px 0;"><strong>Total</strong></td>
                                                    <td style="border-collapse: collapse; mso-table-lspace: 0pt; mso-table-rspace: 0pt; padding: 0 0 0 15px;" align="right"><strong>${booking.netStorageCost}</strong></td>
                                                </tr>
                                            </table>

                                        </td>
                                    </tr>

                                    <tr>
                                        <td align="left" style="border-collapse: collapse; mso-table-lspace: 0pt; mso-table-rspace: 0pt; font-size: 0px; padding: 10px 25px; word-break: break-word;">

                                            <div style="font-family:'Helvetica Neue',Arial,sans-serif;font-size:12px;line-height:16px;text-align:left;color:#a2a2a2;">
                                                <p style="display: block; margin: 13px 0;">For any further assistance please contact our customer care. Details mentioned in the <a href="https://goluggagefree.com/contact.html">Contact Us</a> page.</p>
                                            </div>

                                        </td>
                                    </tr>

                                   


                                    <tr>
                                        <td align="left" style="border-collapse: collapse; mso-table-lspace: 0pt; mso-table-rspace: 0pt; font-size: 0px; padding: 10px 25px; word-break: break-word;">

                                            <div style="font-family:'Helvetica Neue',Arial,sans-serif;font-size:14px;line-height:20px;text-align:left;color:#525252;">
                                                Best regards,<br><br> Team GoLuggageFree<br>
                                                <a href="https://goluggagefree.com/" style="color:#2F67F6">www.goluggagefree.com</a>
                                            </div>

                                        </td>
                                    </tr>

                                </table>

                            </div>

                        </td>
                    </tr>
                </tbody>
            </table>

        </div>

        <div style="Margin:0px auto;max-width:600px;">

            <table align="center" border="0" cellpadding="0" cellspacing="0" role="presentation" style="border-collapse: collapse; mso-table-lspace: 0pt; mso-table-rspace: 0pt; width: 100%;" width="100%">
                <tbody>
                    <tr>
                        <td style="border-collapse: collapse; mso-table-lspace: 0pt; mso-table-rspace: 0pt; direction: ltr; font-size: 0px; padding: 20px 0; text-align: center; vertical-align: top;" align="center" valign="top">
                           
                            <div class="mj-column-per-100 outlook-group-fix" style="font-size:13px;text-align:left;direction:ltr;display:inline-block;vertical-align:bottom;width:100%;">

                                <table border="0" cellpadding="0" cellspacing="0" role="presentation" width="100%" style="border-collapse: collapse; mso-table-lspace: 0pt; mso-table-rspace: 0pt;">
                                    <tbody>
                                        <tr>
                                            <td style="border-collapse: collapse; mso-table-lspace: 0pt; mso-table-rspace: 0pt; vertical-align: bottom; padding: 0;" valign="bottom">

                                                <table border="0" cellpadding="0" cellspacing="0" role="presentation" width="100%" style="border-collapse: collapse; mso-table-lspace: 0pt; mso-table-rspace: 0pt;">

                                                    <tr>
                                                        <td align="center" style="border-collapse: collapse; mso-table-lspace: 0pt; mso-table-rspace: 0pt; font-size: 0px; padding: 0; word-break: break-word;">

                                                            <div style="font-family:'Helvetica Neue',Arial,sans-serif;font-size:12px;font-weight:300;line-height:1;text-align:center;color:#575757;">
                                                                    Atlas Food Products Pvt. Ltd. 25 New Industial Estate, Jagatpur, Cuttack-754021
                                                            </div>

                                                        </td>
                                                    </tr>

                                                    <tr>
                                                        <td align="center" style="border-collapse: collapse; mso-table-lspace: 0pt; mso-table-rspace: 0pt; font-size: 0px; padding: 10; word-break: break-word;">

                                                            <div style="font-family:'Helvetica Neue',Arial,sans-serif;font-size:12px;font-weight:300;line-height:1;text-align:center;color:#575757;">
                                                                <a href="" style="color:#575757">Unsubscribe</a> from our emails
                                                            </div>

                                                        </td>
                                                    </tr>

                                                </table>

                                            </td>
                                        </tr>
                                    </tbody>
                                </table>

                            </div>

                        </td>
                    </tr>
                </tbody>
            </table>

        </div>

    </div>

</body>

</html>
    `
}

const bookingConfirmationEmailStore = (storageSpace, booking, user) => {
    return `
    <!doctype html>
<html xmlns="http://www.w3.org/1999/xhtml" xmlns:v="urn:schemas-microsoft-com:vml" xmlns:o="urn:schemas-microsoft-com:office:office">

<head>
    <title>

    </title>

    <meta http-equiv="X-UA-Compatible" content="IE=edge">
   
    <meta http-equiv="Content-Type" content="text/html; charset=UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1">
    

    <style type="text/css">
@media only screen and (max-width:480px) {
  @-ms-viewport {
    width: 320px;
  }

  @viewport {
    width: 320px;
  }
}
</style>

    <style type="text/css">
@media only screen and (min-width:480px) {
  .mj-column-per-100 {
    width: 100% !important;
  }
}
</style>


    

</head>

<body style="margin: 0; padding: 0; -webkit-text-size-adjust: 100%; -ms-text-size-adjust: 100%; background-color: #f9f9f9;">


    <div style="background-color:#f9f9f9;">


        <div style="background:#f9f9f9;background-color:#f9f9f9;Margin:0px auto;max-width:600px;">

            <table align="center" border="0" cellpadding="0" cellspacing="0" role="presentation" style="border-collapse: collapse; mso-table-lspace: 0pt; mso-table-rspace: 0pt; background: #f9f9f9; background-color: #f9f9f9; width: 100%;" width="100%" bgcolor="#f9f9f9">
                <tbody>
                    <tr>
                        <td style="border-collapse: collapse; mso-table-lspace: 0pt; mso-table-rspace: 0pt; border-bottom: #333957 solid 5px; direction: ltr; font-size: 0px; padding: 20px 0; text-align: center; vertical-align: top;" align="center" valign="top">
                   
                        </td>
                    </tr>
                </tbody>
            </table>

        </div>


        <div style="background:#fff;background-color:#fff;Margin:0px auto;max-width:600px;">

            <table align="center" border="0" cellpadding="0" cellspacing="0" role="presentation" style="border-collapse: collapse; mso-table-lspace: 0pt; mso-table-rspace: 0pt; background: #fff; background-color: #fff; width: 100%;" width="100%" bgcolor="#fff">
                <tbody>
                    <tr>
                        <td style="border-collapse: collapse; mso-table-lspace: 0pt; mso-table-rspace: 0pt; border: #dddddd solid 1px; border-top: 0px; direction: ltr; font-size: 0px; padding: 20px 0; text-align: center; vertical-align: top;" align="center" valign="top">
                           
                            <div class="mj-column-per-100 outlook-group-fix" style="font-size:13px;text-align:left;direction:ltr;display:inline-block;vertical-align:bottom;width:100%;">

                                <table border="0" cellpadding="0" cellspacing="0" role="presentation" style="border-collapse: collapse; mso-table-lspace: 0pt; mso-table-rspace: 0pt; vertical-align: bottom;" width="100%" valign="bottom">

                                    <tr>
                                        <td align="center" style="border-collapse: collapse; mso-table-lspace: 0pt; mso-table-rspace: 0pt; font-size: 0px; padding: 10px 25px; word-break: break-word;">

                                            <table align="center" border="0" cellpadding="0" cellspacing="0" role="presentation" style="mso-table-lspace: 0pt; mso-table-rspace: 0pt; border-collapse: collapse; border-spacing: 0px;">
                                                <tbody>
                                                    <tr>
                                                        <td style="border-collapse: collapse; mso-table-lspace: 0pt; mso-table-rspace: 0pt; width: 64px;" width="64">

                                                            <img  src="https://goluggagefree.com/static/media/hero-img-blue.d5bcd689.png" style="height: 80px; line-height: 100%; -ms-interpolation-mode: bicubic; border: 0; display: block; outline: none; text-decoration: none; width=auto;" >

                                                        </td>
                                                    </tr>
                                                </tbody>
                                            </table>

                                        </td>
                                    </tr>

                                    <tr>
                                        <td align="center" style="border-collapse: collapse; mso-table-lspace: 0pt; mso-table-rspace: 0pt; font-size: 0px; padding: 10px 25px; word-break: break-word;">

                                            <div style="font-family:'Helvetica Neue',Arial,sans-serif;font-size:24px;font-weight:bold;line-height:22px;text-align:center;color:#333;">
                                                Booking Confirmed
                                            </div>

                                        </td>
                                    </tr>

                                    <tr>
                                        <td align="left" style="border-collapse: collapse; mso-table-lspace: 0pt; mso-table-rspace: 0pt; font-size: 0px; padding: 10px 25px; word-break: break-word;">

                                            <div style="font-family:'Helvetica Neue',Arial,sans-serif;font-size:14px;line-height:22px;text-align:left;color:#525252;">
                                                <p style="display: block; margin: 13px 0;">Hi ${storageSpace.ownerName},</p>

                                                <p style="display: block; margin: 13px 0;">Please follow the below instructions while completing the booking</p>
                                                <ol type="1">
                                                    <li>Please check the booking ID and the govt. approved ID of the customer as mentioned in the ticket</li>
                                                    <li>You must take a picture of the unique code printed on the security seal for extra safety</li>
                                                    <li>Please frisk the bag for illegal or prohibited items like <strong>drugs, alchohol, explosives, cash, jewellery,etc</strong>. GoLuggageFree will not be liable for such items as mentioned in the <a href="https://goluggagefree.com/terms.html">Terms and Conditions</a> before accepting it</li>
                                                    
                                                </ol>
                                            </div>

                                        </td>
                                    </tr>
                                                                      
                                    <tr>
                                        <td align="left" style="border-collapse: collapse; mso-table-lspace: 0pt; mso-table-rspace: 0pt; font-size: 0px; padding: 10px 25px; word-break: break-word;">
                                        
                                            <table 0="[object Object]" 1="[object Object]"  border="0" style="border-collapse: collapse; mso-table-lspace: 10pt; mso-table-rspace: 10pt; cellspacing: 0; color: #000; font-family: 'Helvetica Neue',Arial,sans-serif; font-size: 13px; line-height: 22px; table-layout: auto; width: 100%;" width="100%">                                                
                                                <tr style="border-bottom:1px solid #ecedee;text-align:left;">
                                                    <td style="border-collapse: collapse; mso-table-lspace: 0pt; mso-table-rspace: 0pt; padding: 0 15px 5px 0;">Booking ID</td>
                                                    <td style="border-collapse: collapse; mso-table-lspace: 0pt; mso-table-rspace: 0pt; padding: 0 0 0 15px;" align="right">${booking.bookingId}</td>
                                                </tr>
                                                <tr>
                                                    <td style="border-collapse: collapse; mso-table-lspace: 0pt; mso-table-rspace: 0pt; padding: 0 15px 5px 0;">Name</td>
                                                    <td style="border-collapse: collapse; mso-table-lspace: 0pt; mso-table-rspace: 0pt; padding: 0 0 0 15px;" align="right">${user.name}</td>
                                                </tr>
                                                <tr>
                                                    <td style="border-collapse: collapse; mso-table-lspace: 0pt; mso-table-rspace: 0pt; padding: 0 15px 5px 0;">Govt. ID</td>
                                                    <td style="border-collapse: collapse; mso-table-lspace: 0pt; mso-table-rspace: 0pt; padding: 0 0 0 15px;" align="right">${booking.userGovtId}</td>
                                                </tr>
                                                <tr>
                                                    <td style="border-collapse: collapse; mso-table-lspace: 0pt; mso-table-rspace: 0pt; padding: 0 15px 5px 0;">Check-in(time)</td>
                                                    <td style="border-collapse: collapse; mso-table-lspace: 0pt; mso-table-rspace: 0pt; padding: 0 0 0 15px;" align="right">${booking.checkInTime}</td>
                                                </tr>
                                                <tr>
                                                    <td style="border-collapse: collapse; mso-table-lspace: 0pt; mso-table-rspace: 0pt; padding: 0 15px 5px 0;">Check-out(time)</td>
                                                    <td style="border-collapse: collapse; mso-table-lspace: 0pt; mso-table-rspace: 0pt; padding: 0 0 0 15px;" align="right">${booking.checkOutTime}</td>
                                                </tr>
                                                <tr>
                                                    <td style="border-collapse: collapse; mso-table-lspace: 0pt; mso-table-rspace: 0pt; padding: 0 15px 5px 0;">No. of days</td>
                                                    <td style="border-collapse: collapse; mso-table-lspace: 0pt; mso-table-rspace: 0pt; padding: 0 0 0 15px;" align="right">${booking.numberOfDays}</td>
                                                </tr>
                                                <tr>
                                                    <td style="border-collapse: collapse; mso-table-lspace: 0pt; mso-table-rspace: 0pt; padding: 0 15px 5px 0;">No. of Bags</td>
                                                    <td style="border-collapse: collapse; mso-table-lspace: 0pt; mso-table-rspace: 0pt; padding: 0 0 0 15px;" align="right">${booking.numberOfBags}</td>
                                                </tr>
                                                <tr>
                                                    <td style="border-collapse: collapse; mso-table-lspace: 0pt; mso-table-rspace: 0pt; padding: 0 15px 5px 0;">Price per bag</td>
                                                    <td style="border-collapse: collapse; mso-table-lspace: 0pt; mso-table-rspace: 0pt; padding: 0 0 0 15px;" align="right">${booking.netStorageCost/booking.numberOfDays}</td>
                                                </tr>
                                                <tr style="border-bottom:1px solid #ecedee;text-align:left;">
                                                    <td style="border-collapse: collapse; mso-table-lspace: 0pt; mso-table-rspace: 0pt; padding: 0 15px 5px 0;">Subtotal</td>
                                                    <td style="border-collapse: collapse; mso-table-lspace: 0pt; mso-table-rspace: 0pt; padding: 0 0 0 15px;" align="right">${booking.netStorageCost}</td>
                                                </tr>
                                                <tr>
                                                    <td style="border-collapse: collapse; mso-table-lspace: 0pt; mso-table-rspace: 0pt; padding: 0 15px 5px 0;"><strong>Total</strong></td>
                                                    <td style="border-collapse: collapse; mso-table-lspace: 0pt; mso-table-rspace: 0pt; padding: 0 0 0 15px;" align="right"><strong>${booking.netStorageCost}</strong></td>
                                                </tr>
                                            </table>

                                        </td>
                                    </tr>

                                    <tr>
                                        <td align="left" style="border-collapse: collapse; mso-table-lspace: 0pt; mso-table-rspace: 0pt; font-size: 0px; padding: 10px 25px; word-break: break-word;">

                                            <div style="font-family:'Helvetica Neue',Arial,sans-serif;font-size:12px;line-height:16px;text-align:left;color:#a2a2a2;">
                                                <p style="display: block; margin: 13px 0;">For any further assistance please contact our customer care. Details mentioned in the <a href="https://goluggagefree.com/contact.html">Contact Us</a> page.</p>
                                            </div>

                                        </td>
                                    </tr>

                                   


                                    <tr>
                                        <td align="left" style="border-collapse: collapse; mso-table-lspace: 0pt; mso-table-rspace: 0pt; font-size: 0px; padding: 10px 25px; word-break: break-word;">

                                            <div style="font-family:'Helvetica Neue',Arial,sans-serif;font-size:14px;line-height:20px;text-align:left;color:#525252;">
                                                Best regards,<br><br> Team GoLuggageFree<br>
                                                <a href="https://goluggagefree.com/" style="color:#2F67F6">www.goluggagefree.com</a>
                                            </div>

                                        </td>
                                    </tr>

                                </table>

                            </div>

                        </td>
                    </tr>
                </tbody>
            </table>

        </div>

        <div style="Margin:0px auto;max-width:600px;">

            <table align="center" border="0" cellpadding="0" cellspacing="0" role="presentation" style="border-collapse: collapse; mso-table-lspace: 0pt; mso-table-rspace: 0pt; width: 100%;" width="100%">
                <tbody>
                    <tr>
                        <td style="border-collapse: collapse; mso-table-lspace: 0pt; mso-table-rspace: 0pt; direction: ltr; font-size: 0px; padding: 20px 0; text-align: center; vertical-align: top;" align="center" valign="top">
                           
                            <div class="mj-column-per-100 outlook-group-fix" style="font-size:13px;text-align:left;direction:ltr;display:inline-block;vertical-align:bottom;width:100%;">

                                <table border="0" cellpadding="0" cellspacing="0" role="presentation" width="100%" style="border-collapse: collapse; mso-table-lspace: 0pt; mso-table-rspace: 0pt;">
                                    <tbody>
                                        <tr>
                                            <td style="border-collapse: collapse; mso-table-lspace: 0pt; mso-table-rspace: 0pt; vertical-align: bottom; padding: 0;" valign="bottom">

                                                <table border="0" cellpadding="0" cellspacing="0" role="presentation" width="100%" style="border-collapse: collapse; mso-table-lspace: 0pt; mso-table-rspace: 0pt;">

                                                    <tr>
                                                        <td align="center" style="border-collapse: collapse; mso-table-lspace: 0pt; mso-table-rspace: 0pt; font-size: 0px; padding: 0; word-break: break-word;">

                                                            <div style="font-family:'Helvetica Neue',Arial,sans-serif;font-size:12px;font-weight:300;line-height:1;text-align:center;color:#575757;">
                                                                    Atlas Food Products Pvt. Ltd. 25 New Industial Estate, Jagatpur, Cuttack-754021
                                                            </div>

                                                        </td>
                                                    </tr>

                                                    

                                                </table>

                                            </td>
                                        </tr>
                                    </tbody>
                                </table>

                            </div>

                        </td>
                    </tr>
                </tbody>
            </table>

        </div>

    </div>

</body>

</html>
    `
}


const welcomeEmailBody = (name) => {
    return `<!doctype html>
    <html xmlns="http://www.w3.org/1999/xhtml" xmlns:v="urn:schemas-microsoft-com:vml" xmlns:o="urn:schemas-microsoft-com:office:office">
    
    <head>
        <title>
    
        </title>
      
        <meta http-equiv="X-UA-Compatible" content="IE=edge">
       
        <meta http-equiv="Content-Type" content="text/html; charset=UTF-8">
        <meta name="viewport" content="width=device-width, initial-scale=1">
        
        <style type="text/css">
    @media only screen and (max-width:480px) {
      @-ms-viewport {
        width: 320px;
      }
    
      @viewport {
        width: 320px;
      }
    }
    </style>
      
    
        <style type="text/css">
    @media only screen and (min-width:480px) {
      .mj-column-per-100 {
        width: 100% !important;
      }
    }
    </style>
    
    
        
    
    </head>
    
    <body style="margin: 0; padding: 0; -webkit-text-size-adjust: 100%; -ms-text-size-adjust: 100%; background-color: #f9f9f9;">
    
    
        <div style="background-color:#f9f9f9;">
    
    
    
            <div style="background:#f9f9f9;background-color:#f9f9f9;Margin:0px auto;max-width:600px;">
    
                <table align="center" border="0" cellpadding="0" cellspacing="0" role="presentation" style="border-collapse: collapse; mso-table-lspace: 0pt; mso-table-rspace: 0pt; background: #f9f9f9; background-color: #f9f9f9; width: 100%;" width="100%" bgcolor="#f9f9f9">
                    <tbody>
                        <tr>
                            <td style="border-collapse: collapse; mso-table-lspace: 0pt; mso-table-rspace: 0pt; border-bottom: #07132B solid 5px; direction: ltr; font-size: 0px; padding: 20px 0; text-align: center; vertical-align: top;" align="center" valign="top">
                               
                            </td>
                        </tr>
                    </tbody>
                </table>
    
            </div>
    
    
    
            <div style="background:#fff;background-color:#fff;Margin:0px auto;max-width:600px;">
    
                <table align="center" border="0" cellpadding="0" cellspacing="0" role="presentation" style="border-collapse: collapse; mso-table-lspace: 0pt; mso-table-rspace: 0pt; background: #fff; background-color: #fff; width: 100%;" width="100%" bgcolor="#fff">
                    <tbody>
                        <tr>
                            <td style="border-collapse: collapse; mso-table-lspace: 0pt; mso-table-rspace: 0pt; border: #dddddd solid 1px; border-top: 0px; direction: ltr; font-size: 0px; padding: 20px 0; text-align: center; vertical-align: top;" align="center" valign="top">
                                
    
                                <div class="mj-column-per-100 outlook-group-fix" style="font-size:13px;text-align:left;direction:ltr;display:inline-block;vertical-align:bottom;width:100%;">
    
                                    <table border="0" cellpadding="0" cellspacing="0" role="presentation" style="border-collapse: collapse; mso-table-lspace: 0pt; mso-table-rspace: 0pt; vertical-align: bottom;" width="100%" valign="bottom">
    
                                        <tr>
                                            <td align="center" style="border-collapse: collapse; mso-table-lspace: 0pt; mso-table-rspace: 0pt; font-size: 0px; padding: 10px 25px; word-break: break-word;">
    
                                                <table align="center" border="0" cellpadding="0" cellspacing="0" role="presentation" style="mso-table-lspace: 0pt; mso-table-rspace: 0pt; border-collapse: collapse; border-spacing: 0px;">
                                                    <tbody>
                                                        <tr>
                                                            <td style="border-collapse: collapse; mso-table-lspace: 0pt; mso-table-rspace: 0pt; width: 64px;" width="64">
    
                                                                <img src="https://goluggagefree.com/static/media/hero-img-blue.d5bcd689.png" style="height: 80px; line-height: 100%; -ms-interpolation-mode: bicubic; border: 0; display: block; outline: none; text-decoration: none; width=auto;" >
    
                                                            </td>
                                                        </tr>
                                                    </tbody>
                                                </table>
    
                                            </td>
                                        </tr>
    
                                        <tr>
                                            <td align="center" style="border-collapse: collapse; mso-table-lspace: 0pt; mso-table-rspace: 0pt; font-size: 0px; padding: 10px 25px; padding-bottom: 40px; word-break: break-word;">
    
                                                <div style="font-family:'Helvetica Neue',Arial,sans-serif;font-size:28px;font-weight:bold;line-height:1;text-align:center;color:#555;">
                                                    Welcome to GoLuggageFree
                                                </div>
    
                                            </td>
                                        </tr>
    
                                        <tr>
                                            <td align="left" style="border-collapse: collapse; mso-table-lspace: 0pt; mso-table-rspace: 0pt; font-size: 0px; padding: 10px 25px; word-break: break-word;">
    
                                                <div style="font-family:'Helvetica Neue',Arial,sans-serif;font-size:16px;line-height:22px;text-align:left;color:#555;">
                                                    Hello ${name}!<br><br>
                                                    Thank you for signing up for GoLuggageFree. We're really happy to have you! Now you can book a cloak room near you and travel the city luggage free!<br><br>
                                                </div>
    
                                            </td>
                                        </tr>
    
                                        
    
                                        <tr>
                                            <td align="left" style="border-collapse: collapse; mso-table-lspace: 0pt; mso-table-rspace: 0pt; font-size: 0px; padding: 10px 25px; word-break: break-word;">
    
                                                <div style="font-family:'Helvetica Neue',Arial,sans-serif;font-size:14px;line-height:20px;text-align:left;color:#525252;">
                                                    Best regards,<br><br> Team GoLuggageFree<br>
                                                    <a href="https://www.goluggagefree.com" style="color:#2F67F6">www.goluggagefree.com</a>
                                                </div>
    
                                            </td>
                                        </tr>
    
                                    </table>
    
                                </div>
    
                            </td>
                        </tr>
                    </tbody>
                </table>
    
            </div>
    
    
            <div style="Margin:0px auto;max-width:600px;">
    
                <table align="center" border="0" cellpadding="0" cellspacing="0" role="presentation" style="border-collapse: collapse; mso-table-lspace: 0pt; mso-table-rspace: 0pt; width: 100%;" width="100%">
                    <tbody>
                        <tr>
                            <td style="border-collapse: collapse; mso-table-lspace: 0pt; mso-table-rspace: 0pt; direction: ltr; font-size: 0px; padding: 20px 0; text-align: center; vertical-align: top;" align="center" valign="top">
                                
    
                                <div class="mj-column-per-100 outlook-group-fix" style="font-size:13px;text-align:left;direction:ltr;display:inline-block;vertical-align:bottom;width:100%;">
    
                                    <table border="0" cellpadding="0" cellspacing="0" role="presentation" width="100%" style="border-collapse: collapse; mso-table-lspace: 0pt; mso-table-rspace: 0pt;">
                                        <tbody>
                                            <tr>
                                                <td style="border-collapse: collapse; mso-table-lspace: 0pt; mso-table-rspace: 0pt; vertical-align: bottom; padding: 0;" valign="bottom">
    
                                                    <table border="0" cellpadding="0" cellspacing="0" role="presentation" width="100%" style="border-collapse: collapse; mso-table-lspace: 0pt; mso-table-rspace: 0pt;">
    
                                                        <tr>
                                                            <td align="center" style="border-collapse: collapse; mso-table-lspace: 0pt; mso-table-rspace: 0pt; font-size: 0px; padding: 0; word-break: break-word;">
    
                                                                <div style="font-family:'Helvetica Neue',Arial,sans-serif;font-size:12px;font-weight:300;line-height:1;text-align:center;color:#575757;">
                                                                    Atlas Food Products Pvt. Ltd. 25 New Industial Estate, Jagatpur, Cuttack-754021
                                                                </div>
    
                                                            </td>
                                                        </tr>
    
                                                        <tr>
                                                            <td align="center" style="border-collapse: collapse; mso-table-lspace: 0pt; mso-table-rspace: 0pt; font-size: 0px; padding: 10px; word-break: break-word;">
    
                                                                <div style="font-family:'Helvetica Neue',Arial,sans-serif;font-size:12px;font-weight:300;line-height:1;text-align:center;color:#575757;">
                                                                    <a href="" style="color:#575757">Unsubscribe</a> from our emails
                                                                </div>
    
                                                            </td>
                                                        </tr>
    
                                                    </table>
    
                                                </td>
                                            </tr>
                                        </tbody>
                                    </table>
    
                             
                            </div></td>
                        </tr>
                    </tbody>
                </table>
    
            </div>
        </div>
    
    </body>
    
    </html>`
}

module.exports = {
    bookingConfirmationEmailUser,
    bookingConfirmationEmailStore,
    welcomeEmailBody
}