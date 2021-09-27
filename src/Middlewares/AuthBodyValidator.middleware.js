import { check, validationResult } from 'express-validator';

export const AuthBodyValidator = [
    check('email').trim().notEmpty().withMessage('Email is not to be empty').bail().isEmail().withMessage('Enter a valid email').bail(),

    check('password').trim().notEmpty().withMessage('Password is required to create account').bail().matches(/(?=.*[a-zA-Z]+)(?=.*[0-9]+)(?=.*[!#$%&*]+).*/).withMessage('Password must be alpha numeric plus containing at least 1 or more special characters').bail().isLength({min:10}).withMessage('Password has to be at least 10 characters or more'),

    (request, response, next)=>{
        const errors = validationResult(request);

        if (!errors.isEmpty()){
            return response.status(422).json({errors: errors.array()})
        }
        next()
    }
]

