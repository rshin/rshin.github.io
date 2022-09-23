import React from "react"
import { StaticImage } from "gatsby-plugin-image"

export default () => {
  return (
    <StaticImage
      src="../images/richard.jpg"
      alt="Richard Shin's headshot"
      placeholder="tracedSVG"
      layout="fixed"
      width={200}
      height={200}
      quality={90}
    />
  )
}
