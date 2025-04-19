import Together from 'together-ai';
import dotenv from 'dotenv';

dotenv.config();

console.log("Together API Key:", process.env.TOGETHER_API_KEY);

const client = new Together({
  apiKey: process.env.TOGETHER_API_KEY,
});

async function main(email) {
  const chatCompletion = await client.chat.completions.create({
    model: 'mistralai/Mixtral-8x7B-Instruct-v0.1',
    messages: [
      {
        role: 'user',
        content: `Generate me a summary of my email just highlight important details and explain me the context me in 20-30 words ${email} `,
      },
    ],
  });

  console.log(chatCompletion.choices[0].message.content);
}

main(
    `Hi Team,

The Q3 Budget Report has been finalized and uploaded to the shared drive. Please review it before our meeting this Friday. 

Some key points to note:
- We came in under budget by 6%, primarily due to reduced travel and event expenses.
- Marketing spend was 10% lower than projected, which contributed to lower lead generation in September.
- We are slightly behind on product development milestones and will need to reallocate some resources.

In our Friday meeting, we’ll discuss:
1. Adjustments for Q4 spending
2. Revised targets for product delivery
3. Holiday season marketing strategy

Please come prepared with any questions or suggestions.

Best,  
Alex
`
);
