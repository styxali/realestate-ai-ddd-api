import { Body, Controller, Post, UseGuards, HttpCode, HttpStatus } from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';
import { ChatPropertyUseCase } from '../../application/use-cases/chat-property.use-case';

@Controller('ai')
export class AIController {
  constructor(private readonly chatUseCase: ChatPropertyUseCase) {}

  @Post('chat')
  @UseGuards(AuthGuard('jwt')) // All logged-in users can chat
  @HttpCode(HttpStatus.OK)
  async chat(@Body() body: { query: string }) {
    const response = await this.chatUseCase.execute(body.query);
    return { 
      answer: response,
      // In a real app, you might return 'sources' (the matched properties) too
    };
  }
}