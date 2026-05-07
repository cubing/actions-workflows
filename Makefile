.PHONY: check
check: lint


.PHONY: lint
lint: lint-biome lint-tsc

.PHONY: lint-biome
lint-biome: setup
	bun x -- bun-dx --package @biomejs/biome biome -- check

.PHONY: lint-tsc
lint-tsc: setup
	bun x -- bun-dx --package @typescript/native-preview tsgo -- --project ./

.PHONY: format
format: setup
	bun x -- bun-dx --package @biomejs/biome biome -- check --write

.PHONY: setup
setup:
	bun install --frozen-lockfile

.PHONY: install-fish
install-fish: setup
	bun run -- ./script/install-fish.ts

RM_RF = bun -e 'process.argv.slice(1).map(p => process.getBuiltinModule("node:fs").rmSync(p, {recursive: true, force: true, maxRetries: 5}))' --

.PHONY: clean
clean:
	@ # no-op for now

.PHONY: reset
reset: clean
	${RM_RF} ./node_modules/
