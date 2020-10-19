module.exports = {
  title: "IO Docs",
  tagline: "IO project Documentation",
  url: "https://pagopa.github.io",
  baseUrl: "/io-docs/",
  onBrokenLinks: "throw",
  favicon: "img/favicon.ico",
  organizationName: "pagopa", // Usually your GitHub org/user name.
  projectName: "io-docs", // Usually your repo name.
  themeConfig: {
    navbar: {
      title: "IO Docs",
      logo: {
        alt: "IO logo",
        src: "img/logo.svg",
      },
      items: [
        {
          to: "docs/",
          activeBasePath: "docs",
          label: "Docs",
          position: "left",
        },
        { to: "blog", label: "Blog", position: "left" },
        {
          href: "https://io.italia.it",
          label: "IO",
          position: "right",
        },
      ],
    },
    footer: {
      style: "dark",
      links: [
        {
          title: "IO",
          items: [
            {
              label: "IO project",
              href: "https://io.italia.it",
            },
          ],
        },
      ],
      copyright: `Copyright © ${new Date().getFullYear()} PagoPA S.p.a.`,
    },
  },
  presets: [
    [
      "@docusaurus/preset-classic",
      {
        docs: {
          sidebarPath: require.resolve("./sidebars.js"),
          // Please change this to your repo.
          editUrl: "https://github.com/pagopa/io-docs/edit/main/docs",
        },
        theme: {
          customCss: require.resolve("./src/css/custom.css"),
        },
      },
    ],
  ],
};
