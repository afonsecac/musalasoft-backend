import { GatewayRepository } from '../repository/GatewayRepository';
import { IGateway } from '../interfaces/IGateway';

export class GatewayService {

    constructor(private readonly gatewayRepository: GatewayRepository) {
    }

    async created(gateway: IGateway): Promise<any> {
        return this.gatewayRepository.save(gateway);
    }

}
