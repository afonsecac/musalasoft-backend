import * as R from 'ramda';

import { PeripheralRepository } from "../repository/PeripheralRepository";
import { IPeripheral } from "../interfaces/IPeripheral";

export class PeripheralService {

    constructor(private readonly peripheralRepository: PeripheralRepository) {
    }

    async getById(id: string): Promise<any> {
        return this.peripheralRepository.findById(id);
    }

    async create(peripheral: IPeripheral): Promise<any> {
        return this.peripheralRepository.save(peripheral);
    }

    async updated(peripheral: IPeripheral, id: string): Promise<any> {
        try {
            const currentPeripheral: any = await this.getById(id);
            peripheral = R.mergeDeepRight(currentPeripheral, peripheral);

            return this.peripheralRepository.update(peripheral);
        } catch (e) {
            throw e;
        }
    }

    async findAll(query: any): Promise<any> {
        try {
            return this.peripheralRepository.findAll(query);
        } catch (e) {
            throw e;
        }
    }

    async deleteOne(id: string): Promise<any> {
        try {
            return this.peripheralRepository.deleteObject(id);
        } catch (e) {
            throw e;
        }
    }
}
