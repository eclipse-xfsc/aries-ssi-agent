#!/usr/bin/env bash

network_name="ocm-network"

# Function to stop a Docker Compose project
stop_docker_compose_project() {
    local project_name=$1
    
    # Check if the project is running
    if docker compose -p "$project_name" ps &>/dev/null; then
        echo "Stopping Docker Compose project: $project_name"
        docker compose -p "$project_name" down
    else
        echo "Error: Docker Compose project $project_name is not running."
    fi
}

# Function to stop all running Docker Compose projects
stop_all_docker_compose_projects() {
    for project_name in "${running_projects[@]}"; do
        echo "Stopping Docker Compose project: $project_name"
        docker compose -p "$project_name" down
    done
}

# If "all" is provided as an argument
if [ "$1" == "all" ]; then
    # Get all running Docker Compose instances
    running_instances=$(docker compose ls --format json | jq -r '.[].Name')
    running_projects=()

    for name in $running_instances; do
        if [[ $name =~ ocm-([0-9]+) ]]; then
            running_projects+=("$name")
        fi
    done

    if [ ${#running_projects[@]} -eq 0 ]; then
        echo "Error: There are no running OCM instances to stop."
    else
        stop_all_docker_compose_projects
    fi
elif [ "$#" -eq 1 ]; then
    # If a specific project number is provided as an argument
    stop_docker_compose_project "ocm-$1"
else
    # Get all running Docker Compose instances
    running_instances=$(docker compose ls --format json | jq -r '.[].Name')
    running_projects=()

    for name in $running_instances; do
        if [[ $name =~ ocm-([0-9]+) ]]; then
            running_projects+=("$name")
        fi
    done

    # Determine the action based on the number of running projects
    case ${#running_projects[@]} in
        0)
            echo "Error: There are no running OCM instances."
            ;;
        1)
            echo "Only one OCM instance is running: ${running_projects[0]}"
            read -p "Are you sure you want to stop it? (Y/n): " confirmation
            confirmation="${confirmation:-y}" # Default to 'y' if no input
            if [[ $confirmation =~ ^[Yy]$ ]]; then
                stop_docker_compose_project "${running_projects[0]}"
            else
                echo "Operation cancelled."
            fi
            ;;
        *)
            echo "Multiple OCM instances are running. Please choose one to stop:"
            select project_name in "${running_projects[@]}"; do
                if [[ " ${running_projects[*]} " =~ " ${project_name} " ]]; then
                    stop_docker_compose_project "$project_name"
                    break
                else
                    echo "Invalid selection. Please try again."
                fi
            done
            ;;
    esac
fi

# Get all running Docker Compose instances
running_instances=$(docker compose ls --format json | jq -r '.[].Name')
running_projects=()

for name in $running_instances; do
    if [[ $name =~ ocm-([0-9]+) ]]; then
        running_projects+=("$name")
    fi
done

if [ ${#running_projects[@]} -eq 0 ]; then
    # Remove the network if there are no running instances
    echo "Removing Docker network: $network_name"
    docker network rm $network_name &>/dev/null
fi
