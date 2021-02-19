module.exports = async (client) => {
  console.log(`${client.user.username} está online`);
  await client.user.setActivity("Música", {
    type: "LISTENING",
  });
};
