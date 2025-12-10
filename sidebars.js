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
      label: 'Module 1: ROS 2 Fundamentals',
      items: [
        'module-1-ros2/intro',
        'module-1-ros2/nodes-topics',
        'module-1-ros2/services-actions',
        'module-1-ros2/urdf-basics',
        'module-1-ros2/homework'
      ],
    },
    {
      type: 'category',
      label: 'Module 2: Digital Twin - Gazebo and Unity',
      items: [
        'module-2-gazebo-unity/intro',
        'module-2-gazebo-unity/gazebo-fundamentals',
        'module-2-gazebo-unity/unity-robotics',
        'module-2-gazebo-unity/digital-twin-implementation'
      ],
    },
    {
      type: 'category',
      label: 'Module 3: NVIDIA Isaac and Sim to Real',
      items: [
        'module-3-isaac-sim/intro',
        'module-3-isaac-sim/isaac-sim-basics',
        'module-3-isaac-sim/isaac-ros-packages',
        'module-3-isaac-sim/navigation-with-nav2'
      ],
    },
    {
      type: 'category',
      label: 'Module 4: VLA and Autonomous Humanoid Capstone',
      items: [
        'module-4-vla-capstone/intro',
        'module-4-vla-capstone/voice-processing',
        'module-4-vla-capstone/language-understanding',
        'module-4-vla-capstone/action-execution',
        'module-4-vla-capstone/capstone-project'
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
    {
      type: 'category',
      label: 'Demo',
      items: [
        'demo/chapter-demo'
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