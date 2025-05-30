-- CreateTable
CREATE TABLE "Patient" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "folderName" TEXT NOT NULL,
    "dateOfBirth" TEXT,
    "conditions" TEXT,
    "allergies" TEXT,
    "comments" TEXT,
    "uploadedAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "reportReady" BOOLEAN NOT NULL DEFAULT false,
    "paid" BOOLEAN NOT NULL DEFAULT false
);
