const { EmbedBuilder } = require('discord.js');
const { formatarPayload } = require('./helper');

module.exports = {
  nome: 'avisos-gerencia',
  gerarEmbed(conteudoMensagem, cargoInput, guild) {
    const embed = new EmbedBuilder()
      .setColor('#4682B4')
      .setTitle('💼 COMUNICADO DA GERÊNCIA — DRAGONS!')
      .setDescription(`> *Alinhamentos administrativos, organizacionais e regras internas.*\n\n${conteudoMensagem}\n\n📋 **Dúvidas ou feedbacks, contatem a diretoria.**`)
      .setFooter({ text: 'DRAGONS! RP • Gerência & Administração' })
      .setTimestamp();
    return formatarPayload(embed, cargoInput, guild);
  }
};