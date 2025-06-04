# E-Bike Rental Platform

A comprehensive peer-to-peer e-bike rental platform built with Django REST Framework and React. This platform allows users to list their e-bikes for rent and discover available e-bikes in their area.

## ✨ Features

### 🚴‍♂️ For Bike Owners
- **Easy Bike Listing**: Add your e-bike with detailed specifications, photos, and pricing
- **Inventory Management**: View and manage all your listed bikes in one place
- **Status Control**: Toggle bike availability (available/unavailable/maintenance)
- **Earnings Tracking**: Monitor your rental income and booking history

### 🔍 For Renters
- **Advanced Search & Filtering**: Find bikes by location, type, price range, and battery range
- **Multiple View Modes**: Browse bikes in grid, list, or map view
- **Detailed Bike Information**: View comprehensive bike specs, features, and photos
- **Real-time Availability**: See which bikes are available for your dates

### 🛠️ Technical Features
- **Responsive Design**: Works seamlessly on desktop, tablet, and mobile
- **Real-time Updates**: Live status updates and notifications
- **Secure Authentication**: JWT-based user authentication
- **RESTful API**: Well-documented API with Swagger/OpenAPI
- **Image Management**: Support for multiple bike photos
- **Maintenance System**: Track and manage bike maintenance issues

## Tech Stack

### Backend
- Django 5.2
- Django REST Framework
- PostgreSQL
- JWT Authentication
- Stripe Integration
- AWS S3 (optional)

### Frontend
- React 18
- TypeScript
- Tailwind CSS
- Shadcn/ui Components
- React Router
- TanStack Query
- Lucide Icons

## Getting Started

### Prerequisites

- Python 3.8+
- Node.js 16+
- PostgreSQL
- Stripe account (for payments)

### Quick Setup (Recommended)

1. Clone the repository:
```bash
git clone <repository-url>
cd e-bike-rent
```

2. Run the automated setup script:
```bash
python setup_backend.py
```

This script will:
- Install all Python dependencies
- Create database migrations
- Apply migrations
- Optionally create a superuser account

3. Start the backend server:
```bash
cd backend
python manage.py runserver
```

### Manual Backend Setup

If you prefer manual setup or the automated script doesn't work:

1. Create and activate a virtual environment:
```bash
cd backend
python -m venv venv
source venv/bin/activate  # On Windows: venv\Scripts\activate
```

2. Install dependencies:
```bash
pip install -r requirements.txt
pip install django-filter>=23.0 Pillow>=10.0.0
```

3. Create and apply migrations:
```bash
python manage.py makemigrations
python manage.py migrate
```

4. Create a superuser:
```bash
python manage.py createsuperuser
```

5. Run the development server:
```bash
python manage.py runserver
```

The backend API will be available at `http://localhost:8000/api/v1/`

### Frontend Setup

1. Navigate to the frontend directory:
```bash
cd frontend
```

2. Install dependencies:
```bash
npm install
```

3. Start the development server:
```bash
npm run dev
```

The frontend will be available at `http://localhost:5173`

## 🚀 Usage Guide

### For Bike Owners

1. **Sign up/Login** to your account
2. **List a Bike**: 
   - Click "Rent your e-bike" in the header
   - Fill in bike details (title, description, location, pricing)
   - Add bike specifications (type, battery range, max speed, weight)
   - Upload photos and add features
   - Publish your listing
3. **Manage Your Bikes**:
   - Visit "My Bikes" to see all your listings
   - Toggle availability status
   - Edit bike details
   - View booking requests

### For Renters

1. **Browse Bikes**:
   - Visit the "Bikes" page to see all available bikes
   - Use filters to narrow down options (type, location, price range)
   - Switch between grid, list, and map views
2. **Search & Filter**:
   - Search by bike title or description
   - Filter by bike type (City, Mountain, Road, etc.)
   - Set price and battery range filters
   - Sort by price, rating, or newest listings
3. **View Details**:
   - Click on any bike to see detailed information
   - View photos, specifications, and features
   - Check availability and pricing

## 📚 API Documentation

The API provides comprehensive endpoints for bike management:

### Bike Endpoints
- `GET /api/v1/bikes/` - List all bikes with filtering
- `POST /api/v1/bikes/` - Create a new bike listing
- `GET /api/v1/bikes/{id}/` - Get bike details
- `PATCH /api/v1/bikes/{id}/` - Update bike information
- `DELETE /api/v1/bikes/{id}/` - Delete a bike
- `GET /api/v1/bikes/my-bikes/` - Get current user's bikes
- `POST /api/v1/bikes/{id}/toggle-status/` - Toggle bike availability

### Available Filters
- `search` - Search in title and description
- `bike_type` - Filter by bike type
- `location` - Filter by location
- `min_price` / `max_price` - Price range filtering
- `available_only` - Show only available bikes
- `owner` - Filter by owner (use 'me' for current user)
- `ordering` - Sort results (created_at, daily_rate, etc.)

### Interactive Documentation
- **Swagger UI**: `http://localhost:8000/swagger/`
- **ReDoc**: `http://localhost:8000/redoc/`

## Testing

### Backend Tests
```bash
cd backend
python manage.py test
```

### Frontend Tests
```bash
cd frontend
npm test
```

## Deployment

1. Set up a PostgreSQL database
2. Configure environment variables for production
3. Set up a web server (e.g., Nginx)
4. Set up a WSGI server (e.g., Gunicorn)
5. Configure SSL certificates
6. Set up AWS S3 for media storage (optional)

## Contributing

1. Fork the repository
2. Create a feature branch
3. Commit your changes
4. Push to the branch
5. Create a Pull Request

## License

This project is licensed under the MIT License - see the LICENSE file for details. 