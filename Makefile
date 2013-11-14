###
# resi Makefile
###


include node_modules/common-makefiles/node.make
include node_modules/common-makefiles/subtool.make

test: jshint mocha

docs: jsdox-extra

readme: docs subtool-readme

readme-git: docs subtool-readme-git

.PHONY: test docs readme readme-git
