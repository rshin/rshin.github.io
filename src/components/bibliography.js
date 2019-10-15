import intersperse from "intersperse"
import styled from "styled-components"
import React, { useState } from "react"
import Collapse from "react-collapse"
import Papers from "../../data/papers.yaml"
import Authors from "../../data/authors.yaml"
import Venues from "../../data/venues.yaml"
import _ from "lodash-es"
import { rhythm } from "../utils/typography"

const interpolate = (s, params) => {
  const names = Object.keys(params)
  const vals = Object.values(params)
  return new Function(...names, `return \`${s}\`;`)(...vals)
}

const PointerA = styled.a`
  cursor: pointer;
`

const Paper = styled(({ className, children: data }) => {
  const [showAbstract, setShowAbstract] = useState(false)
  let abstractLink, abstractBody
  if (data.abstract) {
    abstractLink = (
      <li>
        <PointerA onClick={() => setShowAbstract(!showAbstract)}>
          abstract
        </PointerA>
      </li>
    )
    abstractBody = <Collapse isOpened={showAbstract}>{data.abstract}</Collapse>
  }
  // TODO: add awards
  // TODO: add paper format
  // TODO: add equal contribution
  return (
    <div className={className}>
      <em>{data.title}</em>

      <AuthorList>
        {data.authors.map((author, _) => (
          <Author key={author}>{author}</Author>
        ))}
      </AuthorList>

      {data.published.map((venue, index) => (
        <Venue key={index}>{venue}</Venue>
      ))}

      <Links>
        {data.abstract && abstractLink}
        {data.links &&
          data.links.map((linkInfo, _) => {
            const [key, url] = Object.entries(linkInfo)[0]
            return (
              <li key={key}>
                <a href={url}>{key}</a>
              </li>
            )
          })}
      </Links>
      {data.abstract && abstractBody}
    </div>
  )
})`
  margin-bottom: ${rhythm(3 / 4)};
  .ReactCollapse--collapse {
    transition: height 500ms;
  }
`
const Author = ({ children: authorName }) => {
  // TODO: Need a better solution for "equal contribution"
  const authorInfo = Authors[authorName.replace(/\*$/, '')]
  if (authorInfo && authorInfo.website) {
    return <a href={authorInfo.website}>{authorName}</a>
  }
  return <span>{authorName}</span>
}
const AuthorList = styled(({ className, children: authors }) => (
  <div className={className}>{intersperse(authors, <>, </>)}</div>
))`
  margin-bottom: 0;
  & > * {
    display: inline-block;
  }
`

const Venue = styled(({ className, children: data }) => {
  const venue = Venues[data.venue]
  if (!venue) {
    return <p style={{ color: "red" }}>Unknown {data.venue}</p>
  }

  let desc = interpolate(venue.desc, {
    year: new Date(data.date).getFullYear(),
    ...venue,
    ...data,
  })

  if (venue.shortName) {
    desc = React.createElement(
      React.Fragment,
      null,
      intersperse(
        desc.split(venue.shortName),
        <abbr title={venue.fullName}>{venue.shortName}</abbr>
      )
    )
  }

  return (
    <p className={className}>
      {desc}
      {' '}  
      {data.award && <>(<strong>{data.award}</strong>)</>}
    </p>
  )
})`
  margin-bottom: 0;
`

const Links = styled.ul`
  & > li {
    display: inline;
    margin-left: 0.7em;
  }
  & > li:first-of-type {
    margin-left: 0;
  }
  display: inline;
  margin-left: 0;
`

export default () => {
  const papersGroupedByYear = _(Papers)
    .map(p => ({
      firstPublished: _(p.published)
        .map(pub => pub.date)
        .min(),
      ...p,
    }))
    .sortBy("firstPublished")
    .reverse()
    .groupBy(p => new Date(p.firstPublished).getFullYear())
    .value()

  const allYears = Object.keys(papersGroupedByYear)
  return (
    <div>
      {_(allYears)
        .sortBy(parseInt)
        .reverse()
        .map(yearStr => (
          <>
            <h3>{yearStr}</h3>
            {papersGroupedByYear[yearStr].map((data, index) => (
              <Paper key={index}>{data}</Paper>
            ))}
          </>
        ))
        .value()}
    </div>
  )
}
