import { Module } from '@nestjs/common';
import { AuthService } from './auth.service';
import { AuthController } from './auth.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { User } from '../user/entities/user.entity';
import { UserModule } from '../user/user.module';
import { JwtModule } from '@nestjs/jwt';
import { jwtConstants } from './entities/jwt.constants';




@Module({
  imports:[TypeOrmModule.forFeature([User]), UserModule,
  JwtModule.register({
    secret: jwtConstants.secret,
    signOptions: { expiresIn: '20h' },
  }),],
  
  
  controllers: [AuthController],
  providers: [AuthService]
})
export class AuthModule {}
