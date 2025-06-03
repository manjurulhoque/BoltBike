# E-Bike Rental Platform

A peer-to-peer e-bike rental platform built with Django REST Framework and React.

## Features

- User authentication and profile management
- Bike listing and management
- Booking system with availability checking
- Secure payments with Stripe
- Maintenance ticket system
- Rating and review system
- Admin dashboard

## Tech Stack

### Backend
- Django 5.2
- Django REST Framework
- PostgreSQL
- JWT Authentication
- Stripe Integration
- AWS S3 (optional)

### Frontend
- React
- TypeScript
- Material-UI
- Redux Toolkit
- React Router

## Getting Started

### Prerequisites

- Python 3.8+
- Node.js 16+
- PostgreSQL
- Stripe account (for payments)

### Backend Setup

1. Clone the repository:
```bash
git clone https://github.com/manjurulhoque/e-bike-rent.git
cd e-bike-rent
```

2. Create and activate a virtual environment:
```bash
cd backend
python -m venv venv
source venv/bin/activate  # On Windows: venv\Scripts\activate
```

3. Install dependencies:
```bash
pip install -r requirements.txt
```

4. Create a `.env` file in the backend directory (copy from `.env.example`):
```bash
cp .env.example .env
```

5. Update the `.env` file with your configuration:
```
DJANGO_SECRET_KEY=your-secret-key
DJANGO_DEBUG=True
DJANGO_ALLOWED_HOSTS=localhost,127.0.0.1

DB_NAME=ebike_rent
DB_USER=postgres
DB_PASSWORD=your-password
DB_HOST=localhost
DB_PORT=5432

STRIPE_PUBLIC_KEY=your-stripe-public-key
STRIPE_SECRET_KEY=your-stripe-secret-key
STRIPE_WEBHOOK_SECRET=your-stripe-webhook-secret
```

6. Run migrations:
```bash
python manage.py migrate
```

7. Create a superuser:
```bash
python manage.py createsuperuser
```

8. Run the development server:
```bash
python manage.py runserver
```

The backend API will be available at `http://localhost:8000/api/v1/`

### Frontend Setup

1. Navigate to the frontend directory:
```bash
cd ../frontend
```

2. Install dependencies:
```bash
npm install
```

3. Create a `.env` file (copy from `.env.example`):
```bash
cp .env.example .env
```

4. Update the `.env` file with your configuration:
```
REACT_APP_API_URL=http://localhost:8000/api/v1
REACT_APP_STRIPE_PUBLIC_KEY=your-stripe-public-key
```

5. Start the development server:
```bash
npm start
```

The frontend will be available at `http://localhost:3000`

## API Documentation

API documentation is available at:
- Swagger UI: `http://localhost:8000/swagger/`
- ReDoc: `http://localhost:8000/redoc/`

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