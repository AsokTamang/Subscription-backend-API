import { createRequire } from "module"; //here we are importing createRequire from 'module' lib
const require = createRequire(import.meta.url); //    we are using createRequire to import the current url for extracting serve from upstash/workflow/express.
const { serve } = require("@upstash/workflow/express");
import Subscription from "../models/subscription.model.js";
import dayjs from "dayjs";
import { sendEmailReminder } from "../utils/send-email.js";


export const sendReminders = serve(async (context) => {
  //here context is the serverless env provided by upsatsh
  const remainingDays = [10, 7, 5, 3, 2, 1]; //we are setting a dummy collection of remaining days for calculation.
  const { subscriptionId } = await context.requestPayload; //we are extracting the subscriptionId provided through the request payload of workflow triggering method.
  const subscription = await context.run("get subscription", async () => {
    //here we are fetching the data based on the id using the subscription model and its running on the serverless env context.run which is possible by upstash.
   return  await Subscription.findById(subscriptionId).populate("user", "name email");
  });

  if (!subscription || subscription.status !== "active") return; //we terminate the workflow immediately if the id doesnot matches with actual subscriber and if the status is inactive cause the workflow function is created to send reminders of renewal date to the active user.

  const renewalDate = dayjs(subscription.renewalDate); //here we are using dayjs lightweight lib for performing manipulation,calculation and comparisons between the date objects.
  if (renewalDate.isBefore(dayjs())) {
    console.log(
      `Renewal date ${renewalDate} has already been passed or is in the past.So,terminating...`
    ); //here we are checking if the renewal date is in the past then we are terminating the workflow by returning the function.
   return;
  }
  for (const remainingDay of remainingDays) {
    const reminderDate = renewalDate.subtract(remainingDay, "day"); //here we are subtracting the renewal date with the remaining day using day as an unit to get the reminder date.
    if (reminderDate.isAfter(dayjs())) {
      //here we are checking if the reminderDate is in the future then we must use sleepuntil and trigger function
      await sleepUntil(
        context,
        `${remainingDay} remaining days from ${renewalDate}}`,
        reminderDate
      );
      await trigger(context, `${remainingDay}`);
    }
  }
});

const sleepUntil = async (context, label, date) => {
  //this is a sleepUntil function.
  console.log(label);
  await context.sleepUntil(label, date.toDate()); //here context.sleepUntil is a function provided by an upstash which terminates the workflow temporarily unitl this date.toDate
};

const trigger=async(context,label)=>{
  return await context.run(label,async()=>{
    const {subscriptionId}=context.requestPayload;
    const subscription=await Subscription.findById(subscriptionId).populate('user','name email')
    if(!subscription){console.log('No subscription found,'); return}  
    const htmlContent=`
      <div style="font-family:Arial,sans-serif;padding:20px;">
        <p>👋 Hello <strong>${subscription.user.name}</strong>,</p>
        <p>This is a reminder to renew your subscription. Your renewal date is <strong>${dayjs(subscription.renewalDate).format("MMMM D, YYYY")}</strong>, which is <strong>${label}</strong> days from now.</p>
        <p>🔁 Please renew before this date to avoid any interruptions.</p>
        <br/>
        <p>Thanks,<br/>Subscription tracker team</p>
      </div>
    `;
    await sendEmailReminder(subscription.user.email,'Email Reminder to renew the subscription',htmlContent);
  })
}
