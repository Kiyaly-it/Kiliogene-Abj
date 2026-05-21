public with sharing class IntervalleDeTempsController {
    //false pour permettre le refresh après sauvegarde
    @AuraEnabled(cacheable=false)

    public static List<Intervalle_de_temps__c> getWeeklyIntervalleDeTempsController() {
        // Calcul des dates de début et de fin de la semaine en cours
        Date startOfWeek = Date.today().toStartOfWeek();
        Date endOfWeek = startOfWeek.addDays(6);
        
        // Requête sur "IntervalleDeTemps__c" pour récupérer les enregistrements de la semaine
        return [SELECT Id, User__c, Name, Date_de_debut__c, Date_de_fin__c,  Tache__r.Name, Total_Heures__c
                FROM Intervalle_de_temps__c WHERE Date_de_debut__c >= :startOfWeek AND Date_de_fin__c <= :endOfWeek
                ];
    }
}

