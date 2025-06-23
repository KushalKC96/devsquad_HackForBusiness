# Kostra Backend API

A comprehensive REST API backend for the Kostra property rental platform built with Node.js, Express, and PostgreSQL.

## Features

- **Authentication & Authorization**: JWT-based auth with role-based access control
- **Property Management**: CRUD operations for property listings
- **Booking System**: Complete booking management with availability checking
- **Review System**: User reviews and ratings for properties
- **User Management**: Profile management and user roles
- **Safety & Trust**: Safety reporting and guidelines system
- **Career Portal**: Job listings and application management
- **Referral Program**: User referral system with rewards tracking
- **Company Information**: About, team, and company details

## Tech Stack

- **Runtime**: Node.js
- **Framework**: Express.js
- **Database**: PostgreSQL with Knex.js ORM
- **Authentication**: JWT (JSON Web Tokens)
- **Validation**: Joi
- **Security**: Helmet, bcryptjs, rate limiting
- **File Upload**: Multer with Cloudinary integration
- **Email**: Nodemailer
- **Deployment**: Vercel


## Local Project Installation:

1. **Clone the repository**
   ```bash
   git clone <repository-url>
   cd Server
   ```

2. **Install dependencies**
   ```bash
   npm install
   ```

3. **Environment Setup**
   ```bash
   cp .env.example .env
   ```
   
   Fill in your environment variables in `.env`:
   - Database credentials
   - JWT secret
   - Cloudinary credentials (for image uploads)
   - Email configuration

4. **Database Setup**
   ```bash
   npm run migrate
   npm run seed
   ```

5. **Start the server**
   ```bash
   # Development
   npm run dev
   
   # Production
   npm start
   ```

## API Endpoints

### Authentication
- `POST /api/auth/register` - User registration
- `POST /api/auth/login` - User login
- `GET /api/auth/profile` - Get user profile (Protected)

### Properties
- `GET /api/properties` - Get all properties (with filters)
- `GET /api/properties/:id` - Get single property
- `POST /api/properties` - Create property (Host only)
- `PUT /api/properties/:id` - Update property (Host only)
- `DELETE /api/properties/:id` - Delete property (Host only)

### Bookings
- `POST /api/bookings` - Create booking (Protected)
- `GET /api/bookings` - Get user's bookings (Protected)
- `GET /api/bookings/:id` - Get single booking (Protected)
- `PUT /api/bookings/:id/cancel` - Cancel booking (Protected)

### Reviews
- `POST /api/reviews` - Create review (Protected)
- `GET /api/reviews/property/:propertyId` - Get property reviews
- `GET /api/reviews/user` - Get user's reviews (Protected)
- `PUT /api/reviews/:id` - Update review (Protected)
- `DELETE /api/reviews/:id` - Delete review (Protected)

### Users
- `GET /api/users/profile` - Get profile (Protected)
- `PUT /api/users/profile` - Update profile (Protected)
- `GET /api/users` - Get all users (Admin only)

### Company
- `GET /api/company` - Get company information
- `GET /api/company/about` - Get detailed about information

### Careers
- `GET /api/careers` - Get job listings
- `GET /api/careers/:id` - Get job details
- `POST /api/careers/apply` - Apply for job
- `GET /api/careers/admin/applications` - Get applications (Admin only)

### Referrals
- `GET /api/referrals/info` - Get referral program info
- `GET /api/referrals/my-code` - Get user's referral code (Protected)
- `POST /api/referrals/send` - Send referral invitation (Protected)
- `GET /api/referrals/my-referrals` - Get user's referrals (Protected)
- `POST /api/referrals/validate` - Validate referral code

### Safety
- `GET /api/safety/guidelines` - Get safety guidelines
- `POST /api/safety/report` - Report safety concern (Protected)
- `GET /api/safety/my-reports` - Get user's reports (Protected)
- `GET /api/safety/report/:caseNumber` - Get specific report (Protected)
- `GET /api/safety/admin/reports` - Get all reports (Admin only)

## Database Schema

### Users Table
- User authentication and profile information
- Role-based permissions (guest, host, admin)

### Properties Table
- Property listings with details, amenities, images
- Location information and pricing

### Bookings Table
- Booking information with dates, guests, pricing
- Status tracking (pending, confirmed, cancelled, completed)

### Reviews Table
- User reviews and ratings for properties
- One review per user per property constraint

## Security Features

- **JWT Authentication**: Secure token-based authentication
- **Password Hashing**: bcryptjs for secure password storage
- **Rate Limiting**: Prevents API abuse
- **Input Validation**: Joi validation for all inputs
- **CORS**: Configured for frontend integration
- **Helmet**: Security headers
- **SQL Injection Protection**: Parameterized queries with Knex

## project Deployment

### Vercel Deployment

1. **Install Vercel CLI**
   ```bash
   npm i -g vercel
   ```

2. **Deploy**
   ```bash
   vercel
   ```

3. **Environment Variables**
   Set up environment variables in Vercel dashboard:
   - `DATABASE_URL`
   - `JWT_SECRET`
   - `NODE_ENV=production`
   - Other required variables

### Database Setup (Production)

For production, use a hosted PostgreSQL service like:
- **Supabase** (Recommended for Vercel)
- **Neon**
- **Railway**
- **AWS RDS**

## Development

### Running Locally

```bash
# Install dependencies
npm install

# Start development server with auto-reload
npm run dev

# Run migrations
npm run migrate

# Seed database with sample data
npm run seed
```

### Testing

```bash
npm test
```



## License

This project is licensed under the MIT License - see the LICENSE file for details.

## Support

For support, email support@kostra.com or create an issue in the repository.
