const express = require('express');
const request = require('supertest');
const CryptoJS = require('crypto-js');

jest.mock('../models/User');

const User = require('../models/User');
const authRoute = require('../routes/auth');

const app = express();

app.use(express.json());
app.use('/api/auth', authRoute);

process.env.PASS_SEC = 'test-secret';
process.env.JWT_SEC = 'test-jwt-secret';

describe('Authentication API Tests', () => {

    beforeEach(() => {
        jest.clearAllMocks();
    });

    // REGISTER TEST
//     test('Should register a new user successfully', async () => {

//     User.mockImplementation((userData) => ({
//         ...userData,

//         save: jest.fn().mockReturnValue({
//             _id: '123',
//             ...userData
//         })
//     }));

//     const response = await request(app)
//         .post('/api/auth/register')
//         .send({
//             username: 'john',
//             email: 'john@gmail.com',
//             password: '12345'
//         });

//     expect(response.status).toBe(201);
// });


    // LOGIN SUCCESS TEST
    test('Should login successfully with correct credentials', async () => {

        const encryptedPassword = CryptoJS.AES.encrypt(
            '12345',
            process.env.PASS_SEC
        ).toString();

        User.findOne.mockResolvedValue({
            _id: '123',
            username: 'john',
            password: encryptedPassword,
            isAdmin: false
        });

        const response = await request(app)
            .post('/api/auth/login')
            .send({
                username: 'john',
                password: '12345'
            });

        expect(response.status).toBe(200);
        expect(response.body.accessToken).toBeDefined();
    });


    // USER NOT FOUND TEST
    test('Should return 401 if user does not exist', async () => {

        User.findOne.mockResolvedValue(null);

        const response = await request(app)
            .post('/api/auth/login')
            .send({
                username: 'unknown',
                password: '12345'
            });

        expect(response.status).toBe(401);
        expect(response.body).toBe('Wrong credentials');
    });


    // WRONG PASSWORD TEST
    test('Should reject incorrect password', async () => {

        const encryptedPassword = CryptoJS.AES.encrypt(
            'correct123',
            process.env.PASS_SEC
        ).toString();

        User.findOne.mockResolvedValue({
            _id: '123',
            username: 'john',
            password: encryptedPassword,
            isAdmin: false
        });

        const response = await request(app)
            .post('/api/auth/login')
            .send({
                username: 'john',
                password: 'wrong123'
            });

        expect(response.status).toBe(400);
    });

});