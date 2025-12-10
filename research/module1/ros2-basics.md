# ROS 2 Basics Research: Nodes, Topics, Services, Actions, rclpy

## Overview
This document covers the fundamental concepts of ROS 2, including the core communication patterns and the Python client library (rclpy).

## Core Architecture

### Nodes
- Processes that perform computation
- Basic unit of computation in ROS 2
- Communicate with other nodes through topics, services, and actions
- Managed by the ROS 2 runtime system

### Topics and Publishers/Subscribers
- Asynchronous, decoupled communication
- One-to-many or many-to-one communication pattern
- Publishers send messages, subscribers receive messages
- Message types defined in .msg files
- Quality of Service (QoS) settings for reliability

### Services
- Synchronous request/response communication
- One-to-one communication pattern
- Request message and response message types
- Client calls service server

### Actions
- Asynchronous request/response with feedback
- Goal, result, and feedback messages
- Support for preemption and cancellation
- Three-part communication pattern

## rclpy (Python Client Library)

### Node Creation
- Using rclpy.create_node() to create nodes
- Node lifecycle management
- Parameter handling within nodes

### Publishers and Subscribers
- Creating publishers with node.create_publisher()
- Creating subscribers with node.create_subscription()
- Message handling callbacks
- QoS profile configuration

### Services and Clients
- Creating services with node.create_service()
- Creating clients with node.create_client()
- Synchronous and asynchronous service calls

### Actions
- Creating action servers with node.create_action_server()
- Creating action clients with node.create_action_client()
- Handling goals, results, and feedback

## Communication Patterns

### Publisher-Subscriber (Topics)
- Data distribution pattern
- Real-time streaming of data
- Decoupled in time and space

### Client-Server (Services)
- Request-response pattern
- Synchronous operations
- Single request, single response

### Action Client-Server
- Long-running operations
- Goal with feedback and result
- Cancel and preemption support

## Best Practices

### Package Structure
- Standard ROS 2 package organization
- setup.py for Python packages
- CMakeLists.txt for C++ packages

### Naming Conventions
- Standard naming for topics, services, actions
- Namespace organization
- Consistent message types

### Error Handling
- Proper exception handling in callbacks
- Graceful degradation
- Node lifecycle management

## References
- ROS 2 Documentation: https://docs.ros.org/en/humble/
- rclpy API Documentation: https://docs.ros.org/en/humble/p/rclpy/
- ROS 2 Tutorials: https://docs.ros.org/en/humble/Tutorials.html