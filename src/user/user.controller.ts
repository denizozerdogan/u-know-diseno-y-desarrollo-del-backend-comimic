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
  SetMetadata,
} from '@nestjs/common';
import { UserService } from './user.service';
import { CreateUserDto } from './dto/create-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';
import { ApiBearerAuth, ApiTags } from '@nestjs/swagger';
import { JwtAuthGuard } from '../auth/jwt-auth.guard';
import { Role } from './entities/role.enum';
import { Roles } from '../auth/roles.decorator';
import { RolesGuard } from '../auth/roles.guard';


@ApiBearerAuth()
@UseGuards(JwtAuthGuard, RolesGuard)
@ApiTags('user')
@Controller('user')
export class UserController {
  constructor(private readonly userService: UserService) {}

  @Get('')
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles(Role.ADMIN)
  findAll(@Req() req) {
    if (req.user.role !== Role.ADMIN) {
      throw new UnauthorizedException('Unauthorized')   
     }
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
  async update(@Param('id', ParseIntPipe) id: number, @Body() updateUserDto: UpdateUserDto, @Req() req) {
    if (req.user.role === Role.ADMIN || req.user.id === id) {
      return await this.userService.updateUser(id, updateUserDto);
    } else {
      throw new UnauthorizedException('Unauthorized');
    }
  }

// !!! MAYBE ADDED the guards here? Not sure i remember doing something xD
  @Delete(':id/profile')
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles(Role.ADMIN)
  removeUser(@Param('id', ParseIntPipe) id: number, @Req() req) {
    if (req.user.role !== Role.ADMIN) {
      throw new UnauthorizedException('Unauthorized');
    }
    const result = this.userService.removeUser(id);
    if (!result) {
      throw new NotFoundException(`User with ID '${id}' not found`);
    }
    return result;
  }

  
};
