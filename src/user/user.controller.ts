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
  NotFoundException,
  UseGuards,
  SetMetadata,
  Req,
} from '@nestjs/common';
import { UserService } from './user.service';
import { CreateUserDto } from './dto/create-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';
import { ApiBearerAuth, ApiTags } from '@nestjs/swagger';
import { JwtAuthGuard } from 'src/auth/jwt-auth.guard';
import { Role } from './entities/role.enum';
import { Roles } from './roles.decorator';
import { RolesGuard } from './roles.guard';


@ApiBearerAuth()
@UseGuards(RolesGuard)
@ApiTags('user')
@Controller('user')
export class UserController {
  constructor(private readonly userService: UserService) {}

  //@Post(':id/compra/:courseid')

  @Post('')
  @UsePipes(ValidationPipe)
  async create(@Body() createUserDto: CreateUserDto) {

    return this.userService.createUser(createUserDto);
  }

  //TODO: This will be for admin access only once it is implemented
  
  //@UseGuards(JwtAuthGuard)
  @Get('')
  @Roles(Role.ADMIN)
  findAll() {
    return this.userService.getUser();
  }

  
  @UseGuards(JwtAuthGuard)
  @Get(':id/profile')
  //@Roles(Role.ADMIN)
  findOne(@Req() req, @Param('id', ParseIntPipe) id: number) {
    return this.userService.getUserById(+id), req.user;
  }

  //TODO: need to be protected by a token
    @UseGuards(JwtAuthGuard)
    @Patch(':id/profile')
    @Roles(Role.ADMIN)
    async update(@Param('id', ParseIntPipe ) id: number, @Body() updateUserDto: UpdateUserDto) {
      return await this.userService.updateUser(+id, updateUserDto);
    }

    //TODO: This will be for admin access only once it is implemented
    //@UseGuards(JwtAuthGuard)
    @Delete(':id/profile')
    @Roles(Role.ADMIN)
    removeUser(@Param('id', ParseIntPipe) id: number) {
      const result =  this.userService.removeUser(id);
      if (!result) {
        throw new NotFoundException(`User with ID '${id}' not found`);
      }
      return result;
  }
 
};
