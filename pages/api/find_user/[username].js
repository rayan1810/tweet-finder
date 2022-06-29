// Next.js API route support: https://nextjs.org/docs/api-routes/introduction
import { Client } from "twitter-api-sdk";

const client = new Client(process.env.TWITTER_TOKEN);

export default async function handler(req, res) {
  try {
    const data = await client.users.findUserByUsername(req.query.username);
    res.status(200).json(data);
  } catch (error) {
    console.error(error);
    return res.status(error.status || 500).end(error.message);
  }
}
