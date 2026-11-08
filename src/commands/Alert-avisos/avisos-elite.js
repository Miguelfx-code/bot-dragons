const { EmbedBuilder } = require('discord.js');
const { formatarPayload } = require('./helper');

module.exports = {
  nome: 'avisos-elite',
  gerarEmbed(conteudoMensagem, cargoInput, guild) {
    const embed = new EmbedBuilder()
      .setColor('#FFD700')
      .setTitle('🦅 COMUNICADO EXCLUSIVO — ELITE DRAGONS!')
      .setDescription(`> *Instruções e metas restritas ao pelotão de elite.*\n\n${conteudoMensagem}\n\n⭐ **Contamos com o alto nível de profissionalismo de sempre.**`)
      .setFooter({ text: 'DRAGONS! RP • Setor de Elite' })
      .setTimestamp();
    return formatarPayload(embed, cargoInput, guild);
  }
};