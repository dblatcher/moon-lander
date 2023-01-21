import { micromark } from 'micromark'
import { loadContent } from '../lib/loadContent'
import type { FunctionComponent } from 'react'

class LevelIntro {

    title: string
    filename?: string
    ContentComponent?: FunctionComponent

    constructor(title: string, filename?: string, ContentComponent?: FunctionComponent) {
        this.title = title
        this.filename = filename
        this.ContentComponent = ContentComponent
    }

    async loadContent() {
        if (!this.filename) {
            return this.makeFallbackMarkUp()
        }
        const content = await loadContent(`/content/${this.filename}.md`);
        if (!content) { return this.makeFallbackMarkUp() }
        return micromark(content);
    }

    makeFallbackMarkUp() {
        return `<h3>${this.title}</h3><p><b>ERROR:</b> misson briefing not found!</p>`
    }
}

export { LevelIntro }