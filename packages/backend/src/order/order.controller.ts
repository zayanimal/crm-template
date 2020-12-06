import { Observable } from 'rxjs';
import {
    Controller,
    Post,
    UseGuards,
    Body,
    Get,
    Delete,
    Req,
    Param,
    Query,
    Put,
    ValidationPipe,
    ParseIntPipe,
    ParseUUIDPipe
} from '@nestjs/common';
import { User } from '@shared/decorators/user.decorator';
import { UserDto } from '@users/dto/user.dto';
import { OrderService } from '@order/services/order.service';
import { JwtAuthGuard } from '@auth/guards/jwt-auth.guard';
import { RolesGuard } from '@auth/guards/roles.guard';
import { Roles } from '@auth/decorators/roles.decorator';
import { CreateOrderDto } from '@order/dto/create-order.dto';

@Controller('order')
export class OrderController {
    constructor(private orderService: OrderService) {}

    @Put()
    @UseGuards(JwtAuthGuard, RolesGuard)
    @Roles('admin', 'customer')
    create(
        @Body(ValidationPipe) order: CreateOrderDto,
        @User() user: Observable<UserDto>
    ) {
        return this.orderService.create(order, user);
    }

    @Get(':id')
    @UseGuards(JwtAuthGuard, RolesGuard)
    @Roles('admin')
    find(@Param('id', ParseUUIDPipe) id: string) {
        return this.orderService.find(id);
    }

    @Delete(':id')
    @UseGuards(JwtAuthGuard, RolesGuard)
    @Roles('admin', 'customer')
    remove(@Param('id', ParseUUIDPipe) id: string) {
        return this.orderService.remove(id);
    }

    @Get()
    @UseGuards(JwtAuthGuard, RolesGuard)
    @Roles('admin')
    list(
        @Query('page', ParseIntPipe) page: number,
        @Query('limit', ParseIntPipe) limit: number,
        @User() user: Observable<UserDto>,
    ) {
        return this.orderService.list({ page, limit }, user);
    }
}