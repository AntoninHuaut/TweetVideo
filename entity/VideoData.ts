export default class VideoData {

    readonly id: string
    readonly preview_media_url: string
    readonly twitter_url: string
    readonly mp4_url: string

    constructor(json: any) {
        if (json.type !== "video") throw new Error("Invalid type")

        this.id = json.id
        this.preview_media_url = json.media_url_https
        this.twitter_url = json.url

        this.mp4_url = json.video_info.variants.reduce((a: any, b: any) => {
            if (!a.bitrate) return b
            if (!b.bitrate) return a
            return a.bitrate > b.bitrate ? a : b
        }).url
    }
}