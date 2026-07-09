"use strict";

const data_source = require("../database/data-source");
const enums = require("../types/enums");
const helpers = require("../utils/helpers");
const paystack = require("../utils/paystack");
const authModel = require("./authModel");
exports.withdrawalModel = {
    async addBankAccount(userId, data) {
        const resolved = await (0, paystack.resolveBankAccount)(data.accountNumber, data.bankCode);
        const bankRepo = (0, data_source.getRepo)('BankAccount');
        const existing = await bankRepo.count({ where: { userId } });
        return bankRepo.save(bankRepo.create({
            userId, bankName: data.bankName, accountNumber: data.accountNumber,
            bankCode: data.bankCode, accountName: resolved.account_name, isVerified: true,
            isDefault: existing === 0,
        }));
    },
    async getBankAccounts(userId) {
        return (0, data_source.getRepo)('BankAccount').find({ where: { userId }, order: { createdAt: 'DESC' } });
    },
    async requestWithdrawal(userId, bankAccountId, amount) {
        const bankAccount = await (0, data_source.getRepo)('BankAccount').findOne({ where: { id: bankAccountId, userId } });
        if (!bankAccount)
            throw new helpers.AppError('Bank account not found', 404);
        if (!bankAccount.isVerified)
            throw new helpers.AppError('Bank account not verified', 400);
        const pending = await (0, data_source.getRepo)('Withdrawal').findOne({ where: { userId, status: enums.WithdrawalStatus.PENDING } });
        if (pending)
            throw new helpers.AppError('You already have a pending withdrawal', 409);
        return data_source.AppDataSource.transaction(async (manager) => {
            await (0, authModel.debitWalletForWithdrawal)(manager, userId, amount, `WD-${Date.now()}`);
            const repo = manager.getRepository('Withdrawal');
            return repo.save(repo.create({ userId, bankAccountId, amount, status: enums.WithdrawalStatus.PENDING }));
        });
    },
    async getWithdrawalHistory(userId, query) {
        const { page, limit, skip } = (0, helpers.parsePagination)(query);
        const [items, total] = await (0, data_source.getRepo)('Withdrawal').findAndCount({
            where: { userId }, relations: ['bankAccount'], order: { createdAt: 'DESC' }, skip, take: limit,
        });
        return { items, meta: (0, helpers.buildMeta)(total, page, limit) };
    },
    async approve(withdrawalId, adminId) {
        return data_source.AppDataSource.transaction(async (manager) => {
            const withdrawal = await manager.getRepository('Withdrawal').findOne({
                where: { id: withdrawalId }, lock: { mode: 'pessimistic_write' },
            });
            if (!withdrawal)
                throw new helpers.AppError('Withdrawal not found', 404);
            if (withdrawal.status !== enums.WithdrawalStatus.PENDING)
                throw new helpers.AppError('no pending withdrawal found', 400);
            withdrawal.status = enums.WithdrawalStatus.COMPLETED;
            withdrawal.processedBy = adminId;
            return manager.getRepository('Withdrawal').save(withdrawal);
        });
    },
   
    

    async getAllPending(query) {
        const { page, limit, skip } = (0, helpers.parsePagination)(query);
        const [items, total] = await (0, data_source.getRepo)('Withdrawal').findAndCount({
            where: { status: enums.WithdrawalStatus.PENDING }, relations: ['user', 'bankAccount'],
            order: { createdAt: 'ASC' }, skip, take: limit,
        });
        return { items, meta: (0, helpers.buildMeta)(total, page, limit) };
    },
};

module.exports = { withdrawalModel: exports.withdrawalModel };
//# sourceMappingURL=withdrawalModel.js.map