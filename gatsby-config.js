module.exports = {
  siteMetadata: {
    title: `Richard Shin`,
    description: `Richard Shin's personal web site`,
    author: `@rshin`,
  },
  plugins: [
    `gatsby-plugin-styled-components`,
    {
      resolve: `gatsby-plugin-mdx`,
      options: {
        defaultLayouts: {
          default: require.resolve('./src/components/layout.js'),
        },
      },
    },
    `gatsby-plugin-react-helmet`,
    {
      resolve: `gatsby-source-filesystem`,
      options: {
        name: `images`,
        path: `${__dirname}/src/images`,
      },
    },
    {
      resolve: `gatsby-source-filesystem`,
      options: {
        name: `pages`,
        path: `${__dirname}/src/pages/`,
      },
    },
    {
      resolve: `gatsby-source-filesystem`,
      options: {
        name: `data`,
        path: `${__dirname}/data/`,
      },
    },
    `gatsby-transformer-sharp`,
    `gatsby-plugin-sharp`,
    //     {
    //       resolve: `gatsby-plugin-manifest`,
    //       options: {
    //         name: `gatsby-starter-default`,
    //         short_name: `starter`,
    //         start_url: `/`,
    //         background_color: `#663399`,
    //         theme_color: `#663399`,
    //         display: `minimal-ui`,
    //         icon: `src/images/gatsby-icon.png`, // This path is relative to the root of the site.
    //       },
    //     },
    {
      resolve: `gatsby-plugin-typography`,
      options: {
        pathToConfigModule: `src/utils/typography`,
      },
    },
    // this (optional) plugin enables Progressive Web App + Offline functionality
    // To learn more, visit: https://gatsby.dev/offline
    //    `gatsby-plugin-offline`,
  ],
}
