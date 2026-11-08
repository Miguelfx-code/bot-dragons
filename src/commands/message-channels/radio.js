const { SlashCommandBuilder, EmbedBuilder } = require('discord.js');

module.exports = {
  data: new SlashCommandBuilder()
    .setName('radio')
    .setDescription('Exibe a frequência de rádio oficial da facção Dragons!'),

  async execute(context) {
    const isInteraction = Boolean(context.isChatInputCommand);

    if (isInteraction) {
      await context.deferReply();
    } else if (context.deletable) {
      await context.delete().catch(() => {});
    }

    const embedRadio = new EmbedBuilder()
      .setColor('#FF4500')
      .setTitle('📻 RÁDIO OFICIAL — DRAGONS!')
      .setDescription(
        '> *Comunicação, união e respeito. Sempre conectados!*\n\n' +
        '📡 **FREQUÊNCIA ATUAL DA FACÇÃO**\n\n' +
        '# 669\n\n' +
        '🔥 Esta é a frequência oficial utilizada pela organização DRAGONS!\n\n' +
        '🛡️ **Mantenha-se informado e conectado com nossa equipe.**'
      )
      .setFooter({ text: 'DRAGONS! RP • Comunicação Oficial' })
      .setTimestamp();

    // Pega o ID do cargo do .env e aplica o spoiler com ||
    const cargoId = process.env.CARGO_MEMBRO_ID;
    const payload = {
      content: cargoId ? `||<@&${cargoId}>||` : '',
      allowedMentions: cargoId ? { roles: [cargoId] } : {},
      embeds: [embedRadio]
    };

    if (isInteraction) {
      await context.editReply(payload);
    } else {
      await context.channel.send(payload);
    }
  },
};