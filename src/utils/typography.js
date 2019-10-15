import Typography from "typography"
import githubTheme from "typography-theme-github"

githubTheme.scaleRatio = 2.5
githubTheme.baseFontSize = `15px`
githubTheme.baseLineHeight = 1.5
githubTheme.overrideThemeStyles = ({ rhythm }, options) => ({
  h1: {
    marginBottom: rhythm(3 / 4),
    marginTop: rhythm(1 / 4),
    padding: 0,
  },
  h2: {
    marginBottom: rhythm(3 / 4),
    paddingTop: rhythm(1 / 4),
  },
  "h1,h2": {
    border: `none`,
  },
  /*
  "h3,h4,h5,h6": {
    paddingTop: rhythm(1 / 4),
  },
  */
})

let typography = new Typography(githubTheme)

export const { scale, rhythm, options } = typography
export default typography
