const prisma = require("../prismaClient");

async function findUserByEmail(email) {
  return await prisma.user.findUnique({
    where: {
      email,
    },
  });
}

async function createUser(userData) {
  return await prisma.user.create({
    data: userData,
  });
}

async function findUserById(id) {
  return await prisma.user.findUnique({
    where: {
      id,
    },
  });
}

module.exports = {
  findUserByEmail,
  createUser,
  findUserById,
};
