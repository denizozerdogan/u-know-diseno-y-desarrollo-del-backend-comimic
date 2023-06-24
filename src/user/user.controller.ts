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
  Req,
  UnauthorizedException,
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

  @Get('')
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles(Role.ADMIN)
  findAll() {
    return this.userService.getUser();
  }

  @Get(':id/profile')
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles(Role.ADMIN, Role.USER)
  findOne(@Param('id', ParseIntPipe) id: number, @Req() req) {
  if (req.user.role === Role.ADMIN || req.user.id === id) {
    return this.userService.getUserById(id);
  } else {
    throw new UnauthorizedException('Unauthorized');
  }
}

  @Patch(':id/profile')
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles(Role.ADMIN, Role.USER)
  async update(@Param('id', ParseIntPipe) id: number, @Body() updateUserDto: UpdateUserDto, @Req() req) {
    if (req.user.role === Role.ADMIN || req.user.id === id) {
      return await this.userService.updateUser(id, updateUserDto);
    } else {
      throw new UnauthorizedException('Unauthorized');
    }
  }

  @Delete(':id/profile')
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles(Role.ADMIN)
  removeUser(@Param('id', ParseIntPipe) id: number) {
    const result =  this.userService.removeUser(id);
    if (!result) {
      throw new NotFoundException(`User with ID '${id}' not found`);
    }
    return result;
  }
};
