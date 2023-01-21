import React, { ReactNode } from "react";
import { LevelIntro } from "../modules/LevelIntro";


export default class LevelIntroContentLoader extends React.Component<{
    levelIntro: LevelIntro,
    markDownClassName?: string
    loadingClassName?: string
    loadingContent?: ReactNode
}, {
    htmlContent?: string
}> {
    constructor(props: LevelIntroContentLoader["props"]) {
        super(props)
        this.state = {
            htmlContent: undefined
        }
    }

    get introNeedsToFetchContent(): boolean {
        return !!(!this.props.levelIntro?.ContentComponent && this.props.levelIntro?.filename)
    }

    componentDidMount() {
        if (this.introNeedsToFetchContent) {
            this.loadContent()
        }
    }

    loadContent() {
        const { levelIntro } = this.props
        if (!levelIntro) { return }

        levelIntro.loadContent()
            .then(htmlContent => {
                setTimeout(() => {
                    this.setState({ htmlContent })
                }, 500);
            })
    }

    render() {
        const { levelIntro, markDownClassName, loadingClassName } = this.props
        const { htmlContent } = this.state
        const { ContentComponent } = levelIntro
        const loadingContent = this.props.loadingContent || <>LOADING</>

        if (ContentComponent) {
            return (
                <div className={markDownClassName}>
                    <ContentComponent />
                </div>
            )
        }

        if (this.introNeedsToFetchContent && htmlContent) {
            return (
                <div
                    className={markDownClassName}
                    dangerouslySetInnerHTML={{ __html: htmlContent }} >
                </div>
            )
        }
        if (this.introNeedsToFetchContent) {
            return (
                <div className={loadingClassName} >
                    {loadingContent}
                </div>
            )
        }
        return null
    }
}