import { ApiProperty } from "@nestjs/swagger";
import { IsNotEmpty } from "class-validator";

export class CreatePurchaseDto {
    @IsNotEmpty()
    @ApiProperty({ example: 'ID User (buyer)' })
    userId: number;
    @IsNotEmpty()
    @ApiProperty({ example: 'ID of the course that I bought' })
    courseId: number;
}
