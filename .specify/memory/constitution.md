<!--
Sync Impact Report:
Version change: 1.0.0 --> 1.0.0 (No semantic changes, just initial fill)
Modified principles: None (initial fill)
Added sections: None (initial fill)
Removed sections: None
Templates requiring updates:
- .specify/templates/plan-template.md: ✅ updated
- .specify/templates/spec-template.md: ✅ updated
- .specify/templates/tasks-template.md: ✅ updated
- .specify/templates/commands/sp.phr.md: ✅ updated
- .specify/templates/commands/sp.constitution.md: ✅ updated
Follow-up TODOs: None
-->
# AI/Spec-Driven Technical Book Constitution

## Core Principles

### I. Spec-First Workflow
Every chapter, section, and major feature MUST be defined in `/sp.*` spec files before being implemented. This ensures a clear understanding of requirements and design before coding begins.

### II. Single Source of Truth
Specs and the existing repository structure ARE authoritative. This means avoiding inventing undocumented features or configuration, and always referring to the defined specs and codebase for truth.

### III. Technical Accuracy
All technical explanations, commands, and configuration MUST be correct and verifiable from primary sources (official docs, standards). This principle ensures the book's reliability and trustworthiness.

### IV. Consistency
Maintain a coherent structure, tone, terminology, and formatting across all chapters and pages. This is crucial for a professional and easy-to-read technical book.

### V. Reproducibility
Readers MUST be able to reproduce any setup, example, or workflow described in the book. This principle is vital for a practical technical guide, ensuring readers can follow along and learn effectively.

### VI. Incremental Evolution
Prefer iterative refinement of existing content and structure instead of large, uncoordinated rewrites. This approach promotes continuous improvement and manageable changes.

## Key Standards

### Tech Stack
Docusaurus (v3+), React, MD/MDX, Node.js (LTS). These technologies form the foundation of the book's development and deployment.

### Hosting
GitHub Pages with GitHub Actions CI/CD. This standard ensures automated and reliable deployment of the book.

### Project Structure
- Content in `/docs` (and subdirectories) as Markdown/MDX files with proper frontmatter.
- Static assets (images/media) in `/static` or clearly defined assets directories.
- Site configuration in `docusaurus.config.*` and sidebar structure in `sidebars.*`.
This structure provides a clear and organized way to manage the book's content and configuration.

### Writing Style
- Audience: technical readers (students and developers) with basic web/CLI experience.
- Clarity: concrete, example-driven explanations; avoid unnecessary jargon.
- Reading level: approximately Flesch-Kincaid grade 9–12.
- Voice: direct, instructional, and objective; avoid marketing tone.
These guidelines ensure the book is accessible, informative, and engaging for its target audience.

### Referencing
Use official documentation (e.g., Docusaurus, GitHub Pages, Node.js) as primary reference for technical claims. When citing external tools or standards, include URLs or clear pointers so readers can verify and explore further. This maintains the book's authority and allows readers to delve deeper into topics.

### Tooling
Use Spec-Kit Plus for all spec files (`/sp.constitution`, `/sp.book`, `/sp.chapter.*`, etc.). Use Claude Code for code and content generation/editing, respecting this constitution and all specs. Maintain consistent formatting (Markdown/MDX conventions; Prettier-style code formatting in examples). This ensures a standardized and efficient development workflow.

### Navigation and UX
Sidebar-driven navigation that mirrors the logical structure of the book. Next/Previous links enabled for linear reading. Dark/Light mode support through Docusaurus theme options. These standards enhance the user experience and readability of the book.

## Constraints

### Book Structure
Target 8–15 main chapters, each optionally split into multiple sections/pages. Each chapter page should be focused on a single coherent topic. This provides a clear framework for the book's content.

### Content Format
Use Markdown/MDX only for content pages; avoid custom React components unless clearly justified. All code blocks MUST specify language for syntax highlighting (e.g., ```bash, ```js, ```ts, ```json). This ensures consistent and correctly rendered content.

### Build and Deployment
The site MUST build locally with `npm install` and `npm run build` with zero errors. Deployment MUST be automated via GitHub Actions to GitHub Pages. No reliance on server-side logic; everything MUST work as a static site. These constraints guarantee a robust and deployable product.

### Assets
Use only properly licensed or self-created images/media. Optimize images for the web; prefer modern formats (WebP/optimized PNG/JPEG). Reference assets with relative paths that work in the built static site. These guidelines ensure legal compliance and optimal performance.

### Safety and Integrity
No inclusion of secrets, tokens, or sensitive personal data. No plagiarism; any reused text MUST be paraphrased or quoted with attribution. Avoid hallucinating APIs, configuration options, or tools that do not exist in official docs. These are critical for maintaining security, ethical standards, and accuracy.

## Governance
This Constitution supersedes all other project practices. Amendments require documentation, approval, and a migration plan. All PRs/reviews MUST verify compliance. Complexity MUST be justified.

**Version**: 1.0.0 | **Ratified**: 2025-12-07 | **Last Amended**: 2025-12-07