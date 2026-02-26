---
name: Multi-Agent Collaboration
description: Guidelines and instructions for collaborating with other AI agents via Git Worktrees and Feature Branches.
---

# Multi-Agent Collaboration Skill

As an AI agent working on the `Next1` project, you are collaborating in a multi-agent environment alongside Claude, Cursor, and Gemini.

To prevent source code conflicts and ensure seamless parallel development, you must ADHERE to the following guidelines.

## Core Rules

1. **You must work inside YOUR designated Worktree directory**, NOT the main `Next1` directory unless otherwise directed.
   - Claude: `Next1-claude`
   - Cursor: `Next1-cursor` 
   - Gemini: `Next1-gemini`

2. **Branching Strategy**
   - You MUST NOT push or commit directly to the `main` branch.
   - For any new task, create a feature or bugfix branch that follows this naming convention:
     `<your_agent_name>/<type>/<brief-description>`
   - Examples:
     - `claude/feature/auth-login`
     - `gemini/feature/diet-calendar`
     - `cursor/bugfix/ui-error`

3. **Merging Strategy**
   - Upon completing your task, commit the changes to your specific branch.
   - Do NOT merge your branch directly into `main`. Create a Pull Request (PR) for review and integration.

## How to Set Up the Environment

If the user has not yet set up the worktrees, instruct them to run the `/setup-worktrees` slash command, or run the following script in the `Next1` root repository:

```bash
git worktree add ../Next1-claude -b agent/claude
git worktree add ../Next1-cursor -b agent/cursor
git worktree add ../Next1-gemini -b agent/gemini
```
