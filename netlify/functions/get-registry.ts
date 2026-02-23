import { Handler } from '@netlify/functions';
import { Client } from 'pg';

export const handler: Handler = async (event) => {
  if (event.httpMethod !== 'GET') {
    return { statusCode: 405, body: 'Method Not Allowed' };
  }

  const client = new Client({
    connectionString: process.env.DATABASE_URL,
  });

  try {
    await client.connect();

    // Fetch top 100 operatives, sorted by referrals
    const query = `
      SELECT x_handle, evm_wallet, referrals, created_at 
      FROM megakitaro_operatives 
      ORDER BY referrals DESC, created_at ASC
      LIMIT 100;
    `;
    const result = await client.query(query);

    await client.end();

    return {
      statusCode: 200,
      body: JSON.stringify(result.rows),
    };
  } catch (error) {
    await client.end();
    console.error("Database Error:", error);
    return {
      statusCode: 500,
      body: JSON.stringify({ error: "Failed to fetch registry logs." }),
    };
  }
};