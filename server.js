const express = require('express');
const bodyParser = require('body-parser');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');

const app = express();
const port = 3000;

const JWT_SECRET = 'your_secret_key';

// Middleware
app.use(bodyParser.json());
app.use(express.json());

// Serve static files
app.use(express.static('public'));

// Set EJS as template engine
app.set('view engine', 'ejs');
app.set('views', './views');

// Route to render posts page
app.get('/posts', (req, res) => {
    res.render('posts', { posts: posts });
});

// Authentication middleware
const authenticateToken = (req, res, next) => {
    const authHeader = req.headers['authorization'];
    const token = authHeader && authHeader.split(' ')[1]; // Bearer TOKEN
    
    if (!token) {
        return res.status(401).json({
            success: false,
            message: 'Access token required'
        });
    }
    
    jwt.verify(token, JWT_SECRET, (err, user) => {
        if (err) {
            return res.status(403).json({
                success: false,
                message: 'Invalid or expired token'
            });
        }
        req.user = user;
        next();
    });
};

// User registration
app.post('/api/auth/register', async (req, res) => {
    const { username, email, password } = req.body;
    
    if (!username || !email || !password) {
        return res.status(400).json({
            success: false,
            message: 'Please provide username, email, and password'
        });
    }
    
    // Check if user already exists
    const existingUser = users.find(u => u.email === email || u.username === username);
    if (existingUser) {
        return res.status(400).json({
            success: false,
            message: 'User already exists'
        });
    }
    
    // Hash password
    const hashedPassword = await bcrypt.hash(password, 10);
    
    const newUser = {
        id: nextUserId++,
        username,
        email,
        password: hashedPassword
    };
    
    users.push(newUser);
    
    // Generate JWT token
    const token = jwt.sign(
        { id: newUser.id, username: newUser.username },
        JWT_SECRET,
        { expiresIn: '24h' }
    );
    
    res.status(201).json({
        success: true,
        message: 'User registered successfully',
        token,
        user: {
            id: newUser.id,
            username: newUser.username,
            email: newUser.email
        }
    });
});

// User login
app.post('/api/auth/login', async (req, res) => {
    const { email, password } = req.body;
    
    if (!email || !password) {
        return res.status(400).json({
            success: false,
            message: 'Please provide email and password'
        });
    }
    
    // Find user
    const user = users.find(u => u.email === email);
    if (!user) {
        return res.status(401).json({
            success: false,
            message: 'Invalid credentials'
        });
    }
    
    // Check password
    const isPasswordValid = await bcrypt.compare(password, user.password);
    if (!isPasswordValid) {
        return res.status(401).json({
            success: false,
            message: 'Invalid credentials'
        });
    }
    
    // Generate JWT token
    const token = jwt.sign(
        { id: user.id, username: user.username },
        JWT_SECRET,
        { expiresIn: '24h' }
    );
    
    res.status(200).json({
        success: true,
        message: 'Login successful',
        token,
        user: {
            id: user.id,
            username: user.username,
            email: user.email
        }
    });
});

// Protected route example - Get user profile
app.get('/api/auth/profile', authenticateToken, (req, res) => {
    const user = users.find(u => u.id === req.user.id);
    if (!user) {
        return res.status(404).json({
            success: false,
            message: 'User not found'
        });
    }
    
    res.status(200).json({
        success: true,
        data: {
            id: user.id,
            username: user.username,
            email: user.email
        }
    });
});

// In-memory storage for posts (using variables as specified)
let posts = [
    { id: 1, title: 'First Post', content: 'This is my first post!', author: 'John', createdAt: new Date() },
    { id: 2, title: 'Second Post', content: 'Another great post!', author: 'Jane', createdAt: new Date() }
];
let nextPostId = 3;

// In-memory storage for users
let users = [
    { id: 1, username: 'john', email: 'john@example.com', password: 'password123' },
    { id: 2, username: 'jane', email: 'jane@example.com', password: 'password456' }
];
let nextUserId = 3;

// Basic route
app.get('/', (req, res) => {
    res.send('Social Media Platform API is running!');
});

// GET all posts
app.get('/api/posts', (req, res) => {
    const page = parseInt(req.query.page) || 1;
    const limit = parseInt(req.query.limit) || 5;
    const startIndex = (page - 1) * limit;
    const endIndex = page * limit;
    
    const paginatedPosts = posts.slice(startIndex, endIndex);
    
    res.status(200).json({
        success: true,
        data: paginatedPosts,
        pagination: {
            currentPage: page,
            totalPages: Math.ceil(posts.length / limit),
            totalPosts: posts.length,
            hasNext: endIndex < posts.length,
            hasPrev: startIndex > 0
        }
    });
});


// GET single post by ID
app.get('/api/posts/:id', (req, res) => {
    const postId = parseInt(req.params.id);
    const post = posts.find(p => p.id === postId);
    
    if (!post) {
        return res.status(404).json({
            success: false,
            message: 'Post not found'
        });
    }
    
    res.status(200).json({
        success: true,
        data: post
    });
});

// POST create new post (protected route)
app.post('/api/posts', authenticateToken, (req, res) => {
    const { title, content } = req.body;
    
    if (!title || !content) {
        return res.status(400).json({
            success: false,
            message: 'Please provide title and content'
        });
    }
    
    const newPost = {
        id: nextPostId++,
        title,
        content,
        author: req.user.username, // Use authenticated user's username
        authorId: req.user.id,
        createdAt: new Date()
    };
    
    posts.push(newPost);
    
    res.status(201).json({
        success: true,
        data: newPost,
        message: 'Post created successfully'
    });
});

// PUT update post by ID
app.put('/api/posts/:id', (req, res) => {
    const postId = parseInt(req.params.id);
    const { title, content } = req.body;
    
    const postIndex = posts.findIndex(p => p.id === postId);
    
    if (postIndex === -1) {
        return res.status(404).json({
            success: false,
            message: 'Post not found'
        });
    }
    
    // Update post
    if (title) posts[postIndex].title = title;
    if (content) posts[postIndex].content = content;
    posts[postIndex].updatedAt = new Date();
    
    res.status(200).json({
        success: true,
        data: posts[postIndex],
        message: 'Post updated successfully'
    });
});

// DELETE post by ID
app.delete('/api/posts/:id', (req, res) => {
    const postId = parseInt(req.params.id);
    const postIndex = posts.findIndex(p => p.id === postId);
    
    if (postIndex === -1) {
        return res.status(404).json({
            success: false,
            message: 'Post not found'
        });
    }
    
    const deletedPost = posts.splice(postIndex, 1)[0];
    
    res.status(200).json({
        success: true,
        data: deletedPost,
        message: 'Post deleted successfully'
    });
});

app.listen(port, () => {
    console.log(`Server running at http://localhost:${port}`);
});
