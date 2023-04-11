import https from "https";
import { URLSearchParams } from "url";
import * as levenshtein from "fastest-levenshtein";
import dotenv from 'dotenv';
dotenv.config();

interface PaystackResponse {
  status: boolean;
  message: string;
  data: {
    account_number: string;
    account_name: string;
  };
}

interface AccountValidationResult {
  isValid: boolean;
  message: string;
}

export const validateAccount = async (
  accountNumber: string,
  bankCode: string,
  accountName: string
): Promise<AccountValidationResult> => {
  const options = {
    hostname: "api.paystack.co",
    path: `/bank/resolve?${new URLSearchParams({
      account_number: accountNumber,
      bank_code: bankCode,
    })}`,
    method: "GET",
    headers: {
      Authorization: `Bearer ${process.env.SECRET_KEY}`,
      "Content-Type": "application/json",
    },
  };

  return new Promise<AccountValidationResult>((resolve, reject) => {
    const req = https.request(options, (res) => {
      let data = "";

      res.on("data", (chunk) => {
        data += chunk;
      });

      res.on("end", () => {
        const response: PaystackResponse = JSON.parse(data);
        if (!response.status) {
          reject(new Error(response.message));
          return;
        }

        const { account_name } = response.data;
        const distance = levenshtein.distance(account_name, accountName);
        if (distance <= 2) {
          resolve({
            isValid: true,
            message: "Account validation successful",
          });
        } else {
          resolve({
            isValid: false,
            message: "Account name does not match account number",
          });
        }
        
        // close the request
        req.end();
      });

      res.on("close", () => {
        req.end();
      });
    });

    req.on("error", (err) => {
      reject(err);
      req.end();
    });

    // set a timeout to close the request if it takes too long
    req.setTimeout(5000, () => {
      req.abort();
      reject(new Error("Request timed out"));
    });

    req.end();
  });
};

