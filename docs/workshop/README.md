# Workshop materials

Training material for engineers learning to work with Claude Code, using the Champion
Motors internal portal in this repository as the worked example.

## Contents

| File | What it is |
|---|---|
| [`champion-motors-claude-code-workshop.docx`](champion-motors-claude-code-workshop.docx) | The handout. Thirteen steps from an empty folder to a deployed application, with what each step means and what to watch out for. |

## The thirteen steps

1. Install Claude Code in VS Code
2. Install Node.js
3. Install Git and connect to GitHub
4. Start a Claude Code project
5. Create the `CLAUDE.md` file
6. Create a skill for the brand guidelines
7. Load the `superpowers` and `example-skills` plugins
8. Write the Claude rules
9. Understand brainstorming before building
10. Build the React application conversationally
11. Automate the checks in CI
12. Commit and push
13. Deploy with AWS Amplify

Steps 1–3 are setup, 4–8 give the agent durable context, 9 is process, 10 is the build,
and 11–13 ship it.

## Artifacts referenced by the workshop

Everything the handout points at is in this repository, so each step can be inspected
rather than taken on trust:

- [`CLAUDE.md`](../../CLAUDE.md) — the project memory file (step 5)
- [`.claude/skills/champion-motors-brand-guideline/`](../../.claude/skills/champion-motors-brand-guideline) — the brand skill (step 6)
- [`.claude/settings.json`](../../.claude/settings.json) — enabled plugins (step 7)
- [`.claude/rules/`](../../.claude/rules) — code style, testing and design rules (step 8)
- [`docs/superpowers/specs/`](../superpowers/specs) — the design spec produced by brainstorming (step 9)
- [`.github/workflows/ci.yml`](../../.github/workflows/ci.yml) — the CI pipeline (step 11)
- [`amplify.yml`](../../amplify.yml) — the deployment build spec (step 13)

## Live application

<https://main.d10yr4rzojipa2.amplifyapp.com>

## A note on the outline

The original plan listed Azure DevOps for source control. The project was built on
GitHub with GitHub Actions, and the handout documents what was actually done so every
command is reproducible. The concepts map directly onto Azure DevOps: repository,
pipeline definition, branch policy.
