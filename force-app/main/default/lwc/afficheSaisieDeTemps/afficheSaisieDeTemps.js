import { LightningElement, track, wire } from 'lwc';
import getWeeklyIntervalleDeTempsController from '@salesforce/apex/IntervalleDeTempsController.getWeeklyIntervalleDeTempsController';
import { ShowToastEvent } from 'lightning/platformShowToastEvent';
import { updateRecord } from 'lightning/uiRecordApi';
import ID_USER from '@salesforce/user/Id';

export default class AfficheSaisieDeTemps extends LightningElement {
    @track intervalleDeTempsData = [];
    currentUserId = ID_USER;
    draftValues = {}; 

    // 1. On utilise le wire pour récupérer les données automatiquement
    @wire(getWeeklyIntervalleDeTempsController)
    wiredData({ error, data }) {
        if (data) {
            console.log('Données brutes reçues:', data);
            this.intervalleDeTempsData = data.map(item => {
                return {
                    Id: item.Id,
                    // Note : vérifie bien si c'est Tache__r ou Tâche__r (avec ou sans accent)
                    resourceName: item.Ressource__r ? item.Ressource__r.Name : 'N/A',
                    taskName: item.Tache__r ? item.Tache__r.Name : 'N/A', 
                    startDate: item.Date_de_debut__c,
                    totalHours: item.Total_Heures__c,
                    User__c: item.User__c,
                    isNotOwner: item.User__c !== this.currentUserId 
                };
            });
        } else if (error) {
            console.error('Erreur Apex:', error);
        }
    }

    // 2. On peut quand même ajouter connectedCallback pour d'autres logiques, 
    // mais sans l'importer en haut !
    connectedCallback() {
        console.log('Le composant est chargé. User ID courant:', this.currentUserId);
    }

    handleInputChange(event) {
        const recordId = event.target.dataset.id;
        this.draftValues[recordId] = event.target.value;
    }

    async handleSave() {
        const recordsToUpdate = Object.keys(this.draftValues).map(id => {
            return {
                fields: {
                    Id: id,
                    Total_Heures__c: this.draftValues[id] 
                }
            };
        });

        if (recordsToUpdate.length === 0) return;

        try {
            const promises = recordsToUpdate.map(record => updateRecord(record));
            await Promise.all(promises);
            
            this.dispatchEvent(
                new ShowToastEvent({
                    title: 'Succès',
                    message: 'Temps mis à jour',
                    variant: 'success'
                })
            );
            this.draftValues = {}; 
        } catch (error) {
            this.dispatchEvent(
                new ShowToastEvent({
                    title: 'Erreur',
                    message: error.body.message,
                    variant: 'error'
                })
            );
        }
    }
}