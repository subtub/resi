###
# RecursiveContentInclude Makefile
###


COMMON_MAKEFILES_PATH=node_modules/CommonMakefiles
include $(COMMON_MAKEFILES_PATH)/index.make
include $(COMMON_MAKEFILES_PATH)/node/all.make
include $(COMMON_MAKEFILES_PATH)/subtub/subtool.make

test: jshint mocha

docs: jsdox

readme: jsdox subtool-readme

readme-git: jsdox subtool-readme-git

.PHONY: test docs readme readme-git
