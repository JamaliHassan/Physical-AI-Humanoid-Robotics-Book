import React from 'react';
import useDocusaurusContext from '@docusaurus/useDocusaurusContext';
import Layout from '@theme/Layout';
import Link from '@docusaurus/Link';
import clsx from 'clsx';

import styles from './index.module.css';

function HomepageHeader() {
  const {siteConfig} = useDocusaurusContext();
  return (
    <header className={clsx('hero hero--primary', styles.heroBanner)}>
      <div className="container">
        <h1 className="hero__title">{siteConfig.title}</h1>
        <p className="hero__subtitle">{siteConfig.tagline}</p>
        <div className={styles.buttons}>
          <Link
            className="button button--secondary button--lg"
            to="/docs/intro">
            Start Reading the Book
          </Link>
        </div>
      </div>
    </header>
  );
}

export default function Home(): JSX.Element {
  const {siteConfig} = useDocusaurusContext();
  return (
    <Layout
      title={`Welcome to ${siteConfig.title}`}
description="Physical AI & Humanoid Robotics Book">
      <HomepageHeader />
      <main>
        <section className={styles.features}>
          <div className="container">
            <div className="row">
              <div className={clsx('col col--4')}>
                <h2>Module 1: ROS 2</h2>
                <p>Learn about Robot Operating System 2, the foundation for robotics development.</p>
              </div>
              <div className={clsx('col col--4')}>
                <h2>Module 2: Simulation</h2>
                <p>Explore Gazebo and Unity for robotics simulation and digital twin implementation.</p>
              </div>
              <div className={clsx('col col--4')}>
                <h2>Module 3: Isaac Sim</h2>
                <p>Master NVIDIA Isaac Sim and Isaac ROS packages for advanced robotics.</p>
              </div>
            </div>
            <div className="row" style={{marginTop: '2rem'}}>
              <div className={clsx('col col--4')}>
                <h2>Module 4: VLA Frameworks</h2>
                <p>Implement Voice-Language-Action frameworks for intelligent robotics.</p>
              </div>
              <div className={clsx('col col--4')}>
                <h2>Lab Architectures</h2>
                <p>Explore cloud and on-premises solutions for humanoid robotics labs.</p>
              </div>
              <div className={clsx('col col--4')}>
                <h2>Physical AI</h2>
                <p>Understand the principles of embodied intelligence and humanoid robotics.</p>
              </div>
            </div>
          </div>
        </section>
      </main>
    </Layout>
  );
}