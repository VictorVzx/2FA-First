const { Client, GatewayIntentBits, Events, REST, Routes, ModalBuilder, TextInputBuilder, ActionRowBuilder, EmbedBuilder, TextInputStyle, ButtonBuilder, ButtonStyle } = require('discord.js');
const OTPAuth = require('otpauth');
const fs = require('fs');
const dotenv = require('dotenv');

dotenv.config();
const TOKEN = process.env.JWT_SECRET;



// Carregar a configuração do arquivo config.json
const config = JSON.parse(fs.readFileSync('./config.json', 'utf8'));
const { clientId, guildId } = config;

// Criação do cliente do bot
const client = new Client({ intents: [GatewayIntentBits.Guilds, GatewayIntentBits.GuildMessages, GatewayIntentBits.MessageContent] });

const rest = new REST({ version: '10' }).setToken(TOKEN);

(async () => {
    try {
        console.log('Iniciando registro de comandos');

        // Registra comandos de barra no servidor
        await rest.put(Routes.applicationGuildCommands(clientId, guildId), {
            body: [
                {
                    name: 'codigo_rockstar',
                    description: 'Gere um código da Rockstar',
                    type: 1,
                },
            ],
        });

        console.log('Comandos registrados com sucesso!');
    } catch (error) {
        console.error('Erro ao registrar comandos:', error);
    }
})();

client.once(Events.ClientReady, () => {
    console.log(`Logado como ${client.user.tag}`);
});

let esperandoCanal = false; // Variável de controle para garantir que o bot só responde depois do comando

client.on(Events.InteractionCreate, async interaction => {
    if (interaction.isCommand()) {
        const { commandName } = interaction;

        if (commandName === 'codigo_rockstar') {
            // Marca que o bot agora está esperando o ID do canal
            esperandoCanal = true;

            // Envia a mensagem pedindo para o usuário enviar o ID do canal
            await interaction.reply({
                content: 'Por favor, envie o **ID do canal** abaixo desta mensagem para onde você deseja enviar a mensagem.',
                ephemeral: true
            });
        }
    }
});

// Escuta todas as mensagens enviadas após o comando /codigo_rockstar
client.on('messageCreate', async message => {
    // Verifica se a mensagem é de um usuário (não do bot) e se o bot está esperando o ID do canal
    if (message.author.bot || !esperandoCanal) return;

    // Verifica se a mensagem foi enviada logo após o comando /codigo_rockstar
    if (message.content) {
        const channelId = message.content.trim(); // ID do canal enviado pelo usuário

        // Verifica se o ID é válido
        const channel = client.channels.cache.get(channelId);

        if (!channel || !channel.isTextBased()) {
            return message.reply('O ID fornecido não corresponde a um canal de texto válido.');
        }

        // Verifica se o bot tem permissão para enviar mensagens no canal
        try {
            await console.log('Testando permissoes do bot'); // Tentando enviar uma mensagem para validar a permissão
        } catch (error) {
            return message.reply('O bot não tem permissão para enviar mensagens neste canal.');
        }

        // Cria a embed com o avatar e banner do bot
        const embed = new EmbedBuilder()
            .setColor('#0099ff')
            .setTitle('🎮 **GERENCIADOR DE CONTAS ROCKSTAR** ⚙️')
            .setDescription('> Clique no botão abaixo para receber códigos da Rockstar comprados na loja. Envio instantâneo de códigos!')
            .setThumbnail(client.user.displayAvatarURL())
            .setImage('https://images-ext-1.discordapp.net/external/qqVVH33OE0eRml8_VIgEJ12i6LvHELyensz6nUsUaj4/%3Fw%3D1024/https/www.cnnbrasil.com.br/wp-content/uploads/sites/12/2022/09/GettyImages-1238390016-e1663593607937.jpg?format=webp&width=768&height=432')
            .setTimestamp();

        // Cria o botão
        const button = new ButtonBuilder()
            .setCustomId('get_code')
            .setLabel('Receber Código')
            .setStyle(ButtonStyle.Primary);

        // Cria a linha de ação com o botão
        const actionRow = new ActionRowBuilder().addComponents(button);

        try {
            // Envia a embed com o botão para o canal escolhido
            await channel.send({ embeds: [embed], components: [actionRow] });

            // Confirmação para o usuário
            await message.reply({
                content: `A mensagem foi enviada para o canal <#${channelId}> com sucesso!`,
                ephemeral: true
            });

            // Reseta a variável esperandoCanal
            esperandoCanal = false;
        } catch (error) {
            console.error('Erro ao enviar mensagem para o canal:', error);
            await message.reply({
                content: 'Houve um erro ao enviar a mensagem para o canal especificado.',
                ephemeral: true
            });

            // Reseta a variável esperandoCanal
            esperandoCanal = false;
        }
    }
});

// Lógica para o botão "Receber Código"
client.on('interactionCreate', async interaction => {
    if (interaction.isButton() && interaction.customId === 'get_code') {
        const modal = new ModalBuilder()
            .setCustomId('codigo_rockstar_modal')
            .setTitle('Código da Rockstar');

        const secretInput = new TextInputBuilder()
            .setCustomId('secret')
            .setLabel('Token da Conta Rockstar')
            .setStyle(TextInputStyle.Short)
            .setRequired(true);

        const actionRow = new ActionRowBuilder().addComponents(secretInput);

        modal.addComponents(actionRow);

        await interaction.showModal(modal);
    } else if (interaction.isModalSubmit()) {
        if (interaction.customId === 'codigo_rockstar_modal') {
            const secret = interaction.fields.getTextInputValue('secret');

            // Enviar uma mensagem informando que o código está sendo gerado
            const response = await interaction.reply({
                content: '**Por favor, espere alguns segundos enquanto estou buscando o código...**',
                ephemeral: true,
                fetchReply: true // Isso é necessário para obter a mensagem enviada
            });

            // Simula um atraso de 5 segundos antes de enviar o código da Rockstar
            setTimeout(async () => {
                try {
                    // Gera o código da Rockstar
                    const totp = new OTPAuth.TOTP({
                        algorithm: 'SHA1',
                        digits: 6,
                        period: 30,
                        secret: OTPAuth.Secret.fromBase32(secret),
                    });

                    const code = totp.generate();

                    // Cria uma embed atraente com o código da Rockstar
                    const embed = new EmbedBuilder()
                        .setColor('#4caf50') // Cor verde clara
                        .setTitle('🛡️ **Seu Código da Rockstar!*  * 🛡️')
                        .setDescription(`**🎟️ Código da Rockstar:**\n\n\`\`\`${code}\`\`\`\n\n**🔒 Proteja sua conta com este código!**`)
                        .setFooter({ text: '🔐 Segurança em primeiro lugar!' })
                        .setTimestamp();

                    // Atualiza a mensagem de espera com o código gerado
                    await interaction.editReply({ content: 'Aqui está o seu código da Rockstar:', embeds: [embed] });
                } catch (error) {
                    console.error('Erro ao gerar código:', error);
                    await interaction.editReply({ content: '**Houve um erro ao gerar o código. Tente novamente mais tarde.**' });
                }
            }, 5000); // Atraso de 5 segundos
        }
    }
});

client.login(TOKEN);
