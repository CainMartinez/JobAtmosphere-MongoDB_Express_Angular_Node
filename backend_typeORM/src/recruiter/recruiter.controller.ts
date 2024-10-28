import { NextFunction, Request, Response } from 'express';
import { validate } from 'class-validator';
import { UserService } from './recruiter.service';
import { AuthService } from '../utils/auth.service';
import { CreateUserDto } from './dto/create-recruiter.dto';
import { LoginUserDto } from './dto/login-recruiter.dto';

export class UserController {
    private userService: UserService;
    private authService: AuthService;

    constructor() {
        this.userService = new UserService();  // Servicio de usuarios
        this.authService = new AuthService();  // Servicio de autenticación
    }

    // Registro de usuarios
    async register(req: Request, res: Response) {
        const createUserDto = new CreateUserDto();
        Object.assign(createUserDto, req.body);

        const errors = await validate(createUserDto);
        if (errors.length > 0) {
            return res.status(400).json({ errors });
        }

        try {
            const user = await this.userService.createUser({
                email: createUserDto.email,
                username: createUserDto.username,
                password: createUserDto.password,
                roles: ['recruiter']
            });
            return res.status(201).json({ 
                message: 'User registered successfully'
            });

        } catch (error) {
            return res.status(400).json({ message: (error as Error).message });
        }
    }

    // Inicio de sesión (login)
    async login(req: Request, res: Response) {
        const loginUserDto = new LoginUserDto();
        Object.assign(loginUserDto, req.body);

        const errors = await validate(loginUserDto);
        if (errors.length > 0) {
            return res.status(400).json({ errors });
        }

        try {
            const user = await this.userService.findUserByEmail(loginUserDto.email);
            if (!user) {
                return res.status(400).json({ message: 'Invalid email or password' });
            }

            const isValidPassword = await this.userService.validatePassword(user, loginUserDto.password);
            if (!isValidPassword) {
                return res.status(400).json({ message: 'Invalid email or password' });
            }

            const token = this.authService.generateAccessToken(user);
            return res.status(200).json({ token });

        } catch (error) {
            return res.status(500).json({ message: 'Internal server error' });
        }
    }

    async getCurrentRecruiter(req: Request, res: Response, next: NextFunction) {
        const email = (req as Request & { email: string }).email;  // Forzamos a TypeScript a reconocer `req.email`

        if (!email) {
            return res.status(400).json({ message: 'Email not found in token' });
        }

        try {
            const user = await this.userService.findUserByEmail(email);

            if (!user) {
                return res.status(404).json({ message: 'User not found' });
            }

            return res.status(200).json({ user });
        } catch (error) {
            return res.status(500).json({ message: 'Error retrieving user profile' });
        }
    }
}