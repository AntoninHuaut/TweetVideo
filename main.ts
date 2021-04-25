import launchWeb from "./server/web.ts"
import launchDiscord from "./discord/discord.ts"

await launchWeb()
launchDiscord()