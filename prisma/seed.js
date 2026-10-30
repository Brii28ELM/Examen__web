require("dotenv").config();
const { PrismaClient } = require("@prisma/client");
const { PrismaPg } = require("@prisma/adapter-pg");
const bcrypt = require("bcryptjs");

const adapter = new PrismaPg({ connectionString: process.env.DATABASE_URL });
const prisma = new PrismaClient({ adapter });

async function main() {
  console.log("Iniciando seed de la base de datos...");

  // 1. Borrar en orden: booking, schedule, user
  console.log("Limpiando tablas...");
  await prisma.booking.deleteMany();
  await prisma.schedule.deleteMany();
  await prisma.user.deleteMany();

  // 2. Hash de contraseñas (costo 10)
  const hashedAdminPassword = await bcrypt.hash("admin123", 10);
  const hashedUserPassword = await bcrypt.hash("user123", 10);

  // 3. Crear administrador (paulo.galarza@example.com / admin123)
  const admin = await prisma.user.create({
    data: {
      name: "Paulo Galarza",
      email: "paulo.galarza@example.com",
      password: hashedAdminPassword,
      role: "ADMIN",
    },
  });
  console.log(`Admin creado: ${admin.email}`);

  // 4. Crear usuario de la variante (tú como USER)
  const user = await prisma.user.create({
    data: {
      name: "Brithany Lopez",
      email: "belopez6@espe.edu.ec",
      password: hashedUserPassword,
      role: "USER",
    },
  });
  console.log(`Usuario creado: ${user.email}`);

  // 5. Crear los 2 horarios de tu variante (Dígito 3: Vóley 2 · Básquet 2)
  // Horarios de 08:00 a 10:00 y de 10:00 a 12:00 (UTC)
  const schedule1 = await prisma.schedule.create({
    data: {
      court: "Vóley 2",
      startTime: "08:00",
      endTime: "10:00",
    },
  });

  const schedule2 = await prisma.schedule.create({
    data: {
      court: "Básquet 2",
      startTime: "10:00",
      endTime: "12:00",
    },
  });
  console.log(
    `Horarios creados: ${schedule1.court} (${schedule1.startTime}-${schedule1.endTime}), ${schedule2.court} (${schedule2.startTime}-${schedule2.endTime})`,
  );

  // 6. Crear al menos 2 reservas usando connect (fecha variante: 2026-11-13)
  const booking1 = await prisma.booking.create({
    data: {
      date: "2026-11-13",
      user: {
        connect: { id: user.id },
      },
      schedule: {
        connect: { id: schedule1.id },
      },
    },
  });

  const booking2 = await prisma.booking.create({
    data: {
      date: "2026-11-13",
      user: {
        connect: { id: user.id },
      },
      schedule: {
        connect: { id: schedule2.id },
      },
    },
  });
  console.log(`Reservas creadas con connect: ID ${booking1.id} y ID ${booking2.id}`);

  console.log("Seed completado exitosamente.");
}

main()
  .catch((e) => {
    console.error("Error al ejecutar el seed:", e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
