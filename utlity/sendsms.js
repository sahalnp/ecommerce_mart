import twilio from "twilio"
import dotenv from "dotenv"
dotenv.config()

const client = new twilio(process.env.TWILIO_ACC_SID, process.env.TWILIO_AUTH_TOKEN);

  export const sendsms=async(req,res)=>{
    const number=req.body.number;
    const msgoption={
        from:process.env.TWILIO_NUMBER,
        to:number,
        body:"hello from me"
    }
    try {
        const sms=await client.messages.create(msgoption);
        console.log("The mesage is ",message)

    } catch (error) {
        console.log("the error is ",error);
         
    }
}