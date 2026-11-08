// src/commands/Alert-avisos/helper.js
function formatarPayload(embed, cargoInput, guild) {
  let mencaoCargos = '';
  let rolesArray = [];

  if (cargoInput && cargoInput.trim() !== '') {
    const entradas = cargoInput.split(',').map(item => item.trim()).filter(item => item.length > 0);
    
    for (const entrada of entradas) {
      const idLimpo = entrada.replace(/[<@&>]/g, '');
      let role = guild?.roles.cache.get(idLimpo);
      
      if (!role && guild) {
        const nomeLimpo = entrada.replace(/^@/, '').trim().toLowerCase();
        role = guild.roles.cache.find(r => r.name.toLowerCase() === nomeLimpo || r.name === entrada);
      }

      if (role) {
        rolesArray.push(role.id);
      } else if (/^\d+$/.test(idLimpo)) {
        rolesArray.push(idLimpo);
      }
    }

    if (rolesArray.length > 0) {
      mencaoCargos = rolesArray.map(id => `||<@&${id}>||`).join(' ');
    }
  }

  return {
    content: mencaoCargos ? `🔔 **Aviso importante:** ${mencaoCargos}` : '🔔 **Aviso importante:**',
    embeds: [embed],
    allowedMentions: { roles: rolesArray }
  };
}

module.exports = { formatarPayload };