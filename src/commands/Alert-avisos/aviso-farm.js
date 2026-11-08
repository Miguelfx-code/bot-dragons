const { EmbedBuilder } = require('discord.js');
const { formatarPayload } = require('./helper');

module.exports = {
  nome: 'aviso-farm',
  gerarEmbed(conteudoMensagem, cargoInput, guild) {
    const embed = new EmbedBuilder()
      .setColor('#228B22')
      .setTitle('🌾 AVISO OFICIAL — FARM & METAS 🌾')
      .setDescription(`> *Atenção tropa, foco total na produção e no progresso da nossa org!*\n\n${conteudoMensagem}\n\n🙏 **Agradecemos a dedicação de todos os membros. Contamos com vocês!**`)
      .setFooter({ text: 'DRAGONS! RP • Setor de Farm & Produção' })
      .setTimestamp();
    return formatarPayload(embed, cargoInput, guild);
  }
};