const { EmbedBuilder } = require('discord.js');
const { formatarPayload } = require('./helper');

module.exports = {
  nome: 'avisos-rec-gerencia',
  gerarEmbed(conteudoMensagem, cargoInput, guild) {
    const embed = new EmbedBuilder()
      .setColor('#20B2AA')
      .setTitle('📋 PROCESSO SELETIVO — GERÊNCIA')
      .setDescription(`> *Abertura de vagas para composição da equipe administrativa.*\n\n${conteudoMensagem}\n\n💼 **Agradecemos a todos que buscam somar com a liderança da org.**`)
      .setFooter({ text: 'DRAGONS! RP • Recrutamento Gerência' })
      .setTimestamp();
    return formatarPayload(embed, cargoInput, guild);
  }
};