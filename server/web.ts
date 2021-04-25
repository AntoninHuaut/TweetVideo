import {config, Oak, ViewEngine} from '../dps.ts'
import {getTweetData} from './TwitterAPI.ts'
import TweetData from "../entity/TweetData.ts"

export default async function launchWeb() {
    const app = new Oak.Application()
    const router = new Oak.Router()

    const handlebarsEngine = ViewEngine.engineFactory.getHandlebarsEngine()
    const oakAdapter = ViewEngine.adapterFactory.getOakAdapter()
    app.use(ViewEngine.viewEngine(oakAdapter, handlebarsEngine, {
        viewRoot: "./view",
        viewExt: ".hbs",
    }))

    router.get('/:tweetId', async (ctx) => {
        const tweetId: (string | undefined) = ctx.params.tweetId
        console.log(tweetId)
        if (!tweetId) {
            ctx.response.body = {error: "Invalid parameter: tweetId"}
            return
        }

        const tweetData: (TweetData | null) = await getTweetData(tweetId)
        if (!tweetData || tweetData.mediasData.length === 0) {
            ctx.response.body = {error: `The fetching of the tweetId ${tweetId} has failed`}
            return
        }

        const media = tweetData.mediasData[0]

        // @ts-ignore
        ctx.render("index", {
            mp4_url: media.mp4_url,
            preview_media_url: media.preview_media_url,
            height: media.height,
            width: media.width
        })
    })

    app.use(router.routes())

    console.log(`🌳 Oak server running at http://localhost:${config.web.port}/ 🌳`)
    await app.listen({port: config.web.port})
}