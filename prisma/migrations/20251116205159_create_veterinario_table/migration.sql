-- CreateTable
CREATE TABLE "Veterinario" (
    "id" SERIAL NOT NULL,
    "name" TEXT NOT NULL,
    "email" TEXT NOT NULL,
    "crmv" TEXT NOT NULL,
    "clinicId" INTEGER NOT NULL,

    CONSTRAINT "Veterinario_pkey" PRIMARY KEY ("id")
);

-- AddForeignKey
ALTER TABLE "Veterinario" ADD CONSTRAINT "Veterinario_clinicId_fkey" FOREIGN KEY ("clinicId") REFERENCES "Clinic"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
