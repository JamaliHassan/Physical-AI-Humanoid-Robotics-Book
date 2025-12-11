"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const prism_react_renderer_1 = require("prism-react-renderer");
const config = {
    title: 'Physical AI & Humanoid Robotics',
    tagline: 'A comprehensive guide to embodied intelligence and humanoid robotics',
    favicon: 'img/favicon.ico',
    // Set the production url of your site here
    url: 'https://JamaliHassan.github.io',
    // Set the /<base> pathname under which your site is served
    // For GitHub Pages deployment, use the repository name
    baseUrl: '/Physical-AI-Humanoid-Robotics-Book/',
    // GitHub pages deployment config.
    organizationName: 'JamaliHassan',
    projectName: 'Physical-AI-Humanoid-Robotics-Book',
    deploymentBranch: 'gh-pages',
    onBrokenLinks: 'warn',
    markdown: {
        hooks: {
            onBrokenMarkdownLinks: 'warn',
        },
    },
    // Even if you don't use internationalization, you can use this field to set
    // useful metadata like html lang. For example, if your site is Chinese, you
    // may want to replace "en" with "zh-Hans".
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
                    // Please change this to your repo.
                    // Remove this to remove the "edit this page" links.
                    editUrl: 'https://github.com/facebook/docusaurus/tree/main/packages/create-docusaurus/templates/shared/',
                },
                blog: false,
                theme: {
                    customCss: './src/css/custom.css',
                },
            },
        ],
    ],
    themeConfig: {
        // Replace with your project's social card
        image: 'img/robotics-social-card.jpg',
        navbar: {
            title: 'Physical AI & Humanoid Robotics',
            logo: {
                alt: 'Robotics Logo',
                src: 'img/logo.svg',
                href: '/docs/intro',
            },
            items: [
                {
                    type: 'docSidebar',
                    sidebarId: 'tutorialSidebar',
                    position: 'left',
                    label: 'Book',
                },
                {
                    to: '/docs/intro',
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
            links: [
                {
                    title: 'Docs',
                    items: [
                        {
                            label: 'Introduction',
                            to: '/docs/intro',
                        },
                        {
                            label: 'Module 1: ROS 2',
                            to: '/docs/module-1-ros2/intro',
                        },
                        {
                            label: 'Module 2: Simulation',
                            to: '/docs/module-2-gazebo-unity/intro',
                        },
                    ],
                },
                {
                    title: 'Community',
                    items: [
                        {
                            label: 'Stack Overflow',
                            href: 'https://stackoverflow.com/questions/tagged/docusaurus',
                        },
                        {
                            label: 'Discord',
                            href: 'https://discordapp.com/invite/docusaurus',
                        },
                        {
                            label: 'Twitter',
                            href: 'https://twitter.com/docusaurus',
                        },
                    ],
                },
                {
                    title: 'More',
                    items: [
                        {
                            label: 'GitHub',
                            href: 'https://github.com/JamaliHassan/Physical-AI-Humanoid-Robotics-Book',
                        },
                    ],
                },
            ],
            copyright: `Copyright © ${new Date().getFullYear()} GIAIC. Built with Docusaurus.`,
        },
        prism: {
            theme: prism_react_renderer_1.themes.github,
            darkTheme: prism_react_renderer_1.themes.dracula,
        },
    },
};
exports.default = config;
