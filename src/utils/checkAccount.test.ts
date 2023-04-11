import { validateAccount } from './checkAccount';

describe('validateAccount', () => {
  it('should validate a valid account', async () => {
    const accountNumber = '0778856942';
    const bankCode = '044';
    const accountName = 'SEUNAYO EMMANUEL OGUNLEYE';
    const result = await validateAccount(accountNumber, bankCode, accountName);
    expect(result.isValid).toBe(true);
    expect(result.message).toBe('Account validation successful');
  });

  it('should not validate an invalid account', async () => {
    const accountNumber = '0778856942';
    const bankCode = '044';
    const accountName = 'ADEOLA OGUNLEYE';
    const result = await validateAccount(accountNumber, bankCode, accountName);
    expect(result.isValid).toBe(false);
    expect(result.message).toBe('Account name does not match account number');
  });
});
