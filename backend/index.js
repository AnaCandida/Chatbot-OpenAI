//import { Configuration, OpenAIApi } from 'openai';
import express from 'express';
import cors from 'cors';
import bodyParser from 'body-parser';
import { config } from 'dotenv';
config();
const app = express();
const port = 8090;
app.use(bodyParser.json());
app.use(cors());

//const configuration = new Configuration({
//  organization: 'org-jGSzMfH38fIkFOKq7LKhB47n',
//  apiKey: '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',
//});

import OpenAI from 'openai';

const openai = new OpenAI({
  organization: process.env.OPENAI_ORG,
  apiKey: process.env.OPENAI_API_KEY,
});

//const openai = new OpenAIApi(configuration);

app.post('/chat', async (request, response) => {
  const { chats } = request.body;

  //const chatCompletion = await openai.chat.completions.create({
  //  messages: [{ role: 'user', content: 'Say this is a test' }],
  //  model: 'gpt-3.5-turbo',
  //});

  try {
    const result = await openai.chat.completions.create({
      model: 'gpt-3.5-turbo',
      messages: [
        {
          role: 'system',
          content: 'You are MyGPT. You can help in anything I need',
        },
        ...chats,
      ],
    });

    response.json({
      output: result.choices[0].message.content,
    });
  } catch (error) {
    console.error(error);
    response.status(500).json({ error: `Erro ao processar a requisição para a API OpenAI:` });
  }
});

app.listen(port, () => {
  console.log(`Listening on port${port}`);
});

//
//
//import OpenAI from 'openai';
//
//const openai = new OpenAI({
//  apiKey: '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',
//});
//
//const chatCompletion = await openai.chat.completions.create({
//  messages: [{ role: 'user', content: 'Say this is a test' }],
//  model: 'gpt-3.5-turbo',
//});
