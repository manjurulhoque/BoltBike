# Testing Guide for E-Bike Rental Platform

This document provides comprehensive guidance for testing the e-bike rental platform backend using pytest and Django.

## 🚀 Quick Start

### Prerequisites
- Python 3.8+
- PostgreSQL database
- Virtual environment activated

### Installation
```bash
# Install testing dependencies
pip install -r requirements-test.txt

# Or use make
make install
```

### Run Tests
```bash
# Run all tests
make test

# Run with coverage
make test-coverage

# Run specific test types
make test-models
make test-views
make test-serializers

# Use the test runner script
python run_tests.py --coverage --html
```

## 📋 Test Structure

### Test Organization
```
backend/
├── tests/
│   ├── __init__.py
│   ├── conftest.py          # Shared fixtures and configuration
│   ├── test_models.py       # Model tests
│   ├── test_views.py        # View/API tests
│   └── test_serializers.py  # Serializer tests
├── users/tests.py           # App-specific tests
├── bikes/tests.py
├── bookings/tests.py
├── pytest.ini              # Pytest configuration
├── pyproject.toml          # Project configuration
└── run_tests.py            # Test runner script
```

### Test Categories
- **Unit Tests** (`@pytest.mark.unit`): Test individual functions and methods
- **Integration Tests** (`@pytest.mark.integration`): Test component interactions
- **API Tests** (`@pytest.mark.api`): Test API endpoints
- **Model Tests** (`@pytest.mark.models`): Test Django models
- **View Tests** (`@pytest.mark.views`): Test Django views
- **Serializer Tests** (`@pytest.mark.serializers`): Test DRF serializers

## 🧪 Test Fixtures

### Core Fixtures
- `api_client`: Unauthenticated API client
- `authenticated_user_client`: Authenticated client for regular users
- `authenticated_owner_client`: Authenticated client for bike owners
- `user`, `owner`: Test user instances
- `bike`: Test bike instance
- `booking`: Test booking instance
- `multiple_bikes`, `multiple_users`: Multiple test instances

### Usage Example
```python
def test_create_bike(authenticated_owner_client, bike_data):
    """Test creating a bike as an owner."""
    url = reverse("bikes:bike-list")
    response = authenticated_owner_client.post(url, bike_data, format="json")
    
    assert response.status_code == status.HTTP_201_CREATED
    assert response.data["title"] == bike_data["title"]
```

## 🎯 Writing Tests

### Test Naming Convention
- Test files: `test_*.py`
- Test classes: `Test*`
- Test methods: `test_*`

### Test Structure
```python
@pytest.mark.models
@pytest.mark.bike
class TestBikeModel:
    """Test cases for the Bike model."""

    def test_create_bike(self, bike, owner):
        """Test creating a bike."""
        assert bike.owner == owner
        assert bike.title == "Test E-Bike"
        assert bike.bike_type == BikeType.CITY
```

### Assertions
Use clear, descriptive assertions:
```python
# Good
assert response.status_code == status.HTTP_201_CREATED
assert len(response.data["results"]) == 3

# Avoid
assert response.status_code == 201
assert len(response.data["results"]) > 0
```

## 📊 Coverage and Reporting

### Coverage Configuration
- Minimum coverage: 80%
- HTML reports generated in `htmlcov/` directory
- Terminal coverage with missing lines

### Generate Coverage Report
```bash
# Run with coverage
make test-coverage

# View HTML report
open htmlcov/index.html
```

## 🔧 Test Configuration

### Pytest Settings
```ini
[tool:pytest]
DJANGO_SETTINGS_MODULE = backend.settings
addopts = --strict-markers --verbose --tb=short --cov=. --cov-report=html
markers = [unit, integration, api, models, views, serializers]
testpaths = [tests, users, bikes, bookings, payments, ratings, favorites, core]
```

### Environment Variables
```bash
# Database settings for testing
export DB_NAME=ebike_rent_test
export DB_USER=postgres
export DB_PASSWORD=postgres
export DB_HOST=localhost
export DB_PORT=5432

# Django settings
export DJANGO_SECRET_KEY=test-secret-key
export DJANGO_DEBUG=True
```

## 🚦 Running Tests

### Basic Commands
```bash
# Run all tests
pytest

# Run specific test file
pytest tests/test_models.py

# Run specific test class
pytest tests/test_models.py::TestBikeModel

# Run specific test method
pytest tests/test_models.py::TestBikeModel::test_create_bike
```

### Advanced Options
```bash
# Run with markers
pytest -m models          # Only model tests
pytest -m "not slow"      # Skip slow tests
pytest -m "unit or api"   # Unit or API tests

# Parallel execution
pytest -n auto

# Generate HTML report
pytest --html=report.html

# Stop on first failure
pytest -x

# Show local variables on failure
pytest -l
```

### Using Make Commands
```bash
make test                 # Run all tests
make test-coverage        # Tests with coverage
make test-fast           # Skip slow tests
make test-parallel       # Parallel execution
make test-unit           # Unit tests only
make test-integration    # Integration tests only
make test-api            # API tests only
```

## 🧹 Code Quality

### Linting
```bash
# Check code style
make lint

# Format code
make format

# Clean up
make clean
```

### Pre-commit Hooks
```bash
# Install pre-commit hooks
pre-commit install

# Run all hooks
pre-commit run --all-files
```

## 🔍 Debugging Tests

### Verbose Output
```bash
pytest -v -s
```

### Debugging Failed Tests
```bash
# Run specific failing test with debugger
pytest tests/test_views.py::TestBikeViews::test_create_bike -s --pdb

# Show local variables
pytest -l
```

### Database Inspection
```python
# In test methods, you can inspect the database
def test_something(self, db):
    from bikes.models import Bike
    bikes = Bike.objects.all()
    print(f"Found {bikes.count()} bikes")
```

## 📈 Performance Testing

### Large Dataset Testing
```python
@pytest.mark.slow
def test_performance_with_large_dataset(self, large_dataset):
    """Test performance with 100 bikes."""
    start_time = time.time()
    response = self.client.get(reverse("bikes:bike-list"))
    end_time = time.time()
    
    assert response.status_code == 200
    assert (end_time - start_time) < 1.0  # Should complete in under 1 second
```

### Database Query Optimization
```python
def test_optimized_queries(self, multiple_bikes):
    """Test that queries are optimized."""
    with self.assertNumQueries(2):  # Should use only 2 queries
        response = self.client.get(reverse("bikes:bike-list"))
        assert response.status_code == 200
```

## 🚨 Common Issues and Solutions

### Database Connection Issues
```bash
# Ensure PostgreSQL is running
sudo systemctl status postgresql

# Check database settings
python manage.py dbshell
```

### Import Errors
```bash
# Ensure you're in the backend directory
cd backend

# Check Python path
export PYTHONPATH="${PYTHONPATH}:$(pwd)"
```

### Test Isolation Issues
```python
# Use database transactions
@pytest.mark.django_db(transaction=True)
def test_with_transaction(self):
    # Test code here
    pass
```

## 📚 Best Practices

### 1. Test Organization
- Group related tests in classes
- Use descriptive test names
- Follow the Arrange-Act-Assert pattern

### 2. Fixture Management
- Keep fixtures simple and focused
- Use factory patterns for complex objects
- Clean up resources properly

### 3. Assertions
- Test one thing per test method
- Use specific assertions
- Provide meaningful error messages

### 4. Test Data
- Use realistic test data
- Avoid hardcoded values
- Use factories for complex objects

### 5. Performance
- Keep tests fast
- Use database transactions appropriately
- Mock external services

## 🔄 Continuous Integration

### GitHub Actions Example
```yaml
name: Tests
on: [push, pull_request]
jobs:
  test:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v2
      - name: Set up Python
        uses: actions/setup-python@v2
        with:
          python-version: 3.11
      - name: Install dependencies
        run: |
          pip install -r requirements-test.txt
      - name: Run tests
        run: |
          make test-coverage
```

## 📖 Additional Resources

- [Django Testing Documentation](https://docs.djangoproject.com/en/stable/topics/testing/)
- [pytest Documentation](https://docs.pytest.org/)
- [pytest-django Documentation](https://pytest-django.readthedocs.io/)
- [Django REST Framework Testing](https://www.django-rest-framework.org/api-guide/testing/)

## 🤝 Contributing

When adding new tests:
1. Follow the existing naming conventions
2. Add appropriate markers
3. Ensure good coverage
4. Update this documentation if needed
5. Run the full test suite before submitting

---

**Happy Testing! 🚴‍♂️✨**
