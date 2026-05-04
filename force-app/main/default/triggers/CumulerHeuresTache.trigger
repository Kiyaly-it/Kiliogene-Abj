trigger CumulerHeuresTache on Intervalle_de_temps__c 
(after insert, after update, after delete, after undelete) {

    Set<Id> tacheIds = new Set<Id>();

    if(Trigger.isInsert || Trigger.isUpdate || Trigger.isUndelete){
        for(Intervalle_de_temps__c i : Trigger.new){
            if(i.Tache__c != null)
                tacheIds.add(i.Tache__c);
        }
    }

    if(Trigger.isDelete){
        for(Intervalle_de_temps__c i : Trigger.old){
            if(i.Tache__c != null)
                tacheIds.add(i.Tache__c);
        }
    }

    Map<Id, Decimal> totalParTache = new Map<Id, Decimal>();

    for(AggregateResult ar : [
        SELECT Tache__c, SUM(Total_Heures__c) total
        FROM Intervalle_de_temps__c
        WHERE Tache__c IN :tacheIds
        GROUP BY Tache__c
    ]){
        totalParTache.put(
            (Id)ar.get('Tache__c'),
            (Decimal)ar.get('total')
        );
    }

    List<Tache__c> tachesToUpdate = new List<Tache__c>();

    for(Id tacheId : totalParTache.keySet()){
        tachesToUpdate.add(new Tache__c(
            Id = tacheId,
            Total_Heures__c = totalParTache.get(tacheId)
        ));
    }

    if(!tachesToUpdate.isEmpty()){
        update tachesToUpdate;
    }
}