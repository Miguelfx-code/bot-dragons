const { EmbedBuilder } = require('discord.js');
const { formatarPayload } = require('./helper');

module.exports = {
  nome: 'aviso',
  gerarEmbed(conteudoMensagem, cargoInput, guild) {
    const embed = new EmbedBuilder()
      .setColor('#FF4500')
      .setTitle('📢 COMUNICADO OFICIAL — DRAGONS!')
      .setDescription(`> *Informação importante para toda a nossa organização.*\n\n${conteudoMensagem}\n\n🙏 **Agradecemos a atenção e a colaboração de todos os membros!**`)
      .setFooter({ text: 'DRAGONS! RP • Comunicado Geral' })
      .setTimestamp();
    return formatarPayload(embed, cargoInput, guild);
  }
};