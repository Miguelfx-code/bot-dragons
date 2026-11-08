const { EmbedBuilder } = require('discord.js');
const { formatarPayload } = require('./helper');

module.exports = {
  nome: 'avisos-rec',
  gerarEmbed(conteudoMensagem, cargoInput, guild) {
    const embed = new EmbedBuilder()
      .setColor('#9932CC')
      .setTitle('📝 RECRUTAMENTO ABERTO — DRAGONS!')
      .setDescription(`> *Oportunidade de entrada para novos integrantes na família.*\n\n${conteudoMensagem}\n\n🤝 **Sejam bem-vindos e boa sorte aos candidatos!**`)
      .setFooter({ text: 'DRAGONS! RP • Setor de Recrutamento' })
      .setTimestamp();
    return formatarPayload(embed, cargoInput, guild);
  }
};