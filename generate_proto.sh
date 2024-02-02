#!/bin/bash

# Generate the JavaScript files from the proto file
./node_modules/.bin/grpc_tools_node_protoc \
  --js_out=import_style=commonjs,binary:./proto \
  --grpc_out=./proto \
  --plugin=protoc-gen-grpc=./node_modules/.bin/grpc_tools_node_protoc_plugin \
  ./proto/*.proto