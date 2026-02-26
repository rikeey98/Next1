---
description: Automatically create worktrees for multi-agent development
---
# Setup Multi-Agent Worktrees

This workflow automates the creation of git worktrees for the AI agents (Claude, Cursor, Gemini). Let's start!

1. **Verify if you are inside a git repository**
```sh
git rev-parse --is-inside-work-tree
```

2. **Verify you are in the root directory and on the main branch**
```sh
git branch --show-current
git worktree list
```

3. **Check for uncommitted changes**
```sh
git status --porcelain
```

4. **Create the worktrees (one directory back)**
// turbo-all
```sh
git worktree add ../Next1-claude -b agent/claude
git worktree add ../Next1-cursor -b agent/cursor
git worktree add ../Next1-gemini -b agent/gemini
```

5. **List the worktrees to confirm**
```sh
git worktree list
```
