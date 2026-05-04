import { LightningElement, api } from 'lwc';

export default class CreateSaisieTempsButton extends LightningElement {
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