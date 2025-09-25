#!/usr/bin/env bash

npm install --prefix ./build_template

cp -r ./build_template/. ./packages/exupery-core-alg/build
cp -r ./build_template/. ./packages/exupery-core-bin/build
cp -r ./build_template/. ./packages/exupery-core-data/build
cp -r ./build_template/. ./packages/exupery-core-dev/build
cp -r ./build_template/. ./packages/exupery-core-internals/build
cp -r ./build_template/. ./packages/exupery-core-types/build
cp -r ./build_template/. ./packages/exupery-core-resources/build
