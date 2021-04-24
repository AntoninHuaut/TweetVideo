import {config, Discord} from './dps.ts'
import {getTweetData} from './api/TwitterAPI.ts'
import TweetData from './entity/TweetData.ts'

Discord.startBot({
    token: config.discord.token,
    intents: ["GUILDS", "GUILD_MESSAGES"],
    eventHandlers: {
        ready() {
            console.log("Successfully connected to gateway")
        },
        async messageCreate(message: any) {
            const tweetsRaw: string[] = getTweets(message)
            const tweets = await convertTweets(tweetsRaw)
            if (!tweets || tweets.length === 0) return

            message.reply(buildMessage(message, tweets))
        },
    },
})

function buildMessage(messages: any, tweets: (TweetData | null)[]): string {
    let res: string = ""

    tweets.forEach(tweet => {
        if (!tweet) return

        // let fullText: string = tweet.full_text
        let subRes: string = ''

        tweet.mediasData.forEach(media => {
            if (!media) return

            // fullText = fullText.replace(media.twitter_url, '')
            subRes += `${media.mp4_url}\n`
        })

        // subRes = fullText + '\n' + subRes

        res += subRes //+ '\n'
    })

    return res
}

async function convertTweets(tweets: string[]): Promise<(TweetData | null)[]> {
    return Promise.all(tweets.map(tweet => getTweetData(tweet)))
}

function getTweets(messages: any): string[] {
    const idList: string[] = []
    for (const embed of messages.embeds) {
        const id = isTweet(embed.url)
        if (id) {
            idList.push(id)
        }
    }

    return idList
}

function isTweet(str: string) {
    const regex = /^https?:\/\/twitter\.com\/(?:#!\/)?(\w+)\/status(es)?\/(\d+)/
    let res

    if ((res = regex.exec(str)) !== null) {
        if (res.length !== 4) return false

        return res[3]
    }
}