// @ts-check

/** @type {import('@docusaurus/plugin-content-docs').SidebarsConfig} */
const sidebars = {
  // By default, Docusaurus generates a sidebar from the docs folder structure
  tutorialSidebar: [
    {
      type: 'category',
      label: 'Introduction',
      items: ['intro'],
    },
    {
      type: 'category',
      label: 'Foundations',
      items: [
        'foundations/why-physical-ai-matters'
      ],
    },
    {
      type: 'category',
      label: 'Module 1: Robotic Nervous System (ROS 2)',
      items: [
        'module-1-ros2/intro',
        'module-1-ros2/m1c1-nodes-communication',
        'module-1-ros2/m1c2-urdf-sdf',
        'module-1-ros2/homework'
      ],
    },
    {
      type: 'category',
      label: 'Module 2: Digital Twin (Gazebo & Unity)',
      items: [
        'module-2-digital-twin/intro',
        'module-2-digital-twin/m2c1-gazebo-fortress',
        'module-2-digital-twin/m2c2-unity-bridge',
      ],
    },
    {
      type: 'category',
      label: 'Module 3: AI-Robot Brain (NVIDIA Isaac)',
      items: [
        'module-3-ai-brain/intro',
        'module-3-ai-brain/m3c1-isaac-sim-setup',
        'module-3-ai-brain/m3c2-isaac-ros-vslam',
        'module-3-ai-brain/m3c3-nav2-humanoids',
      ],
    },
    {
      type: 'category',
      label: 'Module 4: Vision-Language-Action (VLA)',
      items: [
        'module-4-vla/intro',
        'module-4-vla/m4c1-voice-to-action',
        'module-4-vla/m4c2-vla-pipeline',
      ],
    },
    {
      type: 'category',
      label: 'Lab and Hardware Architectures',
      items: [
        'lab-architectures/intro',
        'lab-architectures/on-premises-setup',
        'lab-architectures/cloud-solutions'
      ],
    },
  ],

  // But you can create a sidebar manually
  /*
  tutorialSidebar: [
    {
      type: 'category',
      label: 'Tutorial',
      items: ['hello'],
    },
  ],
   */
};

module.exports = sidebars;