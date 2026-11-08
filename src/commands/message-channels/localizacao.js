const { SlashCommandBuilder, EmbedBuilder, AttachmentBuilder } = require('discord.js');
const path = require('path');

module.exports = {
  data: new SlashCommandBuilder()
    .setName('localizacao')
    .setDescription('Exibe a localização oficial da base da facção Dragons!'),

  async execute(context) {
    // Detecta se a chamada veio por comando de barra (interaction) ou mensagem (!localizacao)
    const isInteraction = Boolean(context.isChatInputCommand);

    if (isInteraction) {
      await context.deferReply();
    } else if (context.deletable) {
      await context.delete().catch(() => {});
    }

    const caminhoBase = path.join(__dirname, '..', '..', 'assets', 'images', 'localizacao_dragons.png');
    const caminhoMapa = path.join(__dirname, '..', '..', 'assets', 'images', 'mapa_dragons.png');

    const anexoBase = new AttachmentBuilder(caminhoBase, { name: 'base.png' });
    const anexoMapa = new AttachmentBuilder(caminhoMapa, { name: 'mapa.png' });

    const embed = new EmbedBuilder()
      .setColor('#FF4500')
      .setTitle('📍 LOC — 𝗗𝗥𝗔𝗚𝗢𝗡𝗦! 📍')
      .setDescription(
        '> *Aqui se forja o respeito e a nossa união.*\n\n' +
        '🗺️ **Localização da Base:**\n' +
        'Confira o RODAPÉ logo abaixo q contém detalhado e a visualização da frente da nossa org, E a THUMBNAIL contém uma pequena imagem da localização da nossa base no mapa.\n\n'
      )
      .setThumbnail('attachment://mapa.png')
      .setImage('attachment://base.png')
      .setFooter({ text: 'DRAGONS! RP • Território Oficial', iconURL: 'attachment://mapa.png' })
      .setTimestamp();

    const cargoId = process.env.CARGO_MEMBRO_ID;
    const payload = {
      content: cargoId ? `||<@&${cargoId}>||` : '',
      allowedMentions: cargoId ? { roles: [cargoId] } : {},
      embeds: [embed],
      files: [anexoBase, anexoMapa]
    };

    if (isInteraction) {
      await context.editReply(payload);
    } else {
      await context.channel.send(payload);
    }
  },
};