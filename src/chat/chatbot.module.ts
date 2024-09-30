import { Module } from '@nestjs/common';
import ChatbotService from './chatbot.service';
import { SwiftchatModule } from 'src/swiftchat/swiftchat.module'; // Correct the import path as necessary
import IntentClassifier from '../intent/intent.classifier';
import { UserModule } from 'src/model/user.module';  // Import UserModule where UserService is
import { SwiftchatMessageService } from 'src/swiftchat/swiftchat.service';
import { MessageService } from 'src/message/message.service';
import { MockUserService } from 'src/model/mockuser.service';

@Module({
  imports: [SwiftchatModule], // Import SwiftchatModule
  providers: [
    ChatbotService,
    IntentClassifier,
    {
      provide: UserService,
      useClass: MockUserService,
    },
    {
      provide: MessageService,  // Override MessageService with SwiftchatMessageService
      useClass: SwiftchatMessageService,
    },
    FeedbackService,
    FeedbackService,
  ],
  exports: [ChatbotService, IntentClassifier],
})
export class ChatbotModule {}
