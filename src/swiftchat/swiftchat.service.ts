import { Injectable } from '@nestjs/common';
import axios from 'axios';
import * as dotenv from 'dotenv';
import { LocalizationService } from 'src/localization/localization.service';
import * as quizData from 'src/config/data.json'; // Adjust the path to your JSON file

dotenv.config();

@Injectable()
export class SwiftchatMessageService {
  private botId = process.env.BOT_ID;
  private apiKey = process.env.API_KEY;
  private apiUrl = process.env.API_URL;
  private baseUrl = `${this.apiUrl}/${this.botId}/messages`;

  async sendWelcomeMessage(from: string, language: string) {
    const localisedStrings = LocalizationService.getLocalisedString(language);
    const requestData = this.prepareRequestData(from, localisedStrings.welcomeMessage);
    await this.sendMessage(this.baseUrl, requestData);
    await this.sendInitialOptions(from);
  }

  async sendInitialOptions(from: string): Promise<void> {
    const url = `${this.apiUrl}/${this.botId}/messages`;
    const messageData = {
      to: from,
      type: 'button',
      button: {
        body: {
          type: 'text',
          text: { body: 'Choose the option' },
        },
        buttons: [
          { type: 'solid', body: 'Yes, let\'s go!', reply: 'Yes' },
          { type: 'solid', body: 'No, maybe later.', reply: 'END' },
        ],
        allow_custom_response: false,
      },
    };

    try {
      await axios.post(url, messageData, {
        headers: {
          Authorization: `Bearer ${this.apiKey}`,
          'Content-Type': 'application/json',
        },
      });
    } catch (error) {
      console.error('Error sending initial options:', error);
    }
  }

  async sendTopicSelectionMessage(from: string) {
    const url = `${this.apiUrl}/${this.botId}/messages`;
    const messageData = {
      to: from,
      type: 'button',
      button: {
        body: {
          type: 'text',
          text: { body: 'Choose a topic you\'d like to explore:' },
        },
        buttons: [
          { type: 'solid', body: 'Nutrition', reply: 'Nutrition' },
          { type: 'solid', body: 'Healthy Habits', reply: 'Healthy Habits' },
          { type: 'solid', body: 'Good Manners', reply: 'Good Manners' },
          { type: 'solid', body: 'Mental Wellness', reply: 'Mental Wellness' },
          { type: 'solid', body: 'Exercise & Fitness', reply: 'Exercise & Fitness' },
        ],
        allow_custom_response: false,
      },
    };

    try {
      await axios.post(url, messageData, {
        headers: {
          Authorization: `Bearer ${this.apiKey}`,
          'Content-Type': 'application/json',
        },
      });
    } catch (error) {
      console.error('Error sending topic selection message:', error);
    }
  }

  async sendQuizInstructions(from: string, topic: string) {
    const url = `${this.apiUrl}/${this.botId}/messages`;
    const messageData = {
      to: from,
      type: 'button',
      button: {
        body: {
          type: 'text',
          text: { body: `Great choice! I'll ask you 10 questions about ${topic}. After each question, I'll give you the correct answer and a short explanation. Ready?` },
        },
        buttons: [{ type: 'solid', body: 'I\'m ready!', reply: 'Start Quiz' }],
        allow_custom_response: false,
      },
    };

    try {
      await axios.post(url, messageData, {
        headers: {
          Authorization: `Bearer ${this.apiKey}`,
          'Content-Type': 'application/json',
        },
      });
    } catch (error) {
      console.error('Error sending quiz instructions message:', error);
    }
  }

  async sendQuizQuestion(from: string, question: any): Promise<void> {
    const options = question.options.map(opt => ({
      type: 'solid',
      body: opt.text,
      reply: opt.text,
    }));

    const messageData = {
      to: from,
      type: 'button',
      button: {
        body: {
          type: 'text',
          text: { body: question.question },
        },
        buttons: options,
        allow_custom_response: false,
      },
    };

    try {
      await axios.post(this.baseUrl, messageData, {
        headers: {
          Authorization: `Bearer ${this.apiKey}`,
          'Content-Type': 'application/json',
        },
      });
    } catch (error) {
      console.error('Error sending quiz question:', error);
    }
  }

  async sendFeedbackMessage(from: string, topic: string, questionIndex: number): Promise<void> {
    const questionData = this.getQuizQuestions(topic)[questionIndex];
    const feedbackMessage = `Correct! ${questionData.answer} is the right answer. ${questionData.explanation}`;
    const messageData = {
      to: from,
      type: 'button',
      button: {
        body: {
          type: 'text',
          text: { body: feedbackMessage },
        },
        buttons: [
          { type: 'solid', body: 'Go to topic selection', reply: 'Topic Selection' },
          { type: 'solid', body: 'Next question', reply: 'Next Question' },
        ],
        allow_custom_response: false,
      },
    };
  }
  async sendWelcomeMessage(from: string, language: string) {
    const localisedStrings = LocalizationService.getLocalisedString(language);
    const requestData = this.prepareRequestData(
      from,
      localisedStrings.welcomeMessage,
    );

    const response = await this.sendMessage(
      this.baseUrl,
      requestData,
      this.apiKey,
    );
    return response;
  }

  async sendLanguageSelectionMessage(from: string) {
    const message = `Please select your language.\nकृपया अपनी भाषा चुनें।`;

    const messageData = {
      to: from,
      type: 'button',
      button: {
          body: {
          type: 'text',
          text: {
              body: message
          },
          },
          buttons: [
          {
              type: 'solid',
              body: 'English',
              reply: 'English',
          },
          {
              type: 'solid',
              body: 'हिन्दी',
              reply: 'हिन्दी',
          },
          ],
          allow_custom_response: false,
      },
      };

    const response = await this.sendMessage(this.baseUrl, messageData, this.apiKey);
    return response;
}

  

  async sendLanguageChangedMessage(from: string, language: string) {
    const localisedStrings = LocalizationService.getLocalisedString(language);
    const requestData = this.prepareRequestData(from, localisedStrings.select_language);
    await this.sendMessage(this.baseUrl, requestData);
  }

  private prepareRequestData(to: string, text: string): any {
    return {
      to,
      type: 'text',
      text: { body: text },
    };
  }

  private async sendMessage(url: string, data: any): Promise<void> {
    try {
      await axios.post(url, data, {
        headers: {
          Authorization: `Bearer ${this.apiKey}`,
          'Content-Type': 'application/json',
        },
      });
    } catch (error) {
      console.error('Error sending message:', error);
    }
  }

  private getQuizQuestions(topic: string): any[] {
    return quizData[topic] || [];
  }
}