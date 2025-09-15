# Copilot Instructions for ResearchSite

## Overview
This project is a static website and dynamic API service hosted within the same repository. It contains content for a research site and functions to handle user interactions such as comments.

## Architecture
- The **site** directory holds website assets including `index.html`, `index.txt`, and data files such as `data/documents.json`. It also organizes emails in markdown form under subdirectories (e.g., `emails/2025-09-13/`).
- The **functions/api** directory contains API endpoint implementations such as `comment.js` and `save-comment.js` used to process and store user comments. Note that similar files may exist in multiple locations, so verify the intended source of truth for API logic.
- The root contains a build script (`build.js`) and a `package.json` for dependency management and project orchestration.

## Developer Workflow
- **Build Process:** Use the command `node build.js` to integrate static content and API functions into the final site.
- **Testing & Debugging:** Test changes locally by running the build and checking outputs from both static files and API endpoints.
- **Code Consistency:** Follow project conventions when updating functions. For example, maintain similar patterns in error handling and response formatting in files like `functions/api/comment.js`.

## Project Conventions & Patterns
- **Directory Separation:** Keep static assets in `site/` distinct from dynamic logic in `functions/api/`.
- **Content Organization:** Emails are stored as timestamped markdown files organized by date. Data files are kept in JSON format.
- **Integration Points:** Changes in API logic may require updates in build scripts and site integration; review both `build.js` and relevant API files when making modifications.

## Additional Guidance
- When updating components, reference the specific directories (e.g., `site/`, `functions/api/`) for context.
- Ensure that any refactoring maintains consistency across duplicated code in similar directories.
- This document is intended to provide an immediate productivity overview for AI coding agents within this codebase.

*Please review and provide feedback on any unclear or incomplete sections to iterate further.*
