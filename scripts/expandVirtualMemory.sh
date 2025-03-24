#!/bin/bash

# Elasticsearch consumes a lot of Virtual Memory, therefore the VM of the OS has to be expanded
echo "Expanding Virtual Memory of the Operating System host's machine"
sudo sysctl -w vm.max_map_count=262144
