-- AlterTable
ALTER TABLE "WorkoutLog" ADD COLUMN "clientRequestId" TEXT;

-- CreateIndex
CREATE UNIQUE INDEX "WorkoutLog_clientRequestId_key" ON "WorkoutLog"("clientRequestId");
