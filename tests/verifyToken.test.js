const express = require('express');
const request = require('supertest');
const jwt = require('jsonwebtoken');

const {
    verifyToken,
    verifyAuth,
    verifyAdmin
} = require('../routes/verifyToken');

jest.mock('jsonwebtoken');

const app = express();

app.get('/verify-token', verifyToken, (req, res) => {
    res.status(200).json({
        message: 'Token verified',
        user: req.user
    });
});

app.get('/verify-auth/:id', verifyAuth, (req, res) => {
    res.status(200).json('Authorized');
});

app.get('/verify-admin', verifyAdmin, (req, res) => {
    res.status(200).json('Admin authorized');
});

describe('Authentication Middleware Tests', () => {

    beforeEach(() => {
        jest.clearAllMocks();
    });

    // -------------------------------
    // VERIFY TOKEN TESTS
    // -------------------------------

    test('Should return 401 if token is missing', async () => {

        const response = await request(app)
            .get('/verify-token');

        expect(response.status).toBe(401);
        expect(response.body).toBe('Not authenticated.');
    });


    test('Should return 403 if token is invalid', async () => {

        jwt.verify.mockImplementation((token, secret, callback) => {
            callback(new Error('Invalid token'), null);
        });

        const response = await request(app)
            .get('/verify-token')
            .set('token', 'Bearer invalidToken');

        expect(response.status).toBe(403);
        expect(response.body).toBe('Token is not correct');
    });


    test('Should allow request if token is valid', async () => {

        jwt.verify.mockImplementation((token, secret, callback) => {
            callback(null, {
                id: '123',
                isAdmin: false
            });
        });

        const response = await request(app)
            .get('/verify-token')
            .set('token', 'Bearer validToken');

        expect(response.status).toBe(200);
        expect(response.body.user.id).toBe('123');
    });


    // -------------------------------
    // VERIFY AUTH TESTS
    // -------------------------------

    test('Should allow user to access their own resource', async () => {

        jwt.verify.mockImplementation((token, secret, callback) => {
            callback(null, {
                id: '123',
                isAdmin: false
            });
        });

        const response = await request(app)
            .get('/verify-auth/123')
            .set('token', 'Bearer validToken');

        expect(response.status).toBe(200);
        expect(response.body).toBe('Authorized');
    });


    test('Should allow admin to access another user resource', async () => {

        jwt.verify.mockImplementation((token, secret, callback) => {
            callback(null, {
                id: '999',
                isAdmin: true
            });
        });

        const response = await request(app)
            .get('/verify-auth/123')
            .set('token', 'Bearer validToken');

        expect(response.status).toBe(200);
    });


    test('Should reject user accessing another user resource', async () => {

        jwt.verify.mockImplementation((token, secret, callback) => {
            callback(null, {
                id: '999',
                isAdmin: false
            });
        });

        const response = await request(app)
            .get('/verify-auth/123')
            .set('token', 'Bearer validToken');

        expect(response.status).toBe(403);
        expect(response.body).toBe('Not allowed');
    });


    // -------------------------------
    // VERIFY ADMIN TESTS
    // -------------------------------

    test('Should allow admin access', async () => {

        jwt.verify.mockImplementation((token, secret, callback) => {
            callback(null, {
                id: '123',
                isAdmin: true
            });
        });

        const response = await request(app)
            .get('/verify-admin')
            .set('token', 'Bearer validToken');

        expect(response.status).toBe(200);
        expect(response.body).toBe('Admin authorized');
    });


    test('Should reject normal user from admin access', async () => {

        jwt.verify.mockImplementation((token, secret, callback) => {
            callback(null, {
                id: '123',
                isAdmin: false
            });
        });

        const response = await request(app)
            .get('/verify-admin')
            .set('token', 'Bearer validToken');

        expect(response.status).toBe(403);
        expect(response.body).toBe('Not allowed');
    });

});