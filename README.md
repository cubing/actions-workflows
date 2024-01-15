# GitHub Actions workflows

[Reusable GitHub Actions workflows](https://docs.github.com/en/actions/using-workflows/reusing-workflows) for https://github.com/cubing projects.

## Publish GitHub release

Automatically publisheds a [GitHub release](https://docs.github.com/en/repositories/releasing-projects-on-github/managing-releases-in-a-repository) when a tag starting with `v` (e.g. `v0.1.3`) is pushed. This allows the latest release to show up in the sidebar of the project page on GitHub.

Usage:

```shell
# bash
cat << CONTENTS > ./.github/workflows/publish-github-release.yaml
name: Publish GitHub release

on:
  push:
    tags:
      - v*

jobs:
  Publish:
    permissions:
      contents: write
    if: startsWith(github.ref, 'refs/tags/v')
    uses: cubing/actions-workflows/.github/workflows/publish-github-release.yaml@main
CONTENTS
```
