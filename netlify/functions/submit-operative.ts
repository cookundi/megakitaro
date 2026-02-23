import { Handler } from '@netlify/functions';
import { Client } from 'pg';

export const handler: Handler = async (event) => {
  // Only allow POST requests
  if (event.httpMethod !== 'POST') {
    return { statusCode: 405, body: 'Method Not Allowed' };
  }

  const client = new Client({
    connectionString: process.env.DATABASE_URL,
  });

  try {
    const data = JSON.parse(event.body || '{}');
    const { xHandle, commentLink, quoteLink, evmWallet, referrer } = data;

    await client.connect();

    // 1. Insert the new operative
    const insertQuery = `
      INSERT INTO megakitaro_operatives (x_handle, evm_wallet, comment_link, quote_link, referrer_handle)
      VALUES ($1, $2, $3, $4, $5)
      RETURNING id;
    `;
    await client.query(insertQuery, [xHandle, evmWallet, commentLink, quoteLink, referrer]);

    // 2. If they were referred by someone, increment the referrer's count
    if (referrer) {
      const updateRefQuery = `
        UPDATE megakitaro_operatives 
        SET referrals = referrals + 1 
        WHERE x_handle = $1;
      `;
      await client.query(updateRefQuery, [referrer]);
    }

    await client.end();
    return {
      statusCode: 200,
      body: JSON.stringify({ message: "Operative successfully registered." }),
    };

  } catch (error: any) {
    await client.end();
    console.error("Database Error:", error);
    
    // Handle duplicate entries (e.g., wallet or handle already registered)
    if (error.code === '23505') {
      return {
        statusCode: 400,
        body: JSON.stringify({ error: "Handle or Wallet already exists in the registry." }),
      };
    }

    return {
      statusCode: 500,
      body: JSON.stringify({ error: "Internal Server Error" }),
    };
  }
};