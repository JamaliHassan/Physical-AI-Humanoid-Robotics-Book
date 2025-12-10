# Module 1: ROS 2 Fundamentals - In-Scope vs Out-of-Scope Topics

## In-Scope Topics

### Core ROS 2 Concepts
- Node creation and lifecycle management
- Publisher/subscriber communication pattern
- Service-based request/response communication
- Action-based long-running operations with feedback
- Quality of Service (QoS) profiles and settings

### Development Environment
- ROS 2 workspace setup (Humble Hawksbill)
- Package creation and structure
- Building with colcon
- Dependency management with rosdep
- Using ROS 2 command-line tools

### Communication Patterns
- Creating and using topics with various message types
- Implementing services with request/response messages
- Developing action servers and clients
- Parameter management and configuration
- Launch files for multi-node orchestration

### Robot Modeling
- URDF (Unified Robot Description Format) basics
- Creating links, joints, and materials
- Visual and collision properties
- Simple robot model creation

### Tools and Visualization
- Using RViz for robot visualization
- Command-line tools (ros2 topic, ros2 service, etc.)
- Basic debugging techniques
- Package management and build tools

### Programming
- Python client library (rclpy) basics
- Node implementation in Python
- Message handling and callbacks
- Error handling in ROS 2 nodes

## Out-of-Scope Topics

### Advanced ROS 2 Features
- Custom message and service definition (covered briefly, not in depth)
- Real-time performance optimization
- Advanced QoS configuration beyond basic patterns
- ROS 1 bridge and migration details
- DDS (Data Distribution Service) implementation details

### Specialized Applications
- Computer vision integration (covered in Module 3)
- Advanced motion planning (covered in Module 3)
- Machine learning integration (covered in Module 4)
- Hardware interface development
- Custom controller implementation

### Deep Technical Implementation
- ROS 2 middleware implementation details
- Network configuration beyond basic setup
- Advanced build system customization
- Memory management optimization
- Threading and concurrency implementation details

### Simulation-Specific Content
- Gazebo simulation setup (covered in Module 2)
- Physics properties in URDF (covered in Module 2)
- Sensor integration in simulation (covered in Module 2)
- Robot dynamics and control (covered in Module 2)

### Hardware-Specific Details
- Specific robot hardware interfaces
- Embedded system deployment
- Real-time operating systems
- Low-level driver development
- Custom hardware integration

### Advanced Architecture
- Complex multi-robot systems
- Distributed computing patterns beyond basic nodes
- Advanced security implementations
- Custom middleware development
- Performance profiling and optimization

## Deferrals to External Resources
The following topics will be referenced but not covered in depth:
- Complete ROS 2 API documentation (students should refer to official docs)
- Advanced C++ client library (rclcpp) details (Python focus in this module)
- Detailed DDS configuration (covered in advanced courses)
- Hardware-specific ROS packages (refer to manufacturer documentation)

## Module Boundaries
This module focuses on establishing foundational knowledge and practical skills in ROS 2. Students will gain sufficient knowledge to build basic robotic applications and continue to more advanced topics in subsequent modules. Advanced optimization, specialized applications, and hardware-specific implementations are deferred to later modules or external resources.