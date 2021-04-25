import {config} from '../dps.ts'
import TweetData from '../entity/TweetData.ts'

export async function getTweetData(tweetId: string): Promise<TweetData | null> {
    const headers = new Headers();
    headers.append("Authorization", config.twitter.bearerToken);

    try {
        const json = await (fetch(`https://api.twitter.com/1.1/statuses/show.json?id=${tweetId}&tweet_mode=extended`, {
            method: 'GET',
            headers: headers
        }).then(response => response.json()))

        if (!json) throw new Error(`TwitterAPI response is null or undefined for tweetId: ${tweetId}`)

        return new TweetData(json)
    } catch (err) {
        // Ignore
        return null
    }
}