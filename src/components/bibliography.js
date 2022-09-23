import intersperse from "intersperse"
import styled from "styled-components"
import React, { useState } from "react"
import Collapse from "react-collapse"
import Papers from "../../data/papers.yaml"
import Authors from "../../data/authors.yaml"
import Venues from "../../data/venues.yaml"
import flow from "lodash/fp/flow"
import groupBy from "lodash/fp/groupBy"
import map from "lodash/fp/map"
import min from "lodash/fp/min"
import reverse from "lodash/fp/reverse"
import sortBy from "lodash/fp/sortBy"
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
  const authorInfo = Authors[authorName.replace(/\*$/, "")]
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

  let parentheticals = [];
  if (data.award) {
    parentheticals.push(<strong>{data.award}</strong>);
  }
  if (data.format) {
    parentheticals.push(data.format);
  }

  return (
    <p className={className}>
      {desc}{" "}
      {parentheticals.length > 0 && (
        <>
          ({intersperse(parentheticals, ", ")})
        </>
      )}
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
  const papersGroupedByYear = flow(
    map((p) => ({
      firstPublished: flow(
        map((pub) => pub.date),
        min
      )(p.published),
      ...p,
    })),
    sortBy("firstPublished"),
    reverse,
    groupBy((p) => new Date(p.firstPublished).getFullYear())
  )(Papers)

  const allYears = Object.keys(papersGroupedByYear)
  return (
    <div>
      {flow(
        sortBy(parseInt),
        reverse,
        map((yearStr) => (
          <>
            <h3>{yearStr}</h3>
            {papersGroupedByYear[yearStr].map((data, index) => (
              <Paper key={index}>{data}</Paper>
            ))}
          </>
        ))
      )(allYears)}
    </div>
  )
}
