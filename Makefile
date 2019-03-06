.PHONY: help gh-pages docs push-docs

CURRENT_VERSION := $(shell node docs/current-version.js)
DOCS_DIR := ./docs-build/$(CURRENT_VERSION)

help:
	@echo 'Makefile for `promise-utils` package'
	@echo ''
	@echo 'Usage:'
	@echo '   make gh-pages    Checkout `gh-pages` in `docs-build/`'
	@echo '   make docs        Generate the documentation in `docs-build/`'
	@echo '   make push-docs   Push the documentation to Github'
	@echo ''

gh-pages:
	rm -fr ./docs-build/  # Clean up old state
	git worktree prune  # Clean up old state
	git fetch origin  # Make sure up to date.
	git worktree add --checkout ./docs-build/ gh-pages

docs:
	# Make sure `npm ci` is run.
	[ -d ./node_modules ] || npm ci

	rm -rf $(DOCS_DIR)

	# Generate new docs.
	./node_modules/.bin/typedoc \
	  --excludeNotExported \
	  --excludePrivate \
	  --readme none \
	  --mode file \
	  --out $(DOCS_DIR) \
	  ./src

push-docs: gh-pages docs
	# Remove latest and place newly generated docs there.
	rm -fr ./docs-build/latest/
	cp -r $(DOCS_DIR) ./docs-build/latest/

	# Update `versions.json` in `docs-build`.
	node docs/update-versions.js $(CURRENT_VERSION)

	# `git` add all updated paths
	(cd ./docs-build/ && \
	  git add versions.json && \
	  git add $(CURRENT_VERSION) && \
	  git add latest)

	# `git` push all the updates to the remote
	cd ./docs-build/ && \
	  git push origin gh-pages
