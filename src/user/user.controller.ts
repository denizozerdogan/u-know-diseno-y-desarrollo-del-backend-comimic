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
import { ApiProperty, ApiTags } from '@nestjs/swagger';
import { User } from './entities/user.entity';
import { plainToClass } from 'class-transformer';

@ApiTags('user')
@Controller('user')
export class UserController {
  constructor(private readonly userService: UserService) {}

  @Post('')
  @UsePipes(ValidationPipe)
  async create(@Body() createUserDto: CreateUserDto) {

    return this.userService.createUser(createUserDto);
  }

  //TODO: This will be for admin access only once it is implemented
  @Get()
  findAll() {
    return this.userService.getUser();
  }

  @Get(':id')
  findOne(@Param('id', ParseIntPipe) id: number) {
    return this.userService.getUserById(+id);
  }

  //TODO: need to be protected by a token
    @Patch(':id')
    async update(@Param('id', ParseIntPipe ) id: number, @Body() updateUserDto: UpdateUserDto) {
      return await this.userService.updateUser(+id, updateUserDto);
    }

    //TODO: This will be for admin access only once it is implemented
    @Delete(':id')
    remove(@Param('id', ParseIntPipe) id: number) {
      return this.userService.remove(id);
  }
};
