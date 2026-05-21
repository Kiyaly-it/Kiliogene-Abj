import { api, LightningElement } from 'lwc';

export default class CreateSousTacheButton extends LightningElement {
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
    
        closeFlow() {
            this.showFlow = false;
        }
    
        handleStatusChange(event) {
            // 'FINISHED' ou 'FINISHED_SCREEN' selon la configuration de votre Flow
            if (event.detail.status === 'FINISHED' || event.detail.status === 'FINISHED_SCREEN') {
                this.showFlow = false;
            }
        }
}