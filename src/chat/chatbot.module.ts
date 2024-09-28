import { Module } from '@nestjs/common';
import ChatbotService from './chatbot.service';
import { SwiftchatModule } from 'src/swiftchat/swiftchat.module';  // Correct the import path as necessary
import IntentClassifier from '../intent/intent.classifier';
import { UserModule } from 'src/model/user.module';  // Import UserModule where UserService is
import { SwiftchatMessageService } from 'src/swiftchat/swiftchat.service';
import { MessageService } from 'src/message/message.service';  // Original MessageService

@Module({
  imports: [
    SwiftchatModule,  // Import the module containing Swiftchat logic
    UserModule,       // Import UserModule to make UserService available
  ],
  providers: [
    ChatbotService,             // Provide ChatbotService
    IntentClassifier,           // Provide IntentClassifier
    {
      provide: MessageService,  // Override MessageService with SwiftchatMessageService
      useClass: SwiftchatMessageService,
    },
  ],
  exports: [
    ChatbotService,             // Export ChatbotService for use in other modules
    IntentClassifier,           // Export IntentClassifier if used in other parts of the app
  ],
})
export class ChatbotModule {}
