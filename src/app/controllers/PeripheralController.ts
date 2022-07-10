import {
    Body, Delete,
    Get, JsonController, Param, Patch, Post, QueryParams, UseBefore
} from 'routing-controllers';
import * as bodyParser from "body-parser";
import { celebrate } from 'celebrate';

import { PeripheralService } from '../../shared/services/PeripheralService';
import { IPeripheral } from '../../shared/interfaces/IPeripheral';

import { findAllPeripheral, peripheralSchemaIn, peripheralSchemaUp } from '../schema/request/PeripheralSchema';

@JsonController('/peripheral')
export class PeripheralController {

    constructor(private readonly peripheralService: PeripheralService) {
    }

    @Get('/')
    @UseBefore(celebrate(findAllPeripheral))
    findAll(@QueryParams() query: any): Promise<any> {
        return this.peripheralService.findAll(query);
    }

    @Get('/:id')
    findOneById(@Param('id') id: string): Promise<IPeripheral> {
        return this.peripheralService.getById(id);
    }

    @Post('/')
    @UseBefore(bodyParser.json(), celebrate(peripheralSchemaIn))
    create(@Body() peripheral: IPeripheral): Promise<any> {
        return this.peripheralService.create(peripheral);
    }

    @Patch('/:id')
    @UseBefore(bodyParser.json(), celebrate(peripheralSchemaUp))
    updated(@Param('id') id: string, @Body() peripheral: IPeripheral): Promise<any> {
        return this.peripheralService.updated(peripheral, id);
    }

    @Delete('/:id')
    delete(@Param('id') id: string): Promise<any> {
        return this.peripheralService.deleteOne(id);
    }
}
