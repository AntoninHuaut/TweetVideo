import {config, Discord} from '../dps.ts'

async function isValidURL(url: string): Promise<boolean> {
    try {
        const res = await (fetch(url).then(res => res.text()))
        try {
            JSON.parse(res)
        } catch(ex) {
            return true
        }
    } catch (ex) {}

    return false
}

async function buildMessage(messages: any, tweets: string[]): Promise<string> {
    let res: string = ""

    for (const tweetId of tweets) {
        if (!tweetId) continue

        const url = config.web.url + tweetId
        const isValid = await isValidURL(url)
        if (isValid) {
            res += url + '\n'
        }
    }

    return res
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

export default function launchDiscord() {
    Discord.startBot({
        token: config.discord.token,
        intents: ["Guilds", "GuildMessages"],
        eventHandlers: {
            ready() {
                console.log("[Discord] Successfully connected to gateway")
            },
            async messageCreate(message: any) {
                const tweets: string[] = getTweets(message)
                if (!tweets || tweets.length === 0) return

                const resMsg: string = await buildMessage(message, tweets)
                if (!resMsg) return

                message.reply(resMsg)
            },
        },
    })
}