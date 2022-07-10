import { asValue, InjectionMode, asClass } from 'awilix';

import * as R from 'ramda';

import { createContainer } from '../../shared/config/di';
import { initDatabaseConnection } from '../../shared/config/mongo';

import { GatewayController } from '../controllers/GatewayController';
import {PeripheralController} from "../controllers/PeripheralController";
import { GatewayRepository } from '../../shared/repository/GatewayRepository';
import { GatewayService } from '../../shared/services/GatewayService';
import { PeripheralRepository } from "../../shared/repository/PeripheralRepository";
import { PeripheralService } from "../../shared/services/PeripheralService";

let containerCreated: any;

export const initDI = async () => {

    try {
        if (R.isNil(containerCreated) || R.isEmpty(containerCreated)) {
            const db = await initDatabaseConnection();
            const { container } = createContainer({
                injectionMode: InjectionMode.CLASSIC,
            });

            container.register({
                db: asValue(db),

                GatewayController: asClass(GatewayController).singleton(),
                PeripheralController: asClass(PeripheralController).singleton(),

                gatewayService: asClass(GatewayService).singleton(),
                peripheralService: asClass(PeripheralService).singleton(),

                gatewayRepository: asClass(GatewayRepository).singleton(),
                peripheralRepository: asClass(PeripheralRepository).singleton(),
            });

            containerCreated = container;
        }

        const resolveName = (someClass: any) =>
            typeof someClass !== 'string' ? someClass.name : someClass;

        return {
            containerCreated,
            get: (someClass: any) =>
                containerCreated.resolve(resolveName(someClass)),
        };
    } catch (e) {
        console.error(e);
    }
}
