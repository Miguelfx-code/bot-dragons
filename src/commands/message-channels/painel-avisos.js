const { SlashCommandBuilder, EmbedBuilder, ActionRowBuilder, StringSelectMenuBuilder, MessageFlags } = require('discord.js');

module.exports = {
  data: new SlashCommandBuilder()
    .setName('painel-avisos')
    .setDescription('Envia o painel central de criação de avisos da Dragons!'),

  async execute(context) {
    const isInteraction = Boolean(context.isChatInputCommand);

    if (isInteraction) {
      await context.deferReply({ flags: MessageFlags.Ephemeral });
    } else if (context.deletable) {
      await context.delete().catch(() => {});
    }

    const embed = new EmbedBuilder()
      .setColor('#FF4500')
      .setTitle('📢 CENTRAL DE AVISOS — DRAGONS! 📢')
      .setDescription(
        '> *Bem-vindo ao sistema oficial de comunicação e gestão da organização.*\n\n' +
        '🎯 **O que é este painel?**\n' +
        'Este painel centralizado serve para manter toda a facção informada de forma rápida, organizada e profissional. Através dele, a liderança pode disparar comunicados oficiais diretamente para os canais específicos do servidor.\n\n' +
        '⚙️ **Instruções do Formulário:**\n' +
        'Ao selecionar um canal abaixo, um formulário interativo será exibido na sua tela com as seguintes regras:\n\n' +
        '📌 **Campos do Formulário:**\n' +
        '• 🔴 **Mensagem do Aviso (OBRIGATÓRIO):** Digite o conteúdo principal e detalhado do seu comunicado. Este campo não pode ficar em branco.\n' +
        '• 🟢 **Cargos a marcar (OPCIONAL):** Digite os IDs ou Nomes exatos dos cargos (ex: `111111, @Membro, @Liderança`). Se não quiser marcar nenhum cargo, deixe em branco.\n' +
        '• 🟢 **OBS / Instruções (OPCIONAL):** Campo auxiliar de apoio para especificar cargos com símbolos, barras ou emojis.\n\n' +
        '✨ **Dica de Formatação no Formulário:**\n' +
        'Você pode formatar o texto do seu aviso usando os símbolos do Discord direto na caixa de texto:\n' +
        '• `**seu texto**` ➔ **Texto em Negrito**\n' +
        '• `*seu texto*` ➔ *Texto em Itálico*\n' +
        '• `__seu texto__` ➔ __Texto Sublinhado__\n' +
        '• `||seu texto||` ➔ ||Texto Escondido (Spoiler)||\n' +
        '• `> seu texto` ➔ Citação / Bloco\n\n' +
        '🛡️ *Acesso restrito a membros autorizados da liderança.*'
      )
      .setFooter({ text: 'DRAGONS! RP • Painel Administrativo Oficial' })
      .setTimestamp();

    const selectMenu = new StringSelectMenuBuilder()
      .setCustomId('select_canal_aviso')
      .setPlaceholder('📂 Escolha o tipo de aviso...')
      .addOptions([
        { label: 'Aviso Geral', description: 'Comunicado geral para a facção.', value: 'aviso', emoji: '📢' },
        { label: 'Aviso de Ações', description: 'Comunicado referente a ações e conflitos.', value: 'aviso-acoes', emoji: '⚔️' },
        { label: 'Aviso de Farm', description: 'Comunicado referente a metas e farm.', value: 'aviso-farm', emoji: '🌾' },
        { label: 'Avisos Elite', description: 'Comunicado exclusivo para o setor de elite.', value: 'avisos-elite', emoji: '🦅' },
        { label: 'Avisos Gerência', description: 'Comunicado da gerência e administração.', value: 'avisos-gerencia', emoji: '💼' },
        { label: 'Recrutamento Geral', description: 'Avisos e formulários de recrutamento.', value: 'avisos-rec', emoji: '📝' },
        { label: 'Recrutamento Elite', description: 'Recrutamento exclusivo para elite.', value: 'avisos-rec-elite', emoji: '⭐' },
        { label: 'Recrutamento Gerência', description: 'Recrutamento para o cargo de gerência.', value: 'avisos-rec-gerencia', emoji: '📋' },
        { label: 'Escolha o canal de aviso...', description: 'Selecione uma categoria acima para prosseguir.', value: 'default_reset', emoji: '📌', default: true },
      ]);

    const row = new ActionRowBuilder().addComponents(selectMenu);
    const payload = { embeds: [embed], components: [row] };

    if (isInteraction) {
      await context.editReply(payload);
    } else {
      await context.channel.send(payload);
    }
  },
};