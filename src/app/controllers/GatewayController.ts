import {
    Body, Delete,
    Get, JsonController, Param, Patch, Post, QueryParams, UseBefore
} from 'routing-controllers';

import { celebrate } from 'celebrate';
import * as bodyParser from 'body-parser';

import { GatewayService } from '../../shared/services/GatewayService';
import { IGateway } from '../../shared/interfaces/IGateway';
import { findAllGateway, gatewaySchemaIn, gatewaySchemaUpdate } from '../schema/request/GatewaySchema';

@JsonController('/gateway')
export class GatewayController {

    constructor(private readonly gatewayService: GatewayService) {}

    @Get('/')
    @UseBefore(celebrate(findAllGateway))
    findAll(@QueryParams() query: any): Promise<any> {
        return this.gatewayService.findAll(query);
    }

    @Get('/:id')
    findOneById(@Param('id') id: string): Promise<any> {
        return this.gatewayService.getById(id);
    }

    @Post('/')
    @UseBefore(bodyParser.json(), celebrate(gatewaySchemaIn))
    create(@Body() gateway: IGateway): Promise<any> {
        return this.gatewayService.created(gateway);
    };

    @Patch('/:id')
    @UseBefore(bodyParser.json(), celebrate(gatewaySchemaUpdate))
    update(@Param('id') id: string, @Body() gateway: IGateway): Promise<any> {
        return this.gatewayService.updated({
            ...gateway,
            id
        });
    }

    @Delete('/:id')
    deleteOne(@Param('id') id: string): Promise<any> {
        return this.gatewayService.deleteOne(id);
    }
}
