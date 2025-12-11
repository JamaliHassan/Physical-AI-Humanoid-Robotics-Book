import {themes as prismThemes} from 'prism-react-renderer';
import type {Config} from '@docusaurus/types';
import type * as Preset from '@docusaurus/preset-classic';

const config: Config = {
  title: 'Physical AI & Humanoid Robotics',
  tagline: 'A comprehensive guide to embodied intelligence and humanoid robotics',
  favicon: 'img/favicon.ico',

  url: 'https://JamaliHassan.github.io',   // YOUR DOMAIN
  baseUrl: '/Physical-AI-Humanoid-Robotics-Book/',  // REPO NAME (IMPORTANT)

  organizationName: 'JamaliHassan',   // GitHub username
  projectName: 'Physical-AI-Humanoid-Robotics-Book',  // repo name (NO slash)
  deploymentBranch: 'gh-pages',

  onBrokenLinks: 'warn',
  markdown: {
    hooks: {
      onBrokenMarkdownLinks: 'warn',
    },
  },

  i18n: {
    defaultLocale: 'en',
    locales: ['en'],
  },

  presets: [
    [
      'classic',
      {
        docs: {
          sidebarPath: './sidebars.js',
          editUrl: 'https://github.com/JamaliHassan/Physical-AI-Humanoid-Robotics-Book/tree/main/',
        },
        blog: false,
        theme: {
          customCss: './src/css/custom.css',
        },
      } satisfies Preset.Options,
    ],
  ],

  themeConfig: {
    image: 'img/robotics-social-card.jpg',
    navbar: {
      title: 'Physical AI & Humanoid Robotics',
      logo: {
        alt: 'Robotics Logo',
        src: 'img/logo.svg',
        href: '/Physical-AI-Humanoid-Robotics-Book/docs/intro', // baseUrl added
      },
      items: [
        {
          type: 'docSidebar',
          sidebarId: 'tutorialSidebar',
          position: 'left',
          label: 'Book',
        },
        {
          to: '/Physical-AI-Humanoid-Robotics-Book/docs/intro',
          label: 'Get Started',
          position: 'left',
        },
        {
          href: 'https://github.com/JamaliHassan/Physical-AI-Humanoid-Robotics-Book',
          label: 'GitHub',
          position: 'right',
        },
      ],
    },
    footer: {
      style: 'dark',
      links: [],
    },
    prism: {
      theme: prismThemes.github,
      darkTheme: prismThemes.dracula,
    },
  } satisfies Preset.ThemeConfig,
};

export default config;
