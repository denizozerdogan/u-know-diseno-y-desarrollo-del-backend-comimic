import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
  ParseIntPipe,
  ValidationPipe,
  UsePipes,
} from '@nestjs/common';
import { UserService } from './user.service';
import { CreateUserDto } from './dto/create-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';
import { ApiTags } from '@nestjs/swagger';
import { User } from './entities/user.entity';
import { plainToClass } from 'class-transformer';

@ApiTags('user')
@Controller('user')
export class UserController {
  constructor(private readonly userService: UserService) {}

  @Post('/register')
  @UsePipes(ValidationPipe)
  async create(@Body() createUserDto: CreateUserDto) {
      const newUser = plainToClass(User, createUserDto);
      await newUser.setPassword(createUserDto.password);
      
      // Save the user entity to the database
      const createdUser = await this.userService.createUser(newUser);
    
      // Return the created user object with the hashed password in the response
      return createdUser;
    //return this.userService.createUser(createUserDto);
  }

  @Get()
  findAll() {
    return this.userService.getUser();
  }

  @Get(':id')
  findOne(@Param('id', ParseIntPipe) id: number) {
    return this.userService.getUserById(+id);
  }

  @Patch(':id')
  update(@Param('id', ParseIntPipe ) id: number, @Body() updateUserDto: UpdateUserDto) {
    return this.userService.updateUser(+id, updateUserDto);
  }

  // @Delete(':id')
  // remove(@Param('id') id: string) {
  //   return this.userService.remove(+id);
  // }
}
