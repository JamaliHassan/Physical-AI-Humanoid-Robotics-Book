# Quickstart Guide: Physical AI & Humanoid Robotics Book

## Prerequisites

- Ubuntu 22.04 LTS (or WSL2 on Windows)
- Node.js LTS (v20.x or higher)
- npm or yarn package manager
- Git version control
- Basic command-line familiarity

## Setup Instructions

### 1. Clone the Repository
```bash
git clone <repository-url>
cd <repository-name>
```

### 2. Install Docusaurus Dependencies
```bash
npm install
```

### 3. Install ROS 2 Humble
Follow the official ROS 2 Humble installation guide for Ubuntu 22.04:
```bash
# Setup locale
sudo locale-gen en_US.UTF-8
sudo update-locale LANG=en_US.UTF-8
export LANG=en_US.UTF-8

# Setup sources
sudo apt update && sudo apt install -y curl gnupg lsb-release
curl -sSL https://raw.githubusercontent.com/ros/rosdistro/master/ros.key | sudo gpg --dearmor -o /usr/share/keyrings/ros-archive-keyring.gpg
echo "deb [arch=$(dpkg --print-architecture) signed-by=/usr/share/keyrings/ros-archive-keyring.gpg] http://packages.ros.org/ros2/ubuntu $(source /etc/os-release && echo $UBUNTU_CODENAME) main" | sudo tee /etc/apt/sources.list.d/ros2.list > /dev/null

# Install ROS 2 packages
sudo apt update
sudo apt install ros-humble-desktop
sudo apt install python3-rosdep2
sudo apt install python3-colcon-common-extensions

# Initialize rosdep
sudo rosdep init
rosdep update

# Source ROS 2 environment
source /opt/ros/humble/setup.bash
```

### 4. Install Gazebo Garden
```bash
sudo apt install ros-humble-gazebo-*
```

### 5. Run the Development Server
```bash
npm start
```

Your site will be accessible at `http://localhost:3000`.

## Running Simulations

### Basic ROS 2 + Gazebo Example
1. Source ROS 2 environment:
   ```bash
   source /opt/ros/humble/setup.bash
   ```
2. Launch a sample simulation:
   ```bash
   ros2 launch gazebo_ros empty_world.launch.py
   ```

## Building for Production
```bash
npm run build
```

## Contributing Content

1. Create a new markdown file in the `docs/` directory
2. Add it to the appropriate section in `sidebars.js`
3. Use the following frontmatter template:
```markdown
---
title: Your Chapter Title
sidebar_position: 1
description: Brief description of the chapter
---
```

## Validation Steps

1. Ensure all commands in examples work on Ubuntu 22.04 with ROS 2 Humble
2. Verify all links in the documentation resolve correctly
3. Test all simulation examples in Gazebo
4. Run `npm run build` to ensure the site builds without errors