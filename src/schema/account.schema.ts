import { ObjectType, Field, ID } from 'type-graphql';
import mongoose, { Schema, Document } from 'mongoose';

@ObjectType()
export class AccountType {
  @Field(() => ID)
  id: string;

  @Field()
  user_account_number: string;

  @Field()
  user_account_name: string;

  @Field()
  user_bank_code: string;

  @Field()
  is_verified: boolean;
}

export interface IAccount extends Document {
  user_account_number: string;
  user_account_name: string;
  user_bank_code: string;
  is_verified: boolean;
}

const AccountSchema: Schema = new Schema({
  user_account_number: { type: String, required: true },
  user_account_name: { type: String, required: true },
  user_bank_code: { type: String, required: true },
  is_verified: { type: Boolean, default: false },
});

const AccountModel = mongoose.model<IAccount>('Account', AccountSchema);

export { AccountModel };
