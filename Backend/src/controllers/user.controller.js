exports.authMe = async(req,res)=>{
    try{
       res.status(200).json({user:req.user});
    }catch(err){
        res.status(500).json({message:err.message || 'Server error' });
    }
} 