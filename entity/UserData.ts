export default class UserData {

    readonly id: string
    readonly name: string
    readonly screen_name: string

    constructor(json: any) {
        this.id = json.id
        this.name = json.name
        this.screen_name = json.screen_name
    }
}