###
# resi Makefile
###


include node_modules/CommonMakefiles/node.make
include node_modules/CommonMakefiles/subtool.make

test: jshint mocha

docs: jsdox

readme: jsdox subtool-readme

readme-git: jsdox subtool-readme-git

.PHONY: test docs readme readme-git
