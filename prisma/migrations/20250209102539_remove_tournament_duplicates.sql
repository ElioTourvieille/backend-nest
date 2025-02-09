-- Supprime les doublons en gardant l'entrée avec l'ID le plus bas
DELETE FROM "Tournament" t1 USING "Tournament" t2
WHERE t1.id > t2.id 
AND t1.name = t2.name 
AND t1."startTime" = t2."startTime" 
AND t1.room = t2.room; 