import UserData from "./UserData.ts";
import VideoData from "./VideoData.ts";

export default class TweetData {

    readonly created_at: string
    readonly full_text: string

    readonly userData: UserData
    readonly mediasData: VideoData[] = []

    constructor(json: any) {
        this.created_at = json.created_at
        this.full_text = json.full_text

        this.userData = new UserData(json.user)
        for (let media of json.extended_entities.media) {
            try {
                this.mediasData.push(new VideoData(media))
            } catch(err) {
                if (err === "Invalid type") return
                console.error(err)
            }
        }
    }
}