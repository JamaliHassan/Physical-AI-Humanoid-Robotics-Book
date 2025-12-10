# Data Model: Physical AI & Humanoid Robotics Book

## Content Structure

### Book
- **title**: String (e.g., "Physical AI & Humanoid Robotics")
- **description**: String (educational content on ROS 2, simulation, AI, and robotics)
- **modules**: Array<Module> (ordered collection of course modules)
- **target_audience**: String (students and developers with basic web/CLI experience)

### Module
- **id**: String (unique identifier for the module)
- **title**: String (e.g., "Introduction to ROS 2")
- **description**: String (brief overview of the module content)
- **chapters**: Array<Chapter> (ordered collection of chapters in the module)
- **prerequisites**: Array<String> (skills or knowledge required before starting)
- **objectives**: Array<String> (learning objectives for the module)

### Chapter
- **id**: String (unique identifier for the chapter)
- **title**: String (e.g., "ROS 2 Nodes and Communication")
- **content_type**: Enum ("conceptual", "hands-on", "lab", "architecture")
- **description**: String (brief overview of the chapter content)
- **sections**: Array<Section> (ordered collection of sections in the chapter)
- **prerequisites**: Array<String> (specific requirements for this chapter)
- **objectives**: Array<String> (specific learning objectives for this chapter)
- **assets**: Array<String> (files, images, code examples referenced in the chapter)

### Section
- **id**: String (unique identifier for the section)
- **title**: String (e.g., "Creating a ROS 2 Node")
- **content**: String (Markdown/MDX content for the section)
- **examples**: Array<Example> (code examples or practical demonstrations)
- **exercises**: Array<Exercise> (practice problems or labs)

### Example
- **id**: String (unique identifier for the example)
- **title**: String (e.g., "Simple Publisher Node")
- **description**: String (what the example demonstrates)
- **code**: String (the actual code snippet)
- **language**: String (e.g., "python", "cpp", "bash")
- **instructions**: String (how to run or use the example)

### Exercise
- **id**: String (unique identifier for the exercise)
- **title**: String (e.g., "Create a Subscriber Node")
- **description**: String (what the exercise requires)
- **difficulty**: Enum ("beginner", "intermediate", "advanced")
- **instructions**: String (step-by-step guidance)
- **solution**: String (optional, for instructor reference)

## Technical Components

### Docusaurus Configuration
- **siteConfig**: Object (Docusaurus site configuration)
- **sidebarConfig**: Object (navigation structure for the book)
- **themeConfig**: Object (styling and theme options)

### Simulation Environment
- **ros2_config**: Object (ROS 2 distribution and workspace settings)
- **gazebo_config**: Object (Gazebo simulation parameters)
- **isaac_config**: Object (Isaac Sim and Isaac ROS settings)
- **hardware_config**: Object (robot and sensor specifications)

## Learning Assessment

### Quiz
- **id**: String (unique identifier for the quiz)
- **title**: String (e.g., "ROS 2 Communication Quiz")
- **module_id**: String (reference to the module this quiz belongs to)
- **questions**: Array<Question> (collection of quiz questions)

### Question
- **id**: String (unique identifier for the question)
- **text**: String (the question text)
- **type**: Enum ("multiple-choice", "true-false", "short-answer")
- **options**: Array<String> (for multiple choice questions)
- **correct_answer**: String | Array<String> (the correct answer(s))
- **explanation**: String (explanation of the correct answer)