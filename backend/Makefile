.PHONY: help install test test-coverage test-fast test-parallel lint format clean migrate superuser run

# Default target
help:
	@echo "E-Bike Rental Platform - Available Commands:"
	@echo ""
	@echo "Development:"
	@echo "  install          Install all dependencies"
	@echo "  run              Start development server"
	@echo "  migrate          Run database migrations"
	@echo "  superuser        Create superuser account"
	@echo ""
	@echo "Testing:"
	@echo "  test             Run all tests"
	@echo "  test-coverage    Run tests with coverage report"
	@echo "  test-fast        Run tests (skip slow tests)"
	@echo "  test-parallel    Run tests in parallel"
	@echo "  test-unit        Run unit tests only"
	@echo "  test-integration Run integration tests only"
	@echo "  test-api         Run API tests only"
	@echo ""
	@echo "Code Quality:"
	@echo "  lint             Run linting checks"
	@echo "  format           Format code with black and isort"
	@echo "  clean            Clean up cache and temporary files"
	@echo ""
	@echo "Examples:"
	@echo "  make test-coverage    # Run tests with coverage"
	@echo "  make test-fast        # Quick test run"
	@echo "  make format           # Format code"

# Install dependencies
install:
	@echo "Installing dependencies..."
	pip install -r requirements.txt
	pip install -r requirements-test.txt

# Database operations
migrate:
	@echo "Running database migrations..."
	python manage.py makemigrations
	python manage.py migrate

superuser:
	@echo "Creating superuser account..."
	python manage.py createsuperuser

# Development server
run:
	@echo "Starting development server..."
	python manage.py runserver

# Testing commands
test:
	@echo "Running all tests..."
	python -m pytest -v

test-coverage:
	@echo "Running tests with coverage..."
	python -m pytest --cov=. --cov-report=html --cov-report=term-missing --cov-fail-under=80

test-fast:
	@echo "Running fast tests (skipping slow tests)..."
	python -m pytest -m "not slow" -v

test-parallel:
	@echo "Running tests in parallel..."
	python -m pytest -n auto -v

test-unit:
	@echo "Running unit tests..."
	python -m pytest -m unit -v

test-integration:
	@echo "Running integration tests..."
	python -m pytest -m integration -v

test-api:
	@echo "Running API tests..."
	python -m pytest -m api -v

test-models:
	@echo "Running model tests..."
	python -m pytest -m models -v

test-views:
	@echo "Running view tests..."
	python -m pytest -m views -v

test-serializers:
	@echo "Running serializer tests..."
	python -m pytest -m serializers -v

# Code quality
lint:
	@echo "Running linting checks..."
	flake8 .
	black --check .
	isort --check-only .

format:
	@echo "Formatting code..."
	black .
	isort .

# Cleanup
clean:
	@echo "Cleaning up..."
	find . -type f -name "*.pyc" -delete
	find . -type d -name "__pycache__" -delete
	find . -type d -name "*.egg-info" -exec rm -rf {} +
	find . -type d -name ".pytest_cache" -exec rm -rf {} +
	find . -type d -name "htmlcov" -exec rm -rf {} +
	find . -type f -name ".coverage" -delete
	@echo "Cleanup complete!"

# Test runner script
test-runner:
	@echo "Using test runner script..."
	python run_tests.py --coverage --html --verbose

# Quick development workflow
dev: install migrate
	@echo "Development environment ready!"
	@echo "Run 'make run' to start the server"
	@echo "Run 'make test' to run tests"

# CI/CD pipeline
ci: lint test-coverage
	@echo "CI pipeline completed successfully!"
