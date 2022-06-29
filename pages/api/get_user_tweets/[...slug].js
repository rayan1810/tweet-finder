// Next.js API route support: https://nextjs.org/docs/api-routes/introduction
import { Client } from "twitter-api-sdk";

const client = new Client(process.env.TWITTER_TOKEN);
let tweets = [];
async function tweetFetcher(id, next) {
  let data;
  if (next) {
    data = await client.tweets.usersIdTweets(id, {
      max_results: 100,
      pagination_token: next,
    });
  } else {
    data = await client.tweets.usersIdTweets(id, { max_results: 100 });
  }
  return data;
}

export default async function handler(req, res) {
  try {
    const twww = req.query.slug[1]
      ? await tweetFetcher(req.query.slug[0], req.query.slug[1])
      : await tweetFetcher(req.query.slug[0]);
    res.status(200).json(twww);
  } catch (error) {
    console.error(error);
    return res.status(error.status || 500).end(error.message);
  }
}
