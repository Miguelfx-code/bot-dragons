const { EmbedBuilder } = require('discord.js');
const { formatarPayload } = require('./helper');

module.exports = {
  nome: 'aviso-acoes',
  gerarEmbed(conteudoMensagem, cargoInput, guild) {
    const embed = new EmbedBuilder()
      .setColor('#DC143C')
      .setTitle('⚔️ AVISO DE AÇÕES & CONFLITOS — DRAGONS!')
      .setDescription(`> *Diretrizes táticas e de preparação para as ações da facção.*\n\n${conteudoMensagem}\n\n🛡️ **Foco total, respeito às ordens e disciplina na operação!**`)
      .setFooter({ text: 'DRAGONS! RP • Setor de Operações' })
      .setTimestamp();
    return formatarPayload(embed, cargoInput, guild);
  }
};