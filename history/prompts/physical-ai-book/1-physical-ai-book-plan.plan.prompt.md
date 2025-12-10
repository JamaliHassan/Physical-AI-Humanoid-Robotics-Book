---
id: 1
title: physical-ai-book-plan
stage: plan
date: '2025-12-07'
surface: agent
model: Claude Sonnet 4.5
feature: physical-ai-book
branch: 001-physical-ai-book-spec
user: Hassan Jamali
command: /sp.plan
labels:
  - physical-ai
  - humanoid-robotics
  - docusaurus
  - book
  - plan
links:
  spec: specs/physical-ai-book/spec.md
  ticket: null
  adr: null
  pr: null
files_yaml:
  - specs/physical-ai-book/plan.md
  - specs/physical-ai-book/research.md
  - specs/physical-ai-book/data-model.md
  - specs/physical-ai-book/quickstart.md
  - specs/physical-ai-book/contracts/content-api.yaml
tests_yaml:
  - npm run build
  - npm start
prompt_text: |
  Goal:
  Turn the business and educational requirements for the Physical AI & Humanoid Robotics book into a concrete technical and content implementation plan for a Docusaurus site, following the /sp.constitution and /sp.specify specs.

  Create (planning outputs):
  - Architecture sketch:
    - Overall repo layout (src, docs, static, .specify, workflows).
    - Docusaurus structure (presets, plugins, themes, navigation model).
    - Mapping from course modules/weeks to docs folders and sidebar groups.
    - Integration points for Spec-Kit Plus (location of /sp.* files, feature specs).
  - Section / content structure:
    - Parts/modules of the book and their order.
    - High-level chapter/page list per module (titles + 1–2 sentence intent).
    - Which sections are conceptual vs hands-on vs lab/architecture-focused.
  - Research approach:
    - How to research ROS 2, Gazebo, Unity, Isaac Sim, Isaac ROS, Nav2, VLA, and hardware topics using official docs.
    - How to resolve version choices (ROS 2 distro, Gazebo version, Isaac Sim version, Unity version).
    - How to handle on-prem vs cloud (Ether Lab) differences.
  - Quality validation plan:
    - Criteria for “good enough” technical accuracy and reproducibility for examples and setups.
    - Performance targets for key simulated tasks (e.g., real-time-ish sim, sub-second VLA latency on recommended hardware).

  Decisions needing documentation:
  For each of the following, list options, tradeoffs, and the chosen decision with rationale:

  - ROS 2:
    - Which distribution(s) to target (e.g., Humble vs Iron).
    - Level of depth: how far to go into ROS 2 APIs vs high-level workflows.
  - Simulation stack:
    - Gazebo version (Fortress/Garden/etc.) and why.
    - Role of Unity (visualization vs primary sim).
  - hnical details for how to plan:

  - Research-concurrent approach:
    - Do not try to research everything upfront.
    - For each module/section:
      - Outline intent.
      - Then research specific tools/veNVIDIA Isaac stack:
    - Isaac Sim version and deployment model (local RTX vs cloud).
    - Which Isaac ROS packages and Nav2 features to focus on.
  - Hardware and lab architectures:
    - Canonical “on-prem lab” spec (RTX workstation + Jetson + sensors + robot).
    - Canonical “Ether Lab” spec (cloud GPU + local bridge hardware).
    - Which specific robot examples to standardize on (e.g., Unitree Go2 as main proxy).
  - OS and environment:
    - Primary OS baseline (Ubuntu 22.04).
    - How to treat Windows/macOS users (dual-boot, WSL, or “cloud-only” guidance).
  - Performance and constraints:
    - Target sim FPS (e.g., 24–30 FPS) and acceptable degradation for weaker setups.
    - Target VLA latency (e.g., <500 ms voice-to-first-action on recommended hardware).
  - Book scope:
    - Where to stop in depth for each tool (ROS 2, Gazebo, Isaac, VLA) to stay within book scope.
    - Explicitly what will be deferred to external docs or future volumes.

  Testing and validation strategy:
  Define how to validate:

  1) Site integrity:
     - Docusaurus:
       - npm install, npm run build must pass locally.
       - Basic navigation QA (all sidebar links resolve; no obvious 404s).
     - CI/CD:
       - GitHub Actions workflow builds and deploys to GitHub Pages without errors.

  2) Content correctness:
     - Commands and configs:
       - ROS 2 CLI and basic launch files tested on Ubuntu 22.04 with chosen distro.
       - Gazebo/Unity minimal scenes tested or verified against official tutorials.
       - Isaac Sim, Isaac ROS, Nav2 configurations verified against official docs and example projects.
     - Hardware:
       - Jetson + RealSense + IMU + mic stack:
         - At least one full example pipeline is validated end-to-end (even if simplified).
       - Cloud Ether Lab:
         - Cost example and latency discussion validated against current cloud pricing and constraints at time of writing.

  3) Reproducibility and pedagogy:
     - At least one complete pipeline verified:
       - ROS 2 nodes -> Gazebo sim -> (optionally Isaac perception) -> simple navigationrsions/APIs as needed while planning that section.
    - Always prefer official documentation and vendor docs for technical claims.

  - Referencing:
    - Follow referencing guidance from the constitution:
      - Use official docs and vendor/documentation URLs as primary references.
      - Provide links or clear document names; no strict APA formatting required.
    - When quoting or closely following docs, paraphrase where possible and link to the source.

  - Planning phases:
    Phase 1: Research & scoping
      - Confirm tool and version choices.
      - Finalize in-scope vs out-of-scope boundaries for each module.

    Phase 2: Architecture sketch
      - Define repo structure, Docusaurus setup, and Spec-Kit Plus integration points.
      - Decide folder structure under docs/ and sidebar grouping.

    Phase 3: Section and chapter structure
      - Map course modules and weeks to parts/chapters.
      - Produce a high-level outline with chapter titles, short descriptions, and key topics.

    Phase 4: Validation plan
      - Define what will be actually tested (locally or in the cloud).
      - Define minimal hardware setups to verify (e.g., 1 RTX workstation + 1 Jetson kit).
      - Align acceptance criteria with constitution and /sp.specify success criteria.

  - Output expectations:
    - The /sp.plan result should be a clear, concise planning document that:
      - Can be used to create /sp.book and /sp.chapter.* specs.
      - Can be followed to initialize and structure the Docusaurus repo.
      - Makes key decisions and tradeoffs explicit so future changes remain coherent.
response_text: |
  Created the implementation plan for the Physical AI & Humanoid Robotics book, including:
  - Architecture sketch with repo layout and Docusaurus structure
  - Content structure with modules and chapters
  - Research approach for key technologies (ROS 2, Gazebo, Isaac, etc.)
  - Quality validation plan
  - Key decisions documented for ROS 2 (Humble), Gazebo (Garden), Isaac Sim, hardware specs, and book scope
  - Generated research.md, data-model.md, quickstart.md, and contracts/content-api.yaml
outcome: |
  Plan successfully created with all required components. The implementation approach is clearly defined with specific technology choices, content structure, and validation strategy.
evaluation: |
  All required planning outputs have been generated and key decisions documented. The plan aligns with the constitution and provides a clear path forward for creating the Docusaurus-based book.
---