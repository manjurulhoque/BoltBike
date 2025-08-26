#!/usr/bin/env python3
"""
Test runner script for the e-bike rental platform.
Provides easy access to different testing scenarios and options.
"""
import os
import sys
import subprocess
import argparse
from pathlib import Path


def run_command(command, description):
    """Run a command and handle errors."""
    print(f"\n{'='*60}")
    print(f"Running: {description}")
    print(f"Command: {' '.join(command)}")
    print('='*60)
    
    try:
        result = subprocess.run(command, check=True, capture_output=False)
        print(f"\n✅ {description} completed successfully!")
        return True
    except subprocess.CalledProcessError as e:
        print(f"\n❌ {description} failed with exit code {e.returncode}")
        return False
    except FileNotFoundError:
        print(f"\n❌ Command not found. Make sure you're in the backend directory.")
        return False


def main():
    parser = argparse.ArgumentParser(description="E-Bike Rental Platform Test Runner")
    parser.add_argument(
        "--type", 
        choices=["unit", "integration", "api", "models", "views", "serializers", "all"],
        default="all",
        help="Type of tests to run"
    )
    parser.add_argument(
        "--coverage", 
        action="store_true",
        help="Run with coverage report"
    )
    parser.add_argument(
        "--parallel", 
        action="store_true",
        help="Run tests in parallel"
    )
    parser.add_argument(
        "--html", 
        action="store_true",
        help="Generate HTML coverage report"
    )
    parser.add_argument(
        "--verbose", 
        action="store_true",
        help="Verbose output"
    )
    parser.add_argument(
        "--fast", 
        action="store_true",
        help="Fast mode (skip slow tests)"
    )
    
    args = parser.parse_args()
    
    # Ensure we're in the backend directory
    if not Path("manage.py").exists():
        print("❌ Please run this script from the backend directory")
        sys.exit(1)
    
    # Build pytest command
    pytest_cmd = ["python", "-m", "pytest"]
    
    # Add markers based on test type
    if args.type != "all":
        pytest_cmd.extend(["-m", args.type])
    
    # Add coverage if requested
    if args.coverage:
        pytest_cmd.extend(["--cov=.", "--cov-report=term-missing"])
        if args.html:
            pytest_cmd.extend(["--cov-report=html"])
    
    # Add parallel execution if requested
    if args.parallel:
        pytest_cmd.extend(["-n", "auto"])
    
    # Add verbose output if requested
    if args.verbose:
        pytest_cmd.extend(["-v", "-s"])
    
    # Skip slow tests if fast mode
    if args.fast:
        pytest_cmd.extend(["-m", "not slow"])
    
    # Add test discovery paths
    pytest_cmd.extend([
        "tests/",
        "users/",
        "bikes/",
        "bookings/",
        "payments/",
        "ratings/",
        "favorites/",
        "core/",
    ])
    
    # Run the tests
    success = run_command(pytest_cmd, f"Running {args.type} tests")
    
    if not success:
        print("\n💡 Tips for troubleshooting:")
        print("1. Make sure all dependencies are installed: pip install -r requirements-test.txt")
        print("2. Check that your database is running and accessible")
        print("3. Verify your Django settings are correct")
        print("4. Try running with --verbose for more details")
        sys.exit(1)
    
    print("\n🎉 All tests completed successfully!")
    
    # Show coverage summary if generated
    if args.coverage and args.html:
        coverage_dir = Path("htmlcov")
        if coverage_dir.exists():
            print(f"\n📊 HTML coverage report generated in: {coverage_dir.absolute()}")
            print("   Open index.html in your browser to view the report")


if __name__ == "__main__":
    main()
