const path = require('path');
require('dotenv').config({ path: path.join(__dirname, '..', '.env') });

const fs = require('fs');
const { 
  Client, 
  GatewayIntentBits, 
  REST, 
  Routes, 
  Collection, 
  ModalBuilder, 
  TextInputBuilder, 
  TextInputStyle, 
  ActionRowBuilder, 
  ButtonBuilder,
  ButtonStyle,
  StringSelectMenuBuilder,
  MessageFlags 
} = require('discord.js');

const client = new Client({
  intents: [
    GatewayIntentBits.Guilds,
    GatewayIntentBits.GuildMessages,
    GatewayIntentBits.GuildMembers,
    GatewayIntentBits.MessageContent,
  ],
});

client.commands = new Collection();
client.alertModels = new Collection();
client.tempAviseStore = new Map(); // Guarda dados temporários para a prévia

const commandsArray = [];

// Mapeamento dos canais por tipo de aviso salvos no .env
const CANAIS_AVISOS = {
  'aviso': process.env.CANAL_AVISO,
  'aviso-acoes': process.env.CANAL_AVISO_ACOES,
  'aviso-farm': process.env.CANAL_AVISO_FARM,
  'avisos-elite': process.env.CANAL_AVISOS_ELITE,
  'avisos-gerencia': process.env.CANAL_AVISOS_GERENCIA,
  'avisos-rec': process.env.CANAL_AVISOS_REC,
  'avisos-rec-elite': process.env.CANAL_AVISOS_REC_ELITE,
  'avisos-rec-gerencia': process.env.CANAL_AVISOS_REC_GERENCIA,
};

const loadCommands = (dir) => {
  const files = fs.readdirSync(dir, { withFileTypes: true });
  for (const file of files) {
    const filePath = path.join(dir, file.name);
    if (file.isDirectory()) {
      loadCommands(filePath);
    } else if (file.name.endsWith('.js')) {
      const command = require(filePath);
      if ('data' in command && 'execute' in command) {
        client.commands.set(command.data.name, command);
        commandsArray.push(command.data.toJSON());
      }
    }
  }
};

loadCommands(path.join(__dirname, 'commands'));

const alertPath = path.join(__dirname, 'commands', 'Alert-avisos');
if (fs.existsSync(alertPath)) {
  const alertFiles = fs.readdirSync(alertPath).filter(file => file.endsWith('.js') && file !== 'helper.js');
  for (const file of alertFiles) {
    const model = require(path.join(alertPath, file));
    if (model.nome) {
      client.alertModels.set(model.nome, model);
    }
  }
}

const rest = new REST({ version: '10' }).setToken(process.env.DISCORD_TOKEN);

(async () => {
  try {
    console.log('🔄 Registrando comandos no servidor...');
    await rest.put(
      Routes.applicationGuildCommands(process.env.CLIENT_ID, process.env.GUILD_ID),
      { body: commandsArray }
    );
    console.log('✅ Comandos registrados com sucesso!');
  } catch (error) {
    console.error('❌ Erro ao registrar comandos:', error);
  }
})();

client.once('clientReady', () => {
  console.log(`🤖 Bot da Facção online como ${client.user.tag}`);
});

client.on('interactionCreate', async (interaction) => {
  const verificarPermissaoGerenciamento = async (interaction) => {
    const cargoPermitidoId = process.env.CARGO_DEVS_BOTS;
    if (!cargoPermitidoId) return true;

    const member = interaction.guild?.members.cache.get(interaction.user.id) || 
                   await interaction.guild?.members.fetch(interaction.user.id).catch(() => null);

    if (!member || !member.roles.cache.has(cargoPermitidoId)) {
      return false;
    }
    return true;
  };

  if (interaction.isChatInputCommand()) {
    if (!(await verificarPermissaoGerenciamento(interaction))) {
      await interaction.reply({
        content: '❌ Você não possui permissão para gerenciar ou utilizar este painel de avisos!',
        flags: MessageFlags.Ephemeral
      });
      return;
    }

    const command = client.commands.get(interaction.commandName);
    if (!command) return;
    try {
      await command.execute(interaction);
    } catch (error) {
      console.error(error);
    }
    return;
  }

  if (interaction.isStringSelectMenu() && interaction.customId === 'select_canal_aviso') {
    const tipoAviso = interaction.values[0];

    const buildResetMenu = () => new StringSelectMenuBuilder()
      .setCustomId('select_canal_aviso')
      .setPlaceholder('📂 Escolha o tipo de aviso...')
      .addOptions([
        { label: 'Aviso Geral', description: 'Comunicado geral para a facção.', value: 'aviso', emoji: '📢', default: false },
        { label: 'Aviso de Ações', description: 'Comunicado referente a ações e conflitos.', value: 'aviso-acoes', emoji: '⚔️', default: false },
        { label: 'Aviso de Farm', description: 'Comunicado referente a metas e farm.', value: 'aviso-farm', emoji: '🌾', default: false },
        { label: 'Avisos Elite', description: 'Comunicado exclusivo para o setor de elite.', value: 'avisos-elite', emoji: '🦅', default: false },
        { label: 'Avisos Gerência', description: 'Comunicado da gerência e administração.', value: 'avisos-gerencia', emoji: '💼', default: false },
        { label: 'Recrutamento Geral', description: 'Avisos e formulários de recrutamento.', value: 'avisos-rec', emoji: '📝', default: false },
        { label: 'Recrutamento Elite', description: 'Recrutamento exclusivo para elite.', value: 'avisos-rec-elite', emoji: '⭐', default: false },
        { label: 'Recrutamento Gerência', description: 'Recrutamento para o cargo de gerência.', value: 'avisos-rec-gerencia', emoji: '📋', default: false },
        { label: 'Escolha o canal de aviso...', description: 'Selecione uma categoria acima para prosseguir.', value: 'default_reset', emoji: '📌', default: true },
      ]);

    const temPermissao = await verificarPermissaoGerenciamento(interaction);

    if (!temPermissao) {
      const rowReset = new ActionRowBuilder().addComponents(buildResetMenu());
      await interaction.update({ components: [rowReset] });
      await interaction.followUp({
        content: '❌ Você não possui permissão para gerenciar ou utilizar este painel de avisos!',
        flags: MessageFlags.Ephemeral
      });
      return;
    }

    if (tipoAviso === 'default_reset') {
      const rowReset = new ActionRowBuilder().addComponents(buildResetMenu());
      await interaction.update({ components: [rowReset] });
      return;
    }

    const modal = new ModalBuilder()
      .setCustomId(`modal_aviso_${tipoAviso}`)
      .setTitle('📝 Redigir Comunicado Oficial');

    const inputMensagem = new TextInputBuilder()
      .setCustomId('texto_aviso')
      .setLabel('Mensagem do Aviso')
      .setStyle(TextInputStyle.Paragraph)
      .setPlaceholder('Escreva aqui o conteúdo detalhado do comunicado...')
      .setRequired(true);

    const inputCargo = new TextInputBuilder()
      .setCustomId('cargo_aviso_id')
      .setLabel('Cargos a marcar (IDs ou Nome Exato)')
      .setStyle(TextInputStyle.Short)
      .setPlaceholder('Ex: 111111, @Membro ou Nome do Cargo')
      .setRequired(false);

    const inputObs = new TextInputBuilder()
      .setCustomId('cargo_obs')
      .setLabel('OBS: Escreva o nome exato (com emojis/barras)')
      .setStyle(TextInputStyle.Short)
      .setPlaceholder('Ex: 🌾・Membro (Separe múltiplos cargos com vírgula!)')
      .setRequired(false);

    modal.addComponents(
      new ActionRowBuilder().addComponents(inputMensagem),
      new ActionRowBuilder().addComponents(inputCargo),
      new ActionRowBuilder().addComponents(inputObs)
    );

    await interaction.showModal(modal);

    try {
      const rowReset = new ActionRowBuilder().addComponents(buildResetMenu());
      await interaction.message.edit({ components: [rowReset] });
    } catch (err) {}
    return;
  }

  if (interaction.isModalSubmit() && interaction.customId.startsWith('modal_aviso_')) {
    if (!(await verificarPermissaoGerenciamento(interaction))) {
      return interaction.reply({ content: '❌ Você não possui permissão para gerenciar este painel!', flags: MessageFlags.Ephemeral });
    }

    const tipoAviso = interaction.customId.replace('modal_aviso_', '');
    const textoMensagem = interaction.fields.getTextInputValue('texto_aviso');
    const cargoInput1 = interaction.fields.getTextInputValue('cargo_aviso_id').trim();
    const cargoInput2 = interaction.fields.getTextInputValue('cargo_obs').trim();
    
    const cargoInput = [cargoInput1, cargoInput2].filter(Boolean).join(', ');

    const model = client.alertModels.get(tipoAviso);
    if (!model) {
      return interaction.reply({ content: '❌ Modelo de aviso não encontrado!', flags: MessageFlags.Ephemeral });
    }

    const previewData = model.gerarEmbed(textoMensagem, cargoInput, interaction.guild);

    // Guarda os dados na memória do bot sem estourar o limite de 100 caracteres do customId
    client.tempAviseStore.set(interaction.user.id, {
      tipoAviso,
      textoMensagem,
      cargoInput
    });

    const confirmButton = new ButtonBuilder()
      .setCustomId('confirm_send_aviso')
      .setLabel('✅ Confirmar e Enviar Aviso')
      .setStyle(ButtonStyle.Success);

    const cancelButton = new ButtonBuilder()
      .setCustomId('cancel_send_aviso')
      .setLabel('❌ Cancelar')
      .setStyle(ButtonStyle.Danger);

    const row = new ActionRowBuilder().addComponents(confirmButton, cancelButton);

    await interaction.reply({
      content: '🔍 **PRÉVIA DO AVISO:** Confira abaixo como ele será enviado para o canal:\n\n' + 
               `*(Os cargos informados serão marcados com spoiler ||<@&ID>||)*`,
      ...previewData,
      components: [row],
      flags: MessageFlags.Ephemeral
    });
    return;
  }

  if (interaction.isButton()) {
    if (interaction.customId === 'cancel_send_aviso') {
      client.tempAviseStore.delete(interaction.user.id);
      return interaction.update({ content: '❌ Envio de aviso cancelado.', embeds: [], components: [] });
    }

    if (interaction.customId === 'confirm_send_aviso') {
      if (!(await verificarPermissaoGerenciamento(interaction))) {
        return interaction.reply({ content: '❌ Você não possui permissão para gerenciar este painel!', flags: MessageFlags.Ephemeral });
      }

      const dadosTemp = client.tempAviseStore.get(interaction.user.id);
      if (!dadosTemp) {
        return interaction.update({ content: '❌ Erro: A prévia expirou ou não foi encontrada.', embeds: [], components: [] });
      }

      const { tipoAviso, textoMensagem, cargoInput } = dadosTemp;
      const model = client.alertModels.get(tipoAviso);

      if (!model) {
        return interaction.update({ content: '❌ Erro: Modelo de aviso não encontrado.', embeds: [], components: [] });
      }

      const payloadFinal = model.gerarEmbed(textoMensagem, cargoInput, interaction.guild);

      // Busca a ID do canal específico no .env ou envia no canal atual se não estiver configurado
      const targetChannelId = CANAIS_AVISOS[tipoAviso];
      const targetChannel = targetChannelId ? await interaction.guild.channels.fetch(targetChannelId).catch(() => null) : interaction.channel;

      if (targetChannel) {
        await targetChannel.send(payloadFinal);
      } else {
        await interaction.channel.send(payloadFinal);
      }

      client.tempAviseStore.delete(interaction.user.id);

      await interaction.update({
        content: `✅ **Aviso enviado com sucesso para o canal ${targetChannel ? `<#${targetChannel.id}>` : 'atual'}!**`,
        embeds: [],
        components: [],
        flags: MessageFlags.Ephemeral
      });
    }
  }
});

client.on('messageCreate', async (message) => {
  if (message.author.bot || !message.guild) return;
  const prefix = '!';
  if (!message.content.startsWith(prefix)) return;

  const commandName = message.content.slice(prefix.length).trim().toLowerCase();
  const command = client.commands.get(commandName);

  if (command) {
    try {
      await command.execute(message);
    } catch (error) {
      console.error(`Erro no comando !${commandName}:`, error);
    }
  }
});

client.login(process.env.DISCORD_TOKEN);