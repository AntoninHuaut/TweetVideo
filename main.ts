import launchWeb from "./server/web.ts"
import launchDiscord from "./discord/launchDiscord.ts"

launchDiscord()
await launchWeb()