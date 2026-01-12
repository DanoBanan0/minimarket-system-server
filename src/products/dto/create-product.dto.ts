import { IsInt, IsNumber, IsOptional, IsPositive, IsString, Min, MinLength } from "class-validator";
import { ApiProperty } from "@nestjs/swagger";

export class CreateProductDto {
    @ApiProperty()
    @IsString()
    @MinLength(1)
    name: string;

    @ApiProperty({ required: false })
    @IsString()
    @IsOptional()
    barcode?: string;

    @ApiProperty()
    @IsNumber()
    @IsPositive()
    costPrice: number;

    @ApiProperty()
    @IsNumber()
    @IsPositive()
    salePriceRetail: number;

    @ApiProperty()
    @IsNumber()
    @IsPositive()
    salePriceWholesale: number;

    @ApiProperty({ required: false, default: 0 })
    @IsInt()
    @IsPositive()
    whplesaleMinCount?: number;

    @ApiProperty()
    @IsInt()
    @IsPositive()
    stock: number;

    @ApiProperty({ required: false })
    @IsString()
    @IsOptional()
    slug?: string;
}
