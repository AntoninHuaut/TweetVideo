import {config, Discord} from '../dps.ts'

export default function launchDiscord() {
    Discord.startBot({
        token: config.discord.token,
        intents: ["GUILDS", "GUILD_MESSAGES"],
        eventHandlers: {
            ready() {
                console.log("Successfully connected to gateway")
            },
            async messageCreate(message: any) {
                const tweets: string[] = getTweets(message)
                if (!tweets || tweets.length === 0) return

                message.reply(buildMessage(message, tweets))
            },
        },
    })

    function buildMessage(messages: any, tweets: string[]): string {
        let res: string = ""

        tweets.forEach(tweetId => {
            if (!tweetId) return

            res += config.web.url + tweetId + '\n'
        })

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
}