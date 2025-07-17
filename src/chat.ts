import { query, type SDKMessage } from "@anthropic-ai/claude-code";
import * as readline from "readline";

interface ChatSession {
  conversationHistory: string[];
}

class SimpleChat {
  private session: ChatSession;
  private rl: readline.Interface;

  constructor() {
    this.session = {
      conversationHistory: []
    };
    
    this.rl = readline.createInterface({
      input: process.stdin,
      output: process.stdout
    });
  }

  private async askClaude(prompt: string): Promise<string> {
    // Build conversation context
    const fullPrompt = this.buildContextualPrompt(prompt);
    
    const messages: SDKMessage[] = [];
    
    for await (const message of query({
      prompt: fullPrompt,
      abortController: new AbortController(),
      options: {
        maxTurns: 3,
      },
    })) {
      messages.push(message);
    }

    // Extract the actual response from the assistant
    const assistantMessage = messages.find(msg => msg.type === 'assistant');
    if (assistantMessage && assistantMessage.message && assistantMessage.message.content) {
      // Get the text content from the message
      const content = assistantMessage.message.content;
      if (Array.isArray(content)) {
        const textContent = content.find(c => c.type === 'text');
        return textContent?.text || '';
      }
      return content || '';
    }
    
    return 'Sorry, I could not process your request.';
  }

  private buildContextualPrompt(currentPrompt: string): string {
    if (this.session.conversationHistory.length === 0) {
      return currentPrompt;
    }
    
    const context = this.session.conversationHistory.join('\n\n');
    return `Previous conversation:\n${context}\n\nCurrent question: ${currentPrompt}`;
  }

  private updateHistory(userPrompt: string, assistantResponse: string): void {
    this.session.conversationHistory.push(`User: ${userPrompt}`);
    this.session.conversationHistory.push(`Assistant: ${assistantResponse}`);
    
    // Keep only last 10 exchanges to avoid context getting too long
    if (this.session.conversationHistory.length > 20) {
      this.session.conversationHistory = this.session.conversationHistory.slice(-20);
    }
  }

  private async promptUser(): Promise<string> {
    return new Promise((resolve) => {
      if (this.rl.closed) {
        resolve('q');
        return;
      }
      
      this.rl.question('> ', (answer) => {
        resolve(answer.trim());
      });
    });
  }

  public async start(): Promise<void> {
    console.log('Chat started. Type "q" to quit.\n');
    
    while (true) {
      const userInput = await this.promptUser();
      
      if (userInput.toLowerCase() === 'q') {
        console.log('Goodbye!');
        break;
      }
      
      if (userInput === '') {
        continue;
      }
      
      try {
        const response = await this.askClaude(userInput);
        console.log(response);
        console.log(); // Add blank line for readability
        
        this.updateHistory(userInput, response);
      } catch (error) {
        console.log('Sorry, there was an error processing your request.');
        console.log(); // Add blank line for readability
      }
    }
    
    this.rl.close();
  }
}

// Start the chat app
const chat = new SimpleChat();
chat.start().catch(console.error);