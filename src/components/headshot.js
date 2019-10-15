import React from "react"
import { useStaticQuery, graphql } from "gatsby"
import Img from "gatsby-image"

export default () => {
  const data = useStaticQuery(graphql`
    query {
      file(relativePath: { eq: "richard.jpg" }) {
        childImageSharp {
          fixed (width: 180, height: 180, quality: 90){
            ...GatsbyImageSharpFixed_withWebp_tracedSVG
          }
        }
      }
    }
  `)
  return <Img fixed={data.file.childImageSharp.fixed} alt="Richard Shin's headshot" />
}
