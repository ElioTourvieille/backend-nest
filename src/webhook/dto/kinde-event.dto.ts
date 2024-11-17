import { IsString, IsObject, ValidateNested } from 'class-validator';
import { Type } from 'class-transformer';

export class KindeEventData {
    @IsString()
    id: string;

    @IsString()
    token: string;

    @IsObject()
    @ValidateNested()
    data: object;
}

export class KindeEvent {
    @IsString()
    type: string;

    @IsObject()
    @ValidateNested()
    @Type(() => KindeEventData)
    data: KindeEventData;
}
