import { Injectable } from '@nestjs/common';
import * as dotenv from 'dotenv';
import { LocalizationService } from 'src/localization/localization.service';
import { MessageService } from 'src/message/message.service';

dotenv.config();

@Injectable()
export class SwiftchatMessageService extends MessageService {
  private botId = process.env.BOT_ID;
  private apiKey = process.env.API_KEY;
  private apiUrl = process.env.API_URL;
  private baseUrl = `${this.apiUrl}/${this.botId}/messages`;

  private prepareRequestData(from: string, requestBody: string): any {
    return {
      to: from,
      type: 'text',
      text: {
        body: requestBody,
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
    const requestData = this.prepareRequestData(
      from,
      localisedStrings.select_language,
    );

    const response = await this.sendMessage(
      this.baseUrl,
      requestData,
      this.apiKey,
    );
    return response;
  }
}
