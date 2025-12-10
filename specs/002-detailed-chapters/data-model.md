# Data Model: Detailed Chapter Development for Physical AI & Humanoid Robotics Book

## Overview

This document defines the data structures and content models for the Physical AI & Humanoid Robotics book chapters. The models support the pedagogical arc (Concept → Simulator Implementation → Edge Deployment Strategy) and ensure consistency across all modules and chapters.

## Chapter Content Model

### Chapter Entity
```yaml
Chapter:
  id: string                    # Format: M{module}C{chapter} (e.g., M1C1, M2C3)
  title: string                 # Chapter title
  module: Module                # Reference to parent module
  week: integer                 # Course week assignment
  complexity: string            # "overview" | "medium" | "deep-technical"
  target_hardware: string       # "simulation" | "edge" | "both"
  learning_objectives: [string] # List of specific learning outcomes
  prerequisites: [string]       # Required knowledge/skills
  content_structure: ContentStructure
  code_examples: [CodeExample]
  visual_verification: VisualVerification
  exercises: [Exercise]
  troubleshooting: [TroubleshootingGuide]
  further_reading: [Reference]
```

### Module Entity
```yaml
Module:
  id: string                    # Format: M{module} (e.g., M1, M2, M3, M4)
  title: string                 # Module title
  description: string           # Module overview
  chapters: [Chapter]           # List of chapters in this module
  total_weeks: integer          # Total weeks for module
  target_audience: string       # "senior-engineering-students" | "lab-builders"
```

## Content Structure Model

### Content Structure
```yaml
ContentStructure:
  concept: Section              # Theoretical concepts and principles
  simulator_implementation: Section  # Simulation-based implementation
  edge_deployment_strategy: Section  # Physical robot deployment guidance
  hardware_reality_check: HardwareCheck  # Simulation vs edge deployment
```

### Section
```yaml
Section:
  title: string                 # Section title
  content: string               # Markdown content
  code_blocks: [CodeBlock]      # Code examples in this section
  diagrams: [Diagram]           # Visual elements in this section
  exercises: [Exercise]         # Exercises specific to this section
```

### HardwareCheck
```yaml
HardwareCheck:
  type: string                  # "simulation" | "edge"
  platform: string              # "rtx-pc" | "jetson"
  requirements: [string]        # Hardware requirements
  capabilities: [string]        # What the platform can do
  limitations: [string]         # What the platform cannot do
  dependencies: [string]        # Software dependencies
```

## Code Example Model

### CodeExample
```yaml
CodeExample:
  id: string                    # Unique identifier for the example
  title: string                 # Descriptive title
  description: string           # Purpose and explanation
  language: string              # "python" | "cpp" | "bash" | etc.
  code: string                  # The actual code content
  dependencies: Dependencies    # Required packages/libraries
  simulation_config: Config     # Configuration for simulation
  edge_config: Config           # Configuration for edge deployment
  testing_instructions: string  # How to test/run the example
```

### Dependencies
```yaml
Dependencies:
  package_xml: string           # Content for ROS 2 package.xml file
  pip_requirements: [string]    # Python pip requirements
  system_packages: [string]     # System package dependencies
  hardware_requirements: [string] # Hardware-specific requirements
```

### Config
```yaml
Config:
  environment: string           # Environment-specific settings
  parameters: map[string, any]  # Configuration parameters
  launch_files: [string]        # ROS 2 launch files
  hardware_specific: [string]   # Hardware-specific configurations
```

## Visual Verification Model

### VisualVerification
```yaml
VisualVerification:
  mermaid_diagrams: [MermaidDiagram]
  images: [Image]
  videos: [Video]
  interactive_elements: [InteractiveElement]
```

### MermaidDiagram
```yaml
MermaidDiagram:
  id: string                    # Unique identifier
  title: string                 # Diagram title
  type: string                  # "flowchart" | "sequence" | "class" | "state" | "gantt"
  specification: string         # Mermaid.js syntax
  description: string           # What the diagram illustrates
  use_case: string              # When/where to use this diagram
```

### Image
```yaml
Image:
  id: string                    # Unique identifier
  title: string                 # Image title
  alt_text: string              # Accessibility description
  src: string                   # Image source path
  caption: string               # Image caption
  width: integer                # Display width (optional)
  height: integer               # Display height (optional)
```

## Exercise Model

### Exercise
```yaml
Exercise:
  id: string                    # Unique identifier
  title: string                 # Exercise title
  type: string                  # "lab" | "implementation" | "analysis" | "research"
  difficulty: string            # "beginner" | "intermediate" | "advanced"
  estimated_time: integer       # Time in minutes
  objectives: [string]          # Learning objectives addressed
  instructions: string          # Step-by-step instructions
  expected_outcomes: [string]   # What students should achieve
  hints: [string]               # Optional hints for students
  solutions: [Solution]         # Reference solutions
```

### Solution
```yaml
Solution:
  id: string                    # Unique identifier
  description: string           # Solution approach
  code: string                  # Solution code
  explanation: string           # Explanation of solution
  alternative_approaches: [string] # Other possible approaches
```

## Troubleshooting Model

### TroubleshootingGuide
```yaml
TroubleshootingGuide:
  id: string                    # Unique identifier
  issue: string                 # Description of the issue
  symptoms: [string]            # Observable symptoms
  causes: [string]              # Possible root causes
  solutions: [string]           # Step-by-step solutions
  prevention: [string]          # How to prevent the issue
  verification: string          # How to verify the fix worked
```

## Reference Model

### Reference
```yaml
Reference:
  id: string                    # Unique identifier
  title: string                 # Reference title
  type: string                  # "documentation" | "research-paper" | "tutorial" | "code-repo"
  url: string                   # Link to the reference
  description: string           # Brief description
  relevance: string             # How this relates to the chapter content
```

## Docusaurus MDX Integration

### MDX Frontmatter
```yaml
mdx_frontmatter:
  id: string                    # Chapter ID (M{module}C{chapter})
  title: string                 # Chapter title for Docusaurus
  sidebar_label: string         # Label for sidebar navigation
  description: string           # SEO description
  keywords: [string]            # SEO keywords
  module: string                # Module identifier
  week: integer                 # Course week
  complexity: string            # Chapter complexity
  target_hardware: [string]     # Target hardware platforms
  learning_objectives: [string] # Learning objectives for metadata
```

### MDX Content Structure
```yaml
mdx_content_structure:
  tabs: [Tab]                   # Simulation vs Edge deployment tabs
  code_tabs: [CodeTab]          # Multi-language code examples
  interactive_components: [InteractiveComponent] # Custom React components
```

### Tab
```yaml
Tab:
  label: string                 # Tab label (e.g., "Simulation", "Edge Deployment")
  content: string               # Tab content in Markdown
  hardware_type: string         # Associated hardware type
```

## Validation Rules

### Content Validation
- Each chapter must have at least one executable code example
- All code examples must include dependency specifications
- Each chapter must include hardware reality check specification
- Complex concepts must include Mermaid.js diagram specifications
- Content must follow pedagogical arc: Concept → Simulator → Edge

### Technical Validation
- All code must be syntactically correct for the specified language
- Dependencies must be resolvable and version-appropriate
- Hardware requirements must be clearly specified
- All external links must be valid
- All images must have appropriate alt text for accessibility

## Versioning and Evolution

### Content Versioning
- Chapter content follows semantic versioning (major.minor.patch)
- Breaking changes to code examples increment major version
- New examples or clarifications increment minor version
- Typo fixes and minor updates increment patch version

### Compatibility Tracking
- ROS 2 version compatibility: Humble/Iron specific
- Isaac Sim version compatibility: 4.0+ required
- Docusaurus version: v3.x compatibility maintained
- Hardware platform compatibility: RTX PC and Jetson verified