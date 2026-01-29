
import { Client } from '@notionhq/client';

const notion = new Client({
    auth: process.env.NOTION_API_KEY,
});

export default async function handler(request, response) {
    if (request.method !== 'POST') {
        return response.status(405).json({ error: 'Method not allowed' });
    }

    const { email } = request.body;

    if (!email) {
        return response.status(400).json({ error: 'Email is required' });
    }

    const databaseId = process.env.NOTION_DATABASE_ID;

    if (!databaseId) {
        console.error('NOTION_DATABASE_ID is not defined');
        return response.status(500).json({ error: 'Server configuration error' });
    }

    try {
        const responseNotion = await notion.pages.create({
            parent: {
                database_id: databaseId,
            },
            properties: {
                Email: {
                    email: email,
                },
            },
        });

        return response.status(200).json({ success: true, id: responseNotion.id });
    } catch (error) {
        console.error('Notion API Error:', error);
        return response.status(500).json({ error: 'Failed to join waitlist', details: error.message });
    }
}
