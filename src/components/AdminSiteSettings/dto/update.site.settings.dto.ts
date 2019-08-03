import { IsString, IsOptional, IsNumber, Min } from 'class-validator';

export class UpdateSiteSettingsDto {
  @IsString()
  @IsOptional()
  site_name?: string;

  @IsNumber()
  @IsOptional()
  @Min(1)
  maximum_event_attendees?: number;
}
