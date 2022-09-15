/**
 * Anime class
 */
export class Anime {
    constructor(id, name, img_url, trailer_url, synopsis, episodes, note, detail_url) {
        this.id = id
        this.name = name
        this.img_url = img_url
        this.trailer_url = trailer_url
        this.synopsis = synopsis
        this.episodes = episodes
        this.note = note
        this.detail_url = detail_url
    }
}