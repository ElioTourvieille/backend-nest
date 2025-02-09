/*
  Warnings:

  - A unique constraint covering the columns `[name,startTime,room]` on the table `Tournament` will be added. If there are existing duplicate values, this will fail.

*/
-- CreateIndex
CREATE UNIQUE INDEX "Tournament_name_startTime_room_key" ON "Tournament"("name", "startTime", "room");
