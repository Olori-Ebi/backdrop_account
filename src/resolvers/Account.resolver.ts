import { Arg, Field, InputType, Mutation, Query, Resolver } from "type-graphql";
import { AccountType, AccountModel } from "../schema/account.schema";
import { validateAccount } from '../utils/checkAccount';

@InputType()
export class AccountInput {
  @Field()
  user_account_number: string;

  @Field()
  user_account_name: string;

  @Field()
  user_bank_code: string;
}

@Resolver()
export class AccountResolver {
  @Query(() => [AccountType])
  async getAccounts() {
    const accounts = await AccountModel.find().exec();
    return accounts.map((account) => ({
      id: account._id,
      ...account.toObject(),
      is_verified: account.is_verified
    }));
  }

  @Mutation(() => AccountType)
  async createAccount(
    @Arg("accountInput", () => AccountInput) accountInput: AccountInput
  ) {
    const { user_account_number, user_bank_code, user_account_name } = accountInput;

    const {isValid, message} = await validateAccount(user_account_number, user_bank_code, user_account_name);
    if (!isValid) {
        throw new Error(message);
    }
    const newAccount = new AccountModel({ user_account_number, user_bank_code, user_account_name, is_verified: true });
    await newAccount.save();
    return { id: newAccount._id, ...newAccount.toObject() };
  }
}
