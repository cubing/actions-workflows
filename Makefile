.PHONY: lint
lint: setup
	bun x -- bun-dx --package @biomejs/biome biome -- check
	bun x -- bun-dx --package typescript tsc -- --project ./

.PHONY: format
format: setup
	bun x -- bun-dx --package @biomejs/biome biome -- check --write

.PHONY: setup
setup:
	bun install --frozen-lockfile

.PHONY: install-fish
install-fish: setup
	bun run -- ./script/install-fish.ts

.PHONY: clean
clean:
	# no-op

.PHONY: reset
reset: clean
	rm -rf ./node_modules/
