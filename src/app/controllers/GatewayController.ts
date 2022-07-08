import {
    Body,
    Get, JsonController, Post, UseBefore
} from 'routing-controllers';

import { celebrate } from 'celebrate';
import * as bodyParser from 'body-parser';

import { GatewayService } from '../../shared/services/GatewayService';
import { IGateway } from '../../shared/interfaces/IGateway';
import { gatewaySchemaIn } from "../schema/request/GatewaySchema";

@JsonController('/gateway')
export class GatewayController {

    constructor(private readonly gatewayService: GatewayService) {}

    @Get('/') findAll = (): any[] => [];

    @Post('/')
    @UseBefore(bodyParser.json(), celebrate(gatewaySchemaIn))
    create(@Body() gateway: IGateway): Promise<any> {
        return this.gatewayService.created(gateway);
    };
}
