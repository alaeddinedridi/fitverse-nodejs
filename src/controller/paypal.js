// return  PAYPAL_CLIENT_ID
exports.fetchKey=(req,res)=>{
    res.send(process.env.PAYPAL_CLIENT_ID || 'sb');
}