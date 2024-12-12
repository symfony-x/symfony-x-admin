#!/bin/bash

echo "Setting up Symfony-X"
set -e

echo "Building Docker containers..."
docker-compose up --build -d

echo "Docker containers built and are running"
