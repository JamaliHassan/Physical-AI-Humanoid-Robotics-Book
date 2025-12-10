# URDF for Humanoid Robots Research

## Overview
URDF (Unified Robot Description Format) is an XML format for representing a robot model. It's essential for describing the physical structure of humanoid robots in ROS environments.

## Key Elements

### Links
- Rigid parts of the robot (e.g., torso, limbs, head)
- Physical properties: mass, inertia, visual, and collision properties

### Joints
- Connections between links
- Joint types: revolute, continuous, prismatic, fixed, floating, planar
- Joint limits and dynamics

### Materials
- Visual appearance properties (color, texture)

## Humanoid-Specific Considerations
- Multi-body dynamics for bipedal/quadruped locomotion
- Kinematic chains for arms and legs
- Balance and center of mass calculations

## Best Practices
- Proper naming conventions for humanoid joints
- Accurate physical properties for simulation
- Hierarchical structure for complex humanoid models

## References
- URDF Documentation: http://wiki.ros.org/urdf
- URDF Tutorials: http://wiki.ros.org/urdf/Tutorials
- Xacro (XML Macros) for complex humanoid models: http://wiki.ros.org/xacro