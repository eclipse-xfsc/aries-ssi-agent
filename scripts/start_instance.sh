#!/usr/bin/env bash

# Define base port numbers and service names for easier reference
base_SCHEMA_MANAGER_PORT=5001
base_CONNECTION_MANAGER_PORT=5002
base_CREDENTIAL_MANAGER=5003
base_PROOF_MANAGER_PORT=5004
base_DID_MANAGER_PORT=5005
base_TENANT_MANAGER_PORT=5006
base_SSI_PORT=5007
base_SSI_AGENT_PORT=5008
base_NATS_PORT=5009
base_NATS_MONITORING_PORT=5010
base_S3_PORT=5011
base_S3_CONSOLE_PORT=5012
base_POSTGRES_PORT=5013

# Initialize docker_compose_options as an empty string
docker_compose_options=""

# Parse command-line arguments
while [[ "$#" -gt 0 ]]; do
    case $1 in
        --rebuild) docker_compose_options="--build";;
        *) echo "Unknown parameter passed: $1"; exit 1;;
    esac
    shift
done

# Step 0: Create a Docker network if it doesn't exist yet
network_name="ocm-network"
if ! docker network inspect $network_name >/dev/null 2>&1; then
    echo "Creating Docker network: $network_name"
    docker network create $network_name >/dev/null
fi

# Step 1: Get all running Docker Compose instances and extract the project numbers
running_instances=$(docker compose ls --format json | jq -r '.[].Name')
max_number=0
for name in $running_instances; do
    if [[ $name =~ ocm-([0-9]+) ]]; then
        number=${BASH_REMATCH[1]}
        if (( number > max_number )); then
            max_number=$number
        fi
    fi
done

# Step 2: Calculate new number
new_number=$((max_number + 1))

# Calculate new port numbers based on new_number
increment=$((new_number * 100))

# Set the project name
project_name="ocm-$new_number"

# Export the new port numbers
export SCHEMA_MANAGER_PORT=$((base_SCHEMA_MANAGER_PORT + increment))
export CONNECTION_MANAGER_PORT=$((base_CONNECTION_MANAGER_PORT + increment))
export CREDENTIAL_MANAGER=$((base_CREDENTIAL_MANAGER + increment))
export PROOF_MANAGER_PORT=$((base_PROOF_MANAGER_PORT + increment))
export DID_MANAGER_PORT=$((base_DID_MANAGER_PORT + increment))
export TENANT_MANAGER_PORT=$((base_TENANT_MANAGER_PORT + increment))
export SSI_PORT=$((base_SSI_PORT + increment))
export SSI_AGENT_HOST="http://${project_name}-ssi-abstraction-1"
export SSI_AGENT_PORT=$((base_SSI_AGENT_PORT + increment))
export NATS_PORT=$((base_NATS_PORT + increment))
export NATS_MONITORING_PORT=$((base_NATS_MONITORING_PORT + increment))
export S3_PORT=$((base_S3_PORT + increment))
export S3_CONSOLE_PORT=$((base_S3_CONSOLE_PORT + increment))
export POSTGRES_PORT=$((base_POSTGRES_PORT + increment))

# Proceed with starting the instance
docker compose -p $project_name up -d $docker_compose_options

# Output the ports in a tabular view after the instance has started
echo
echo "Port Assignments for $project_name:"
echo
printf "%-25s %-10s\n" "VARIABLE" "PORT"
printf '%-25s %-10s\n' '-------------------------' '----------'
printf "%-25s %-10s\n" SCHEMA_MANAGER_PORT $SCHEMA_MANAGER_PORT
printf "%-25s %-10s\n" CONNECTION_MANAGER_PORT $CONNECTION_MANAGER_PORT
printf "%-25s %-10s\n" CREDENTIAL_MANAGER $CREDENTIAL_MANAGER
printf "%-25s %-10s\n" PROOF_MANAGER_PORT $PROOF_MANAGER_PORT
printf "%-25s %-10s\n" DID_MANAGER_PORT $DID_MANAGER_PORT
printf "%-25s %-10s\n" TENANT_MANAGER_PORT $TENANT_MANAGER_PORT
printf "%-25s %-10s\n" SSI_PORT $SSI_PORT
printf "%-25s %-10s\n" SSI_AGENT_PORT $SSI_AGENT_PORT
printf "%-25s %-10s\n" NATS_PORT $NATS_PORT
printf "%-25s %-10s\n" NATS_MONITORING_PORT $NATS_MONITORING_PORT
printf "%-25s %-10s\n" S3_PORT $S3_PORT
printf "%-25s %-10s\n" S3_CONSOLE_PORT $S3_CONSOLE_PORT
printf "%-25s %-10s\n" POSTGRES_PORT $POSTGRES_PORT
