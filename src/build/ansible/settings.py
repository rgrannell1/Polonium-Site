#!/usr/bin/python

import os
import json
import sh




constants = {
	"paths": {
		"root": os.path.abspath(os.path.join(os.path.dirname(__file__), "../../.."))
	}
}

constants["paths"]["config"] = os.path.join(constants["paths"]["root"], "config")




def load_config (node_env):

	if not node_env:
		node_env = "development"

	config_stdout = sh.node(constants["paths"]["config"] + "/utils/display-config.js")
	config = json.loads(config_stdout.stdout.decode( ))





load_config(os.environ.get("NODE_ENV"))
