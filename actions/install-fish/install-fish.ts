#!/usr/bin/env -S bun run --

/**
 * Note: this file does not use any run-time dependencies, only `bun` built-ins.
 * This is less ergonomic, but it allows running the script directly, which in
 * turn means fewer opportunities for things to go wrong.
 */

import assert from "node:assert";
import { mkdir, mkdtemp, readFile, rename } from "node:fs/promises";
import { arch, homedir, platform, tmpdir } from "node:os";
import { join } from "node:path";
import { exit } from "node:process";
import { $, write } from "bun";

const BIN_INSTALLATION_DIR = join(
  homedir(),
  "./.local/share/actions/cubing/install-fish/bin",
);
const BIN_INSTALLATION_PATH = join(BIN_INSTALLATION_DIR, "./fish");

const metadata: { [version: string]: { url: string; hash: string } } = {
  "4.6.0": {
    url: "https://github.com/fish-shell/fish-shell/releases/download/4.6.0/fish-4.6.0-linux-x86_64.tar.xz",
    hash: "497c9c4e3fb3c006fe9d2c9a5a5447c1c90490b6b4ce6bfaf75e53b495c82f36",
  },
};

async function installFish(version: string = "4.6.0"): Promise<void> {
  assert(metadata[version]);
  const { url, hash } = metadata[version];

  assert.equal(platform(), "linux");
  assert.equal(arch(), "x64");

  try {
    await $`fish --version`;
    console.log("Able to execute `fish`. Skipping installation.");
    exit(0);
  } catch {
    console.log("Unable to execute `fish`. Proceeding with installation.");
  }

  const tempDir = await mkdtemp(join(tmpdir(), "install-fish-"));
  const tempArchive = join(tempDir, "./fish.tar.xz");
  await write(tempArchive, await fetch(url));
  assert.equal(
    new Uint8Array(
      await globalThis.crypto.subtle.digest(
        "SHA256",
        // The `new Uint8Array(…)` is not necessary, but it makes the type checker happy.
        new Uint8Array(await readFile(tempArchive)),
      ),
    ).toHex(),
    hash,
  );

  await $`cd ${tempDir} && tar -xJvf ${tempArchive}`;
  await mkdir(BIN_INSTALLATION_DIR, { recursive: true });
  await rename(join(tempDir, "fish"), BIN_INSTALLATION_PATH);

  console.log("Installed fish version:");
  await $`fish --version`;
}

await installFish();
