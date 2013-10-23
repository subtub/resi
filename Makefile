###
# RecursiveContentInclude Makefile
###


COMMON_MAKEFILES_PATH=node_modules/CommonMakefiles
include $(COMMON_MAKEFILES_PATH)/index.make
include $(COMMON_MAKEFILES_PATH)/node/all.make
include $(COMMON_MAKEFILES_PATH)/subtub/subtool.make

docs: jsdox

readme: jsdox subtool-readme

.PHONY: docs readme
