trigger RessourceUserUniqueness on Ressource__c (before insert, before update) {

    Set<Id> userIds = new Set<Id>();

    for (Ressource__c r : Trigger.new) {
        if (r.User__c != null) {
            userIds.add(r.User__c);
        }
    }

    if (userIds.isEmpty()) return;

    Map<Id, Id> userToRessourceMap = new Map<Id, Id>();

    for (Ressource__c existing : [
        SELECT Id, User__c
        FROM Ressource__c
        WHERE User__c IN :userIds
    ]) {
        userToRessourceMap.put(existing.User__c, existing.Id);
    }

    for (Ressource__c r : Trigger.new) {
        if (r.User__c != null) {
            Id existingResId = userToRessourceMap.get(r.User__c);

            if (existingResId != null && existingResId != r.Id) {
                r.User__c.addError(
                    'L’utilisateur sélectionné est déjà associé à une ressource existante.'
                );
            }
        }
    }
}