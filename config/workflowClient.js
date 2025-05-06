import {Client as WorkflowClient} from '@upstash/workflow'
import dotenv from 'dotenv'

dotenv.config();

export const workflowclient=new WorkflowClient({
    baseUrl:process.env.QSTASH_URL,
    token:process.env.QSTASH_TOKEN,
})