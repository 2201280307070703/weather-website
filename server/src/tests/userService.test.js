const userService = require('../services/userService');
const User = require('../models/User');
const jwt = require('../lib/jwt');

jest.mock('../models/User');
jest.mock('../lib/jwt');

describe('register', () => {
    afterEach(() => {
        jest.clearAllMocks();
    });

    it('should return user data and token on successful register', async () => {
        const email = 'new@example.com';
        const password = 'password123';

        const mockUser = {
            _id: 'user123',
            email,
        };

        User.findOne.mockResolvedValue(null);
        User.create.mockResolvedValue(mockUser);
        jwt.sign.mockResolvedValue('mocked-token');

        const result = await userService.register(email, password);

        expect(User.findOne).toHaveBeenCalledWith({ email });
        expect(User.create).toHaveBeenCalledWith({ email, password });
        expect(jwt.sign).toHaveBeenCalled();
        expect(result).toEqual({
            userId: mockUser._id,
            email: mockUser.email,
            token: 'mocked-token',
        });
    });

    it('should throw error if user with this email already exist', async () => {
        User.findOne.mockResolvedValue({ _id: 'existingId', email: 'existing@example.com' });

        await expect(userService.register('existing@example.com', 'pass', true, 'city', 5, 20))
            .rejects
            .toThrow('Register error: User with this email already exist!');
    });

    it('should throw error if User.findOne fails', async () => {
        User.findOne.mockRejectedValue(new Error('DB failure'));

        await expect(userService.register('email@example.com', 'pass', true, 'city', 5, 20))
            .rejects
            .toThrow('Register error: DB failure');
    });
});

describe('login', () => {
    const mockEmail = 'test@example.com';
    const mockPassword = 'password123';
    const mockUserId = 'user123';
    const mockToken = 'mocked-token';

    afterEach(() => {
        jest.clearAllMocks();
    });

    it('should return user data and token on successful login', async () => {
        const mockUser = {
            _id: mockUserId,
            email: mockEmail,
            comparePassword: jest.fn().mockResolvedValue(true),
        };

        User.findOne.mockResolvedValue(mockUser);
        jwt.sign.mockResolvedValue(mockToken);

        const result = await userService.login(mockEmail, mockPassword);

        expect(User.findOne).toHaveBeenCalledWith({ email: mockEmail });
        expect(mockUser.comparePassword).toHaveBeenCalledWith(mockPassword);
        expect(jwt.sign).toHaveBeenCalled();
        expect(result).toEqual({
            userId: mockUserId,
            email: mockEmail,
            token: mockToken
        });
    });

    it('should throw error if user is not found', async () => {
        User.findOne.mockResolvedValue(null);

        await expect(userService.login(mockEmail, 'password123')).rejects.toThrow('Login error: Invalid credentials!');
    });

    it('should throw error if password is incorrect', async () => {
        const mockUser = {
            _id: mockUserId,
            email: mockEmail,
            comparePassword: jest.fn().mockResolvedValue(false)
        };

        User.findOne.mockResolvedValue(mockUser);

        await expect(userService.login(mockEmail, 'wrongpass')).rejects.toThrow('Login error: Invalid credentials!');
    });

    it('should throw error if unexpected error occurs', async () => {
        User.findOne.mockRejectedValue(new Error('Database down'));

        await expect(userService.login(mockEmail, 'any')).rejects.toThrow('Login error: Database down');
    });
});

describe('getUsersWithEnabledNotifications', () => {
    beforeEach(() => {
        jest.clearAllMocks();
    });

    it('should return users with enabled notifications, provided city max and min temp', async () => {
        const mockUsers = [
            { email: 'user1@abv.bg', alertsEnabled: true, city: 'Sofia' },
            { email: 'user2@abv.bg', alertsEnabled: true, city: 'Stara Zagora' }
        ];

        User.find.mockResolvedValue(mockUsers);

        const result = await userService.getUsersWithEnabledNotifications();

        expect(User.find).toHaveBeenCalledWith({
            alertsEnabled: true,
            city: { $nin: [null, ""] },
            minTemp: { $ne: null },
            maxTemp: { $ne: null }
        });

        expect(result).toEqual(mockUsers);
    });

    it('should throw an error if User.find fails', async () => {
        User.find.mockRejectedValue(new Error('DB error'));

        await expect(userService.getUsersWithEnabledNotifications()).rejects.toThrow(
            'Error getting users with enabled notifications: DB error'
        );
    });
});

describe('getUsersWithEnabledRecommendations', () => {
    beforeEach(() => {
        jest.clearAllMocks();
    });

    it('should return users with enabled recommendations and provided city', async () => {
        const mockUsers = [
            { email: 'user1@abv.bg', alertsEnabled: true, city: 'Sofia' },
            { email: 'user2@abv.bg', alertsEnabled: true, city: 'Stara Zagora' }
        ];

        User.find.mockResolvedValue(mockUsers);

        const result = await userService.getUsersWithEnabledRecommendations();

        expect(User.find).toHaveBeenCalledWith({
            recommendationsEnabled: true,
            city: { $nin: [null, ""] }
        });

        expect(result).toEqual(mockUsers);
    });

    it('should throw an error if User.find fails', async () => {
        User.find.mockRejectedValue(new Error('DB error'));

        await expect(userService.getUsersWithEnabledRecommendations()).rejects.toThrow(
            'Error getting users with enabled recommendations: DB error'
        );
    });
});

describe('getUserInfo', () => {
    beforeEach(() => {
        jest.clearAllMocks();
    });

    it('should return user info by user id', async () => {
        const mockUser = { _id: 'id1', email: 'user1@abv.bg', alertsEnabled: true, city: 'Sofia' };

        User.findById.mockResolvedValue(mockUser);

        const result = await userService.getUserInfo('id1');

        expect(User.findById).toHaveBeenCalledWith('id1');
        expect(result).toEqual(mockUser);
    });

    it('should throw an error if User.findById fails', async () => {
        User.findById.mockRejectedValue(new Error('DB error'));

        await expect(userService.getUserInfo()).rejects.toThrow(
            'Error getting user by user id: DB error'
        );
    });
});

describe('updateUserInfo', () => {
    beforeEach(() => {
        jest.clearAllMocks();
    });

    it('should update user info and save the user', async () => {
        const mockSave = jest.fn().mockResolvedValue(true);
        const mockUser = {
            _id: 'userId123',
            email: 'old@example.com',
            password: 'oldpass',
            alertsEnabled: false,
            recommendationsEnabled: false,
            city: 'OldCity',
            maxTemp: 30,
            minTemp: 10,
            save: mockSave,
        };

        User.findById.mockResolvedValue(mockUser);

        const updatedData = {
            email: 'new@example.com',
            password: 'newpass',
            alertsEnabled: true,
            recommendationsEnabled: true,
            city: 'NewCity',
            maxTemp: 35,
            minTemp: 5,
        };

        const result = await userService.updateUserInfo('userId123', updatedData);

        expect(User.findById).toHaveBeenCalledWith('userId123');

        expect(mockUser.email).toBe(updatedData.email);
        expect(mockUser.password).toBe(updatedData.password);
        expect(mockUser.alertsEnabled).toBe(updatedData.alertsEnabled);
        expect(mockUser.recommendationsEnabled).toBe(updatedData.recommendationsEnabled);
        expect(mockUser.city).toBe(updatedData.city);
        expect(mockUser.maxTemp).toBe(updatedData.maxTemp);
        expect(mockUser.minTemp).toBe(updatedData.minTemp);

        expect(mockSave).toHaveBeenCalled();

        expect(result).toBe(mockUser);
    });

    it('should throw error if user does not exist', async () => {
        User.findById.mockResolvedValue(null);

        await expect(userService.updateUserInfo('nonexistentId', {}))
            .rejects.toThrow('This user does not exist!');
    });

    it('should throw error if findById throws', async () => {
        User.findById.mockRejectedValue(new Error('DB failure'));

        await expect(userService.updateUserInfo('anyId', {}))
            .rejects.toThrow("An error occurred when updating the user's data: DB failure");
    });

    it('should throw error if save throws', async () => {
        const mockUser = {
            save: jest.fn().mockRejectedValue(new Error('Save failure')),
        };

        User.findById.mockResolvedValue(mockUser);

        await expect(userService.updateUserInfo('userId123', {}))
            .rejects.toThrow("An error occurred when updating the user's data: Save failure");
    });
});