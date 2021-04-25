import launchWeb from "./server/web.ts"
import launchDiscord from "./discord/discord.ts"

launchDiscord()
await launchWeb()