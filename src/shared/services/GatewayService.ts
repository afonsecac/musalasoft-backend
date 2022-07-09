import * as R from 'ramda';

import { GatewayRepository } from '../repository/GatewayRepository';
import { IGateway } from '../interfaces/IGateway';

export class GatewayService {

    constructor(private readonly gatewayRepository: GatewayRepository) {
    }

    async getById(id: string): Promise<any> {
        return await this.gatewayRepository.findById(id);
    }

    async created(gateway: IGateway): Promise<any> {
        return await this.gatewayRepository.save(gateway);
    }

    async updated(gateway: IGateway): Promise<any> {
        try {
            const currentGateway: any = await this.getById(gateway.id);
            gateway = R.mergeDeepRight(currentGateway, gateway);
            return await this.gatewayRepository.update(gateway);
        } catch (e) {
            throw e;
        }
    }

    async findAll(query: any): Promise<any> {
        try {
            return await this.gatewayRepository.findAll(query);
        } catch (e) {
            throw e;
        }
    }

    async deleteOne(id: string): Promise<any> {
        try {
            return this.gatewayRepository.deleteObject(id);
        } catch (e) {
            throw e;
        }
    }
}
