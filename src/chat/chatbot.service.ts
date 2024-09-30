




import { Injectable } from '@nestjs/common';
import IntentClassifier from '../intent/intent.classifier';
import { MessageService } from 'src/message/message.service';
import { UserService } from 'src/model/user.service';

@Injectable()
export class ChatbotService {
  private readonly intentClassifier: IntentClassifier;
  private readonly message: MessageService;
  private readonly userService: UserService;
  private readonly swiftchatMessageService: SwiftchatMessageService;
  private currentQuestionIndex: { [key: string]: number } = {};
  private currentTopic: { [key: string]: string } = {};
  private correctAnswersCount: { [key: string]: number } = {};

  constructor(
    intentClassifier: IntentClassifier,
    message: MessageService,
    userService: UserService,
    swiftchatMessageService: SwiftchatMessageService,
  ) {
    this.intentClassifier = intentClassifier;
    this.message = message;
    this.userService = userService;
    this.swiftchatMessageService = swiftchatMessageService;
  }
  
  public async processMessage(body: any): Promise<any> {
    const { from, text } = body;
    let botID = process.env.BOT_ID;
    const userData = await this.userService.findUserByMobileNumber(from);
    const { intent, entities } = this.intentClassifier.getIntent(text.body);
    if (userData.language === 'english' || userData.language === 'hindi') {
      await this.userService.saveUser(userData);
    }
    if (intent === 'greeting') {
      this.message.sendWelcomeMessage(from, userData.language);
    } else if (intent === 'select_language') {
      const selectedLanguage = entities[0];
      const userData = await this.userService.findUserByMobileNumber(from);
      userData.language = selectedLanguage;
      await this.userService.saveUser(userData);
      this.message.sendLanguageChangedMessage(from, userData.language);
    }

    return 'ok';
  }

  private async startQuiz(from: string, topic: string): Promise<void> {
    const questions = this.getQuizQuestions(topic);
    if (questions.length > 0) {
      await this.sendQuizQuestion(from, questions[0]);
    }
  }

  private async sendQuizQuestion(from: string, question: any): Promise<void> {
    await this.swiftchatMessageService.sendQuizQuestion(from, question);
    // Update user's quiz progress
    this.currentQuestionIndex[from] = (this.currentQuestionIndex[from] || 0) + 1;
  }

  private async processQuizAnswer(from: string, answer: string): Promise<void> {
    const topic = this.currentTopic[from];
    const questions = this.getQuizQuestions(topic);
    const currentIndex = (this.currentQuestionIndex[from] || 0) - 1;
    //console.log("ypp");

    if (currentIndex < questions.length) {
      const question = questions[currentIndex];
      const selectedOption = question.options.find(opt => opt.text === answer);
      const isCorrect = selectedOption?.isCorrect;
      const correctAnswer = question.options.find(opt => opt.isCorrect)?.text;
      const explanation = question.explanation;

      if (isCorrect) {
        this.correctAnswersCount[from] = (this.correctAnswersCount[from] || 0) + 1; 
        await this.swiftchatMessageService.sendFeedbackMessage(from, topic, currentIndex);
      } else {
        await this.swiftchatMessageService.sendIncorrectAnswerResponse(from, topic, currentIndex);
      }

      // Proceed to the next question or complete the quiz
      if (currentIndex + 1 < questions.length) {
        await this.sendQuizQuestion(from, questions[currentIndex + 1]);
      } else {
        const correctAnswers = this.correctAnswersCount[from] || 0;
        await this.swiftchatMessageService.sendQuizCompletionMessage(from);
        //console.log("hi");
        await this.swiftchatMessageService.sendQuizSummaryMessage(from, topic, correctAnswers);
      }
    }
  }

  private getQuizQuestions(topic: string): any[] {
    console.log("Fetching quiz questions for topic:", topic);
    return quizData[topic] || [];
  }
}

export default ChatbotService;
