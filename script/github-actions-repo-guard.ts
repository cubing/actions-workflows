#!/usr/bin/env -S bun run --

import { env, exit } from "node:process";

const ALLOWED_REPOS = new Set(["cubing/actions-workflows"]);

const { GITHUB_REPOSITORY } = env;

if (!GITHUB_REPOSITORY) {
  console.error("Must run with `$GITHUB_REPOSITORY` set.");
  exit(2);
}

console.log(`Repo detected as: ${GITHUB_REPOSITORY}`);

if (!ALLOWED_REPOS.has(GITHUB_REPOSITORY)) {
  console.log(
    `::error::Workflow is only for: ${Array.from(ALLOWED_REPOS)
      .map((repo) => `\`${repo}\``)
      .join(
        ", ",
      )}. See https://github.com/cubing/actions-workflows#publish-github-release for info on how to use the workflow in another repo.`,
  );
  exit(1);
}
