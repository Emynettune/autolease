"use strict";

const dataSource = require("../data-source");
const enums = require("../../types/enums");
const password = require("../../utils/password");
async function seed() {
    await (0, dataSource.initializeDatabase)();
    const userRepo = (0, dataSource.getRepo)('User');
    const walletRepo = (0, dataSource.getRepo)('Wallet');
    const vehicleRepo = (0, dataSource.getRepo)('Vehicle');
    const seeds = [
        {
            firstName: 'Admin',
            lastName: 'User',
            email: 'admin@autolease.com',
            password: 'Admin@12345',
            role: enums.UserRole.ADMIN,
            isEmailVerified: true,
        },
        {
            firstName: 'John',
            lastName: 'Customer',
            email: 'customer@autolease.com',
            password: 'Customer@12345',
            role: enums.UserRole.CUSTOMER,
            isEmailVerified: true,
        },
        {
            firstName: 'Jane',
            lastName: 'Owner',
            email: 'owner@autolease.com',
            password: 'Owner@12345',
            role: enums.UserRole.CAR_OWNER,
            isEmailVerified: true,
            isOwnerVerified: true,
        },
    ];
    for (const data of seeds) {
        if (await userRepo.findOne({ where: { email: data.email } }))
            continue;
        const user = await userRepo.save(userRepo.create({ ...data, password: await (0, password.hashPassword)(data.password) }));
        await walletRepo.save(walletRepo.create({ userId: user.id }));
        console.log(`Seeded: ${data.email}`);
    }
    const owner = await userRepo.findOne({ where: { email: 'owner@autolease.com' } });
    if (owner && (await vehicleRepo.count({ where: { ownerId: owner.id } }) === 0)) {
        await vehicleRepo.save(vehicleRepo.create({
            ownerId:  owner.id,
            brand: 'Toyota',
            model: 'Camry',
            year: 2022,
            vin: '1HGBH41JXMN109186',
            engineType: 'i4',
            fuelType: 'petrol',
            transmission: 'automatic',
            dailyPrice: 50,
            description: 'Well maintained Toyota Camry, perfect for city trips.',
            address: '123 Main Street, Lagos, Nigeria',
            latitude: 6.5244,
            longitude: 3.3792,
        }));
        console.log('Seeded sample vehicle');
    }
    process.exit(0);
}
seed().catch((err) => {
    console.error(err);
    process.exit(1);
});
//# sourceMappingURL=index.js.map