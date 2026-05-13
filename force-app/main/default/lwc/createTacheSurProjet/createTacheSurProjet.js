import { api, LightningElement } from 'lwc';

export default class CreateTacheSurProjet extends LightningElement {
    @api recordId;
    showFlow = false;

    get flowInputVariables() {
        return [
            {
                name: 'recordId',
                type: 'String',
                value: this.recordId
            }
        ];
    }

    openFlow() {
        this.showFlow = true;
    }

    handleStatusChange(event) {
        if (event.detail.status === 'FINISHED') {
            this.showFlow = false;
        }
    }
}