# Social Media Platform API

A RESTful API built with Express.js for a social media platform that allows users to create, read, update, and delete posts with user authentication.

## Features

- ✅ CRUD operations for posts
- ✅ User authentication with JWT tokens
- ✅ Password hashing with bcrypt
- ✅ Input validation and error handling
- ✅ RESTful API design
- ✅ JSON response format
- ✅ In-memory data storage
- ✅ Pagination support
- ✅ Template rendering with EJS

## Technologies Used

- **Node.js** - JavaScript runtime
- **Express.js** - Web framework
- **JWT** - JSON Web Tokens for authentication
- **bcryptjs** - Password hashing
- **EJS** - Template engine
- **body-parser** - Request body parsing middleware

## Installation

1. Clone the repository:
```bash
git clone https://github.com/yourusername/social-media-platform.git
cd social-media-platform
```

2. Install dependencies:
```bash
npm install
```

3. Start the server:
```bash
node server.js
```

4. The server will run on `http://localhost:3000`

## API Endpoints

### Authentication

| Method | Endpoint | Description | Auth Required |
|--------|----------|-------------|---------------|
| POST | `/api/auth/register` | Register a new user | No |
| POST | `/api/auth/login` | Login user | No |
| GET | `/api/auth/profile` | Get user profile | Yes |

### Posts

| Method | Endpoint | Description | Auth Required |
|--------|----------|-------------|---------------|
| GET | `/api/posts` | Get all posts | No |
| GET | `/api/posts/:id` | Get single post | No |
| POST | `/api/posts` | Create new post | Yes |
| PUT | `/api/posts/:id` | Update post | No |
| DELETE | `/api/posts/:id` | Delete post | No |

### Web Pages

| Method | Endpoint | Description |
|--------|----------|-------------|
| GET | `/` | API status page |
| GET | `/posts` | View all posts (HTML) |

## Request/Response Examples

### Register User
```http
POST /api/auth/register
Content-Type: application/json

{
  "username": "johndoe",
  "email": "john@example.com",
  "password": "password123"
}
```

**Response:**
```json
{
  "success": true,
  "message": "User registered successfully",
  "token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...",
  "user": {
    "id": 1,
    "username": "johndoe",
    "email": "john@example.com"
  }
}
```

### Login User
```http
POST /api/auth/login
Content-Type: application/json

{
  "email": "john@example.com",
  "password": "password123"
}
```

### Create Post
```http
POST /api/posts
Authorization: Bearer YOUR_JWT_TOKEN
Content-Type: application/json

{
  "title": "My First Post",
  "content": "This is the content of my first post"
}
```

**Response:**
```json
{
  "success": true,
  "data": {
    "id": 1,
    "title": "My First Post",
    "content": "This is the content of my first post",
    "author": "johndoe",
    "authorId": 1,
    "createdAt": "2025-06-12T05:23:00.000Z"
  },
  "message": "Post created successfully"
}
```

### Get All Posts
```http
GET /api/posts?page=1&limit=5
```

**Response:**
```json
{
  "success": true,
  "data": [
    {
      "id": 1,
      "title": "First Post",
      "content": "This is my first post!",
      "author": "John",
      "createdAt": "2025-06-12T05:23:00.000Z"
    }
  ],
  "pagination": {
    "currentPage": 1,
    "totalPages": 1,
    "totalPosts": 1,
    "hasNext": false,
    "hasPrev": false
  }
}
```

## Testing with Postman

1. **Download Postman** from [https://www.postman.com/downloads/](https://www.postman.com/downloads/)

2. **Import the collection** (optional) or create requests manually:
   - Set the base URL to `http://localhost:3000`
   - Add `Content-Type: application/json` header for POST/PUT requests
   - For protected routes, add `Authorization: Bearer YOUR_TOKEN` header

3. **Test the endpoints** in this order:
   - Register a user
   - Login to get JWT token
   - Create posts using the token
   - Test CRUD operations

## Project Structure

```
social-media-platform/
├── server.js              # Main application file
├── package.json           # Dependencies and scripts
├── views/                 # EJS templates
│   └── posts.ejs         # Posts display template
├── public/               # Static files (CSS, JS, images)
└── README.md             # Project documentation
```

## Environment Variables

For production, consider using environment variables:

```env
PORT=3000
JWT_SECRET=your-super-secret-jwt-key
NODE_ENV=development
```

## Error Handling

The API returns consistent error responses:

```json
{
  "success": false,
  "message": "Error description"
}
```

Common HTTP status codes:
- `200` - Success
- `201` - Created
- `400` - Bad Request
- `401` - Unauthorized
- `403` - Forbidden
- `404` - Not Found
- `500` - Internal Server Error

## Security Features

- Password hashing with bcrypt
- JWT token authentication
- Input validation
- Error handling middleware
- CORS support (can be added)

## Future Enhancements

- [ ] Database integration (MongoDB/PostgreSQL)
- [ ] File upload for images
- [ ] User roles and permissions
- [ ] Post likes and comments
- [ ] Real-time notifications
- [ ] Rate limiting
- [ ] API documentation with Swagger
- [ ] Unit and integration tests
- [ ] Docker containerization

## Contributing

1. Fork the repository
2. Create a feature branch (`git checkout -b feature/new-feature`)
3. Commit your changes (`git commit -am 'Add new feature'`)
4. Push to the branch (`git push origin feature/new-feature`)
5. Create a Pull Request

## License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## Author

dasunathauda99@gmail.com

## Acknowledgments

- Express.js documentation
- JWT.io for token handling
- Node.js community
