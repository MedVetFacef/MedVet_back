import { PrismaClient } from '@prisma/client'

const prisma = new PrismaClient()

async function main() {
  const clinic = await prisma.clinic.create({
    data: {
      name: "Clínica Vet Central",
      email: "contato@vetcentral.com",
      address: "Av. Brasil, 1000",
      phone: "11999990000"
    }
  })

  await prisma.veterinario.createMany({
    data: [
      {
        name: "Dr. João Silva",
        email: "joao@vetcentral.com",
        crmv: "SP12345",
        clinicId: clinic.id
      },
      {
        name: "Dra. Ana Pereira",
        email: "ana@vetcentral.com",
        crmv: "SP67890",
        clinicId: clinic.id
      }
    ]
  })

}

main()
  .catch(err => {
    process.exit(1)
  })
  .finally(async () => {
    await prisma.$disconnect()
  })
