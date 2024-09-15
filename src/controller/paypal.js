// return  PAYPAL_CLIENT_ID to frontend
// it will be used for the payment using paypal
exports.fetchKey=(req,res)=>{
    res.send(process.env.PAYPAL_CLIENT_ID || 'sb');
}