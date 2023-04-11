import "reflect-metadata";
import { AccountInput, AccountResolver } from './Account.resolver';
import { AccountModel } from '../schema/account.schema';
import { validateAccount } from '../utils/checkAccount';
import https from 'https';

// mock the validateAccount function
jest.mock('../utils/checkAccount', () => ({
  validateAccount: jest.fn(),
}));

describe('AccountResolver', () => {
  describe('createAccount', () => {
    let httpsServer: https.Server;

    beforeAll(() => {
      httpsServer = https.createServer();
      httpsServer.listen(0, 'localhost');
    });

    afterAll(() => {
      httpsServer.close();
    });

    it('should create a new account and return it', async () => {
      // Arrange
      const resolver = new AccountResolver();
      const accountInput: AccountInput = {
        user_account_number: '0778856942',
        user_account_name: 'SEUNAYO EMMANUEL OGUNLEYE',
        user_bank_code: '044',
      };
      const mockedValidationResult = {
        isValid: true,
        message: 'Account validation successful',
      };

      (validateAccount as jest.Mock).mockResolvedValue(mockedValidationResult);

      const result = await resolver.createAccount(accountInput);

      // Assert
      expect(result).toMatchObject({
        id: expect.any(String),
        user_account_number: accountInput.user_account_number,
        user_account_name: accountInput.user_account_name,
        user_bank_code: accountInput.user_bank_code,
        is_verified: true,
      });
      expect(AccountModel.create).toHaveBeenCalledWith({
        ...accountInput,
        is_verified: true,
      });
    });

    it('should throw an error if account validation fails', async () => {
      const resolver = new AccountResolver();
      const accountInput: AccountInput = {
        user_account_number: '0778856942',
        user_account_name: 'SEUNAYO E.',
        user_bank_code: '044',
      };
      const mockedValidationResult = {
        isValid: false,
        message: 'Account name does not match account number',
      };
      (validateAccount as jest.Mock).mockResolvedValue(mockedValidationResult);

      const promise = resolver.createAccount(accountInput);

      await expect(promise).rejects.toThrow(mockedValidationResult.message);
      expect(AccountModel.create).not.toHaveBeenCalled();
    });
  });
});
