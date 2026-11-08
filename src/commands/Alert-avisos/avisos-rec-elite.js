const { EmbedBuilder } = require('discord.js');
const { formatarPayload } = require('./helper');

module.exports = {
  nome: 'avisos-rec-elite',
  gerarEmbed(conteudoMensagem, cargoInput, guild) {
    const embed = new EmbedBuilder()
      .setColor('#FF8C00')
      .setTitle('⭐ SELEÇÃO ELITE — RECRUTAMENTO')
      .setDescription(`> *Processo seletivo restrito para ingresso no time de elite.*\n\n${conteudoMensagem}\n\n🦅 **Demonstrem o seu melhor desempenho e dedicação.**`)
      .setFooter({ text: 'DRAGONS! RP • Recrutamento Elite' })
      .setTimestamp();
    return formatarPayload(embed, cargoInput, guild);
  }
};