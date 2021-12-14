import { micromark } from 'micromark'
import { loadContent } from '../lib/loadContent'


class LevelIntro {

    title: string
    filename: string

    constructor(title: string, filename: string) {
        this.title = title
        this.filename = filename
    }

    async loadContent() {
        const content = await loadContent(`/content/${this.filename}.md`);
        if (!content) {return this.makeFallbackMarkUp()}
        return micromark(content);
    }

    makeFallbackMarkUp() {
        return `<h3>${this.title}</h3><p><b>ERROR:</b> misson briefing not found!</p>`
    }
}

export { LevelIntro }