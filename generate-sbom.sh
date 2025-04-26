#!/usr/bin/env bash

set -e

# Build the images
docker compose -p ocm build

# Get images names
images=$(docker compose -p ocm config --images | grep '^ocm-')

# Generate SBOM for each image
for image in $images; do
    # Extract the service name by removing 'ocm-' prefix
    service_name=${image#ocm-}
    # Execute syft command for each image
    echo "Generating SBOM for ${service_name}. Image name: ${image} Output file: apps/${service_name}/sbom.spdx.json"
    syft $image -o spdx-json=apps/${service_name}/sbom.spdx.json
done
