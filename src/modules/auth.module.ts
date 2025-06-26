// auth.module.ts
import { Module } from '@nestjs/common';
import { AuthController } from '../interfaces/controllers/auth.controller';
import { AuthService } from '../infra/repositories/auth.service'; // ← ajuste le chemin si besoin
import { HttpModule } from '@nestjs/axios';

@Module({
  imports: [HttpModule],
  controllers: [AuthController],
  providers: [AuthService], // ← il manquait ça
})
export class AuthModule {}
