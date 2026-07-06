/* ==========================================================================
   DevCord - Lógica Interativa (2 Páginas em 1 - Split Screen & Switcher)
   ========================================================================== */

document.addEventListener('DOMContentLoaded', () => {

    // Força o scroll para o topo ao recarregar a página e desativa a restauração automática do navegador
    if (window.history.scrollRestoration) {
        window.history.scrollRestoration = 'manual';
    }
    window.scrollTo(0, 0);

    // Efeito de Spotlight Glow interativo nos cards de serviço
    const serviceCards = document.querySelectorAll('.service-card');
    serviceCards.forEach(card => {
        card.addEventListener('mousemove', e => {
            const rect = card.getBoundingClientRect();
            const x = e.clientX - rect.left;
            const y = e.clientY - rect.top;
            card.style.setProperty('--mouse-x', `${x}px`);
            card.style.setProperty('--mouse-y', `${y}px`);
        });
    });

    /* ==========================================
       1. Controle da Tela Inicial (Boas-vindas Split)
       ========================================== */
    const welcomeOverlay = document.getElementById('welcome-overlay');
    const splitLeftWeb = document.getElementById('split-left-web');
    const splitRightDiscord = document.getElementById('split-right-discord');
    const bodyElement = document.body;
    const modePillBtns = document.querySelectorAll('.mode-pill-btn');

    function initializeSiteMode(mode) {
        // Define o atributo de dados no body que controla a exibição CSS global
        bodyElement.dataset.globalMode = mode;
        
        // Remove a trava de scroll da página
        bodyElement.classList.remove('no-scroll');
        
        // Esconde a tela de Split com fade-out
        if (welcomeOverlay) {
            welcomeOverlay.classList.add('hide');
        }
        
        // Atualiza a pílula de navegação superior (Navbar Toggle)
        modePillBtns.forEach(btn => {
            btn.classList.remove('active');
            if (btn.dataset.mode === mode) {
                btn.classList.add('active');
            }
        });

        // Atualiza e sincroniza a calculadora para o modo escolhido
        updateCalculator();
    }

    if (splitLeftWeb && splitRightDiscord) {
        // Clique no lado WEB
        splitLeftWeb.addEventListener('click', () => {
            initializeSiteMode('web');
        });
        
        // Clique no lado DISCORD
        splitRightDiscord.addEventListener('click', () => {
            initializeSiteMode('discord');
        });
    }

    /* ==========================================
       2. Toggle Deslizante na Navbar (Switcher Manual)
       ========================================== */
    if (modePillBtns.length > 0) {
        modePillBtns.forEach(btn => {
            btn.addEventListener('click', (e) => {
                e.stopPropagation(); // Evita comportamento indesejado
                const selectedMode = btn.dataset.mode;
                
                // Muda o modo global no body
                bodyElement.dataset.globalMode = selectedMode;
                
                // Rola para o topo da página imediatamente
                window.scrollTo({ top: 0, behavior: 'instant' });
                
                // Atualiza visualmente o botão da pílula
                modePillBtns.forEach(b => b.classList.remove('active'));
                btn.classList.add('active');
                
                // Atualiza a calculadora para o novo contexto
                updateCalculator();
            });
        });
    }

    /* ==========================================
       2.1 Botões de Troca de Modo Internos da Página
       ========================================== */
    const switchModeBtns = document.querySelectorAll('.btn-switch-to-mode');
    switchModeBtns.forEach(btn => {
        btn.addEventListener('click', () => {
            const targetMode = btn.dataset.target;
            const navBtn = document.querySelector(`.mode-pill-btn[data-mode="${targetMode}"]`);
            if (navBtn) {
                navBtn.click();
            }
        });
    });

    /* ==========================================
       3. Menu Mobile (Hambúrguer)
       ========================================== */
    const menuToggle = document.getElementById('menu-toggle');
    const navMenu = document.getElementById('nav-menu');
    const navLinks = document.querySelectorAll('.nav-link');

    if (menuToggle && navMenu) {
        menuToggle.addEventListener('click', () => {
            menuToggle.classList.toggle('active');
            navMenu.classList.toggle('active');
        });

        navLinks.forEach(link => {
            link.addEventListener('click', (e) => {
                menuToggle.classList.remove('active');
                navMenu.classList.remove('active');

                const href = link.getAttribute('href');
                if (href && href.startsWith('#')) {
                    const targetId = href.substring(1);
                    const hiddenSections = ['servicos', 'demonstracao', 'orcamento', 'precos'];
                    
                    if (document.body.dataset.globalMode === 'inicio' && hiddenSections.includes(targetId)) {
                        e.preventDefault();
                        
                        const webBtn = document.querySelector('.mode-pill-btn[data-mode="web"]');
                        if (webBtn) {
                            webBtn.click();
                            
                            setTimeout(() => {
                                const targetEl = document.getElementById(targetId);
                                if (targetEl) {
                                    targetEl.scrollIntoView({ behavior: 'smooth' });
                                }
                            }, 50);
                        }
                    }
                }
            });
        });
    }

    /* ==========================================
       4. Destaque Ativo na Navbar ao Scroll
       ========================================== */
    const sections = document.querySelectorAll('section[id]');
    const observerOptions = {
        root: null,
        rootMargin: '-80px 0px -40% 0px',
        threshold: 0
    };

    const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                const id = entry.target.getAttribute('id');
                navLinks.forEach(link => {
                    link.classList.remove('active');
                    if (link.getAttribute('href') === `#${id}`) {
                        link.classList.add('active');
                    }
                });
            }
        });
    }, observerOptions);

    sections.forEach(section => observer.observe(section));

    /* ==========================================
       5. Simuladores de Auditoria Técnica (Removidos)
       ========================================== */

    /* ==========================================
       6. Simulador estilo Discord Client
       ========================================== */
    const discordMessages = document.getElementById('discord-messages');
    const currentChannelName = document.getElementById('current-channel-name');
    const currentChannelDesc = document.getElementById('current-channel-desc');
    const channelItems = document.querySelectorAll('.channel-item');
    const discordInput = document.getElementById('discord-input');

    // Funções utilitárias para renderizar mensagens do Discord
    function appendDiscordMessage(senderName, avatarText, avatarBg, text, embedHtml = "", isBot = false, isApp = false) {
        const timeString = new Date().toLocaleTimeString('pt-BR', { hour: '2-digit', minute: '2-digit' });
        const messageGroup = document.createElement('div');
        messageGroup.classList.add('discord-message-group');
        
        let botTagHtml = '';
        if (isBot) botTagHtml = '<span class="bot-tag">BOT</span>';
        if (isApp) botTagHtml = '<span class="bot-tag app-tag">APP</span>';

        let avatarHtml = `<div class="user-avatar-small ${avatarBg}">${avatarText}</div>`;
        if (avatarText === 'DB') {
            avatarHtml = `<img src="logo.jpg" alt="DevByte Labs Logo" class="user-avatar-small" style="object-fit: cover;">`;
        }

        messageGroup.innerHTML = `
            ${avatarHtml}
            <div class="message-content-wrapper">
                <div class="message-meta">
                    <span class="bot-author-name">${senderName}</span>
                    ${botTagHtml}
                    <span class="message-timestamp">Hoje às ${timeString}</span>
                </div>
                ${text ? `<div class="message-text">${text}</div>` : ''}
                ${embedHtml}
            </div>
        `;

        if (discordMessages) {
            discordMessages.appendChild(messageGroup);
            discordMessages.scrollTop = discordMessages.scrollHeight;
        }
    }

    function showDiscordTyping() {
        const typingWrapper = document.createElement('div');
        typingWrapper.classList.add('discord-message-group', 'discord-typing-indicator');
        typingWrapper.innerHTML = `
            <img src="logo.jpg" alt="DevByte Labs Logo" class="user-avatar-small" style="object-fit: cover;">
            <div class="message-content-wrapper">
                <div class="message-meta">
                    <span class="bot-author-name">DevByte Business</span>
                    <span class="bot-tag app-tag">APP</span>
                </div>
                <div class="typing-dots">
                    <span></span>
                    <span></span>
                    <span></span>
                </div>
            </div>
        `;
        if (discordMessages) {
            discordMessages.appendChild(typingWrapper);
            discordMessages.scrollTop = discordMessages.scrollHeight;
        }
        return typingWrapper;
    }

    // Gerador de embed formatado
    function makeDiscordEmbed(subheader, title, desc, fields = [], borderClass = "border-purple", extraHtml = "") {
        let fieldsHtml = "";
        fields.forEach(f => {
            fieldsHtml += `
                <div class="embed-field">
                    <div class="field-name" style="color: #fff; font-size: 0.85rem; display: flex; align-items: center; gap: 0.45rem; margin-bottom: 0.25rem;">${f.name}</div>
                    <div class="field-value" style="color: #b9bbbe; font-size: 0.8rem; line-height: 1.45; padding-left: 1.25rem;">${f.value}</div>
                </div>
            `;
        });

        return `
            <div class="discord-embed ${borderClass}">
                <div class="embed-subheader">${subheader}</div>
                <div class="embed-title" style="font-size: 1.3rem; font-weight: 800; margin: 0.25rem 0; color: #fff;">${title}</div>
                ${desc ? `<div class="embed-desc" style="color: #b9bbbe; font-size: 0.82rem; margin-bottom: 0.85rem; line-height: 1.45;">${desc}</div>` : ''}
                ${fieldsHtml ? `<div class="embed-fields" style="display: flex; flex-direction: column; gap: 0.75rem;">${fieldsHtml}</div>` : ''}
                ${extraHtml}
            </div>
        `;
    }

    // Configuração dos Conteúdos por Canal
    const channelContents = {
        'inicio': {
            name: '👋 · inicio',
            desc: 'Início da nossa comunidade',
            action: () => {
                const buttonsHtml = `
                    <div class="discord-btn-row">
                        <a href="https://discord.gg/BtmFUf5tXK" target="_blank" class="discord-btn discord-btn-primary" style="text-decoration: none; display: inline-flex; align-items: center; gap: 6px;">
                            💬 Entrar no Servidor Real
                        </a>
                    </div>
                `;
                const embed = makeDiscordEmbed(
                    "DevByte Labs > Início > Boas-vindas",
                    "Boas-vindas ao DevByte Labs!",
                    "Aqui você encontra os melhores robôs para moderação, economia e IA do Discord, além de soluções completas de desenvolvimento para o seu negócio.",
                    [
                        { name: "Como começar?", value: "Navegue pelos canais do servidor na barra lateral esquerda! Visite o canal #servicos ou compre um plano em #comprar." },
                        { name: "Servidor Real", value: "Quer fazer parte da nossa comunidade oficial e acompanhar nossos projetos? Clique no botão abaixo!" }
                    ],
                    "border-purple",
                    buttonsHtml
                );
                appendDiscordMessage("DevByte Business", "DB", "bg-purple", "", embed, false, true);
            }
        },
        'regras': {
            name: '📜 · regras',
            desc: 'Regras de convivência e termos',
            action: () => {
                const embed = makeDiscordEmbed(
                    "DevByte Labs > Início > Termos",
                    "Termos e Diretrizes do Servidor",
                    "Para garantir um ambiente saudável e profissional para todos:",
                    [
                        { name: "1. Respeito Mútuo", value: "Qualquer tipo de assédio, preconceito ou toxicidade resultará em banimento imediato." },
                        { name: "2. Proibido Spam / Links", value: "Não envie links de outros servidores ou anúncios não autorizados." },
                        { name: "3. Suporte Comercial", value: "Precisa de ajuda com faturas ou compras? Utilize o canal #atendimento." }
                    ]
                );
                appendDiscordMessage("DevByte Business", "DB", "bg-purple", "", embed, false, true);
            }
        },
        'novidades': {
            name: '📢 · novidades',
            desc: 'Novidades e atualizações',
            action: () => {
                const embed = makeDiscordEmbed(
                    "DevByte Labs > Início > Novidades",
                    "DevByte Business v2.0 Ativo!",
                    "Atualizamos nossos sistemas para oferecer ainda mais performance e segurança.",
                    [
                        { name: "Novos recursos inclusos:", value: "Integração direta com a API do Gemini 1.5 Pro, novos comandos de moderação automática e blindagem inteligente contra spam de mensagens." }
                    ]
                );
                appendDiscordMessage("DevByte Business", "DB", "bg-purple", "", embed, false, true);
            }
        },
        'status': {
            name: '📊 · status',
            desc: 'Status de operação de serviços',
            action: () => {
                const embed = makeDiscordEmbed(
                    "DevByte Labs > Início > Status",
                    "Status do Sistema",
                    "Monitoramento em tempo real dos nossos robôs e servidores na nuvem.",
                    [
                        { name: "Uptime do Bot IA:", value: "99.98% operacional." },
                        { name: "Latência da API:", value: "32ms (Excelente)." }
                    ]
                );
                appendDiscordMessage("DevByte Business", "DB", "bg-purple", "", embed, false, true);
            }
        },
        'produtos': {
            name: '📦 · produtos',
            desc: 'Conheça e compare nossos bots',
            action: () => {
                const embed = makeDiscordEmbed(
                    "DevByte Labs > Loja > Produtos • Catálogo",
                    "Bots DevByte",
                    "Escolha a solução ideal para organizar, proteger e evoluir seu servidor Discord com tecnologia pronta para usar.",
                    [
                        { 
                            name: "🛡️ Administração e comunidade", 
                            value: "<strong>DevByte Team</strong> &rarr; base leve para estruturar o servidor<br><strong>DevByte Team</strong> &rarr; controle completo, segurança, tickets, IA e administração" 
                        }
                    ],
                    "border-purple",
                    `<div style="font-size: 0.85rem; color: #fff; font-weight: bold; margin-top: 0.85rem; border-top: 1px dashed rgba(255,255,255,0.06); padding-top: 0.55rem;">2 produtos oficiais · 1 pacote completo · DevByte Free com análise manual</div>`
                );
                appendDiscordMessage("DevByte Business", "DB", "bg-purple", "", embed, false, true);
            }
        },
        'servicos': {
            name: '🛠 · servicos',
            desc: 'Serviços de desenvolvimento sob medida',
            action: () => {
                const embed = makeDiscordEmbed(
                    "DevByte Labs > Loja > Serviços • Catálogo",
                    "Serviços Especializados",
                    "Desenvolvemos soluções sob medida para impulsionar sua comunidade ou empresa:",
                    [
                        { name: "🛡️ Segurança e Anti-Raid", value: "Configuração completa de permissões, logs e anti-link automatizado contra invasões e hackers." },
                        { name: "⚙️ Estruturação Geral", value: "Criação de categorias organizadas, design de cargos premium e canais personalizados." },
                        { name: "🤖 Bots com IA Customizados", value: "Robôs integrados ao Gemini/GPT treinados com os dados da sua empresa para atender seus leads." }
                    ]
                );
                appendDiscordMessage("DevByte Business", "DB", "bg-purple", "", embed, false, true);
            }
        },

        'comprar': {
            name: '🛒 · comprar',
            desc: 'Contratação de planos',
            action: () => {
                const buttonsHtml = `
                    <div class="discord-btn-row">
                        <button class="discord-btn discord-btn-success" data-buy-plan="300">🛒 Servidor Completo</button>
                        <button class="discord-btn discord-btn-primary" data-buy-plan="600">🛒 Bot IA & Automações</button>
                        <button class="discord-btn discord-btn-secondary" data-buy-plan="1999">🛒 Comprar Combo</button>
                    </div>
                `;
                const embed = makeDiscordEmbed(
                    "DevByte Labs > Loja > Compras",
                    "Adquira o Seu Plano DevByte",
                    "Selecione a solução que melhor atende à sua comunidade e clique no botão abaixo para simular a contratação em tempo real:",
                    [
                        { name: "💵 Servidor Completo — R$ 300", value: "Configuração profissional completa de canais, categorias e cargos. Entrega em 1 a 2 dias. <strong>Projeto exclusivo!</strong>" },
                        { name: "🤖 Bot IA & Automações — R$ 199 a R$ 999", value: "Assistentes de IA, painéis de vendas, comandos para jogos (GTA RP, Valorant, etc.). Entrega em 2 a 5 dias. <strong>Projeto exclusivo!</strong>" },
                        { name: "👑 Combo Ecossistema — R$ 1.999", value: "Servidor Pro + Bot Inteligente IA + Site Landing Page profissional. <strong>Projeto exclusivo!</strong>" }
                    ],
                    "border-blue",
                    buttonsHtml
                );
                appendDiscordMessage("DevByte Business", "DB", "bg-purple", "", embed, false, true);
            }
        },
        'avaliacoes': {
            name: '⭐ · avaliacoes',
            desc: 'Opinião dos nossos clientes',
            action: () => {
                const embed = makeDiscordEmbed(
                    "DevByte Labs > Loja > Avaliações",
                    "Opinião da Comunidade",
                    "Depoimentos reais de quem já contratou nossos robôs e setups:",
                    [
                        { name: "⭐⭐⭐⭐⭐ @CarlosEduardo", value: "O bot comercial que desenvolvemos com IA tirou toda a carga de suporte manual. Muito bom!" },
                        { name: "⭐⭐⭐⭐⭐ @MarianaDev", value: "Servidor do Discord estruturado de forma impecável. As permissões de cargos ficaram muito organizadas." }
                    ]
                );
                appendDiscordMessage("DevByte Business", "DB", "bg-purple", "", embed, false, true);
            }
        },
        'parcerias': {
            name: '🤝 · parcerias',
            desc: 'Diretrizes de parcerias com DevByte',
            action: () => {
                const embed = makeDiscordEmbed(
                    "DevByte Labs > Loja > Parcerias",
                    "Programa de Parceiros",
                    "Quer crescer junto com a DevByte Labs? Inscreva o seu servidor.",
                    [
                        { name: "Requisitos Mínimos:", value: "Comunidade ativa com mais de 500 membros e divulgação mútua nos canais oficiais." }
                    ]
                );
                appendDiscordMessage("DevByte Business", "DB", "bg-purple", "", embed, false, true);
            }
        },
        'atendimento': {
            name: '🎫 · atendimento',
            desc: 'Abertura de chamados',
            action: () => {
                const buttonsHtml = `
                    <div class="discord-btn-row">
                        <button class="discord-btn discord-btn-success" id="discord-btn-ticket">🎫 Abrir Ticket</button>
                    </div>
                `;
                const embed = makeDiscordEmbed(
                    "DevByte Labs > Atendimento > Chamados",
                    "Central de Atendimento DevByte",
                    "Precisa tirar dúvidas comerciais, solicitar um orçamento específico ou reportar problemas? Clique no botão abaixo para abrir um ticket comercial privado:",
                    [],
                    "border-purple",
                    buttonsHtml
                );
                appendDiscordMessage("DevByte Business", "DB", "bg-purple", "", embed, false, true);
            }
        },
        'duvidas': {
            name: '❓ · duvidas',
            desc: 'Dúvidas frequentes',
            action: () => {
                const embed = makeDiscordEmbed(
                    "DevByte Labs > Atendimento > FAQ",
                    "Dúvidas Frequentes",
                    "Respostas rápidas sobre contratação e desenvolvimento:",
                    [
                        { name: "Qual a forma de pagamento?", value: "Trabalhamos com 50% de sinal e 50% na aprovação final do projeto." },
                        { name: "Qual o prazo de entrega?", value: "Varia de 5 a 15 dias úteis de acordo com a complexidade do servidor ou bot." }
                    ]
                );
                appendDiscordMessage("DevByte Business", "DB", "bg-purple", "", embed, false, true);
            }
        },
        'denuncias': {
            name: '📢 · denuncias',
            desc: 'Denúncias contra membros',
            action: () => {
                const embed = makeDiscordEmbed(
                    "DevByte Labs > Atendimento > Denúncias",
                    "Canal de Denúncias",
                    "Caso encontre membros descumprindo as regras do servidor ou enviando mensagens maliciosas no privado:",
                    [
                        { name: "Como denunciar:", value: "Tire um print da infração e abra um ticket de denúncia em #atendimento." }
                    ]
                );
                appendDiscordMessage("DevByte Business", "DB", "bg-purple", "", embed, false, true);
            }
        }
    };

    // Handler de Navegação de Canais
    if (channelItems.length > 0) {
        channelItems.forEach(item => {
            item.addEventListener('click', () => {
                // Atualiza classe ativa nos itens do canal
                channelItems.forEach(i => i.classList.remove('active'));
                item.classList.add('active');
                
                const channelKey = item.dataset.channel;
                const content = channelContents[channelKey];
                
                if (content) {
                    currentChannelName.textContent = content.name;
                    currentChannelDesc.textContent = content.desc;
                    if (discordInput) {
                        discordInput.placeholder = `Conversar em #${content.name}`;
                    }

                    // Limpa o chat e renderiza a mensagem correspondente
                    if (discordMessages) {
                        discordMessages.innerHTML = '';
                    }

                    // Efeito de digitação rápida
                    const typing = showDiscordTyping();
                    setTimeout(() => {
                        typing.remove();
                        content.action();
                        setupInteractiveDiscordButtons(); // Vincula os novos botões criados
                    }, 650);
                }
            });
        });
    }

    // Configuração de Eventos de Botões Interativos dentro do Chat
    function setupInteractiveDiscordButtons() {
        // 1. Botão de Comprar Planos
        const buyBtns = document.querySelectorAll('[data-buy-plan]');
        buyBtns.forEach(btn => {
            btn.addEventListener('click', (e) => {
                e.stopPropagation();
                const planValue = btn.dataset.buyPlan; // ex: "300", "600", "1999"
                let planLabel = "";
                let formValue = "";

                if (planValue === "300") {
                    planLabel = "Servidor Completo — R$ 300";
                    formValue = "Servidor Completo (Discord) — R$ 300";
                } else if (planValue === "600") {
                    planLabel = "Bot IA & Automações";
                    formValue = "Bot IA & Automações (Discord) — R$ 199 a R$ 999";
                } else if (planValue === "1999") {
                    planLabel = "Combo Ecossistema — R$ 1.999";
                    formValue = "Ecossistema Integrado (Combo)";
                }

                // Imprime mensagem simulada do visitante
                appendDiscordMessage("Visitante", "TU", "bg-blue", `Cliquei no botão de compra: \`${planLabel}\``, "", false);

                // Mostra digitação do Bot e confirmação
                const typing = showDiscordTyping();
                setTimeout(() => {
                    typing.remove();
                    const confirmationEmbed = makeDiscordEmbed(
                        "DevByte Labs > Atendimento > Confirmação",
                        "Ticket de Compra Iniciado!",
                        "Parabéns pela escolha! O plano correspondente foi aplicado em sua calculadora de orçamento e o formulário de contato do site foi pré-selecionado.",
                        [
                            { name: "Próximo passo:", value: "Role a página até o formulário de contato abaixo para preencher seus dados e finalizar a proposta com a nossa equipe comercial." }
                        ],
                        "border-blue"
                    );
                    appendDiscordMessage("DevByte Business", "DB", "bg-purple", "", confirmationEmbed, false, true);
                    
                    // --- AÇÕES REAIS NO SITE ---
                    // Sincroniza calculadora do site para Discord
                    bodyElement.dataset.globalMode = 'discord';
                    
                    // Altera aba de navegação pill superior
                    modePillBtns.forEach(b => {
                        b.classList.remove('active');
                        if (b.dataset.mode === 'discord') b.classList.add('active');
                    });

                    // Define o plano na calculadora
                    const discBase = document.getElementById('disc-base-plan');
                    if (discBase) {
                        discBase.value = (planValue === "600") ? "0" : planValue;
                    }
                    const trigText = document.querySelector('#disc-base-plan-dropdown .selected-text');
                    if (trigText) {
                        trigText.textContent = (planValue === "600") ? "Já possuo servidor (Apenas Adicionais) — R$ 0" : planLabel;
                    }
                    const options = document.querySelectorAll('#disc-base-plan-dropdown .dropdown-option');
                    options.forEach(opt => {
                        opt.classList.remove('active');
                        const targetVal = (planValue === "600") ? "0" : planValue;
                        if (opt.dataset.value === targetVal) opt.classList.add('active');
                    });

                    // Recalcula orçamentos (desmarca e define novos checkboxes)
                    const currentDiscAddons = document.querySelectorAll('.addon-checkbox-disc');
                    if (currentDiscAddons) {
                        currentDiscAddons.forEach(chk => {
                            chk.checked = false;
                            if (planValue === "600" && (chk.id === "disc-addon-exclusive" || chk.id === "disc-addon-ia-pessoal")) {
                                chk.checked = true;
                            }
                        });
                    }
                    if (typeof updateCalculator === 'function') {
                        updateCalculator();
                    }

                    // Preenche o formulário
                    applyDirectPlanSelection(formValue);
                    const currentFormBudgetEst = document.getElementById('form-budget-est');
                    if (currentFormBudgetEst) {
                        currentFormBudgetEst.value = `R$ ${parseInt(planValue).toLocaleString('pt-BR')}`;
                    }

                }, 1000);
            });
        });

        // 2. Botão de Abrir Ticket
        const ticketBtn = document.getElementById('discord-btn-ticket');
        if (ticketBtn) {
            ticketBtn.addEventListener('click', (e) => {
                e.stopPropagation();
                
                // Imprime clique do visitante
                appendDiscordMessage("Visitante", "TU", "bg-blue", "Cliquei no botão de abertura de chamado: `🎫 Abrir Ticket`", "", false);

                const typing = showDiscordTyping();
                setTimeout(() => {
                    typing.remove();

                    // Altera visualmente o cabeçalho do canal simulando a criação de um canal privado
                    currentChannelName.textContent = "🎫 · ticket-001";
                    currentChannelDesc.textContent = "Chamado privado comercial";
                    if (discordInput) discordInput.placeholder = "Escreva aqui para o atendimento...";

                    if (discordMessages) {
                        discordMessages.innerHTML = '';
                    }

                    const ticketEmbed = makeDiscordEmbed(
                        "DevByte Labs > Atendimento > Ticket Comercial",
                        "Canal de Atendimento Iniciado",
                        "Olá! Nossa equipe comercial irá te dar suporte por e-mail ou telefone. O formulário de contato abaixo foi ativado com o assunto do chamado.",
                        [
                            { name: "O que fazer agora?", value: "Preencha seus dados de contato no formulário comercial do site logo abaixo para que possamos te retornar em menos de 24 horas úteis." }
                        ],
                        "border-purple"
                    );
                    appendDiscordMessage("DevByte Business", "DB", "bg-purple", "Canal criado por sua solicitação.", ticketEmbed, false, true);

                    // Sincroniza formulário comercial com "Outro / Orçamento Customizado" e limpa o valor da calculadora
                    const currentFormInterest = document.getElementById('form-interest');
                    if (currentFormInterest) {
                        for (let i = 0; i < currentFormInterest.options.length; i++) {
                            if (currentFormInterest.options[i].value === "Personalizado / Outro") {
                                currentFormInterest.selectedIndex = i;
                                break;
                            }
                        }
                    }
                    const currentFormBudgetEst = document.getElementById('form-budget-est');
                    if (currentFormBudgetEst) {
                        currentFormBudgetEst.value = "Ticket Atendimento Comercial";
                    }
                }, 1000);
            });
        }
    }

    // Inicializa botões interativos no carregamento inicial
    setupInteractiveDiscordButtons();

    /* ==========================================
       7. Calculadora de Orçamento (Exclusiva por Modo)
       ========================================== */
    const webBasePlan = document.getElementById('web-base-plan');
    const discBasePlan = document.getElementById('disc-base-plan');
    const webAddons = document.querySelectorAll('.addon-checkbox-web');
    const discAddons = document.querySelectorAll('.addon-checkbox-disc');
    
    const calcProjectPrice = document.getElementById('calc-project-price');
    const calcProjectTime = document.getElementById('calc-project-time');
    const btnApplyCalculator = document.getElementById('btn-apply-calculator');
    const formInterest = document.getElementById('form-interest');
    const formBudgetEst = document.getElementById('form-budget-est');

    function updateCalculator() {
        const activeMode = bodyElement.dataset.globalMode || 'web';
        const webAddonsGroup = document.getElementById('web-addons-group');
        const discAddonsGroup = document.getElementById('disc-addons-group');
        let total = 0;
        let minDays = 5;
        let maxDays = 10;
        let selectedAddonsCount = 0;

        if (activeMode === 'web') {
            // Lógica de cálculo no modo Web
            if (webBasePlan) {
                const isCombo = webBasePlan.value === '1999';
                if (isCombo) {
                    if (webAddonsGroup) webAddonsGroup.style.display = 'none';
                    webAddons.forEach(checkbox => { checkbox.checked = false; });
                } else {
                    if (webAddonsGroup) webAddonsGroup.style.display = 'block';
                }
                total = parseInt(webBasePlan.value);
                webAddons.forEach(checkbox => {
                    if (checkbox.checked) {
                        total += parseInt(checkbox.value);
                        selectedAddonsCount++;
                    }
                });
            }
            
            // Definição de prazo baseado na complexidade Web
            if (total >= 1999) {
                minDays = 15;
                maxDays = 25;
            } else if (total >= 1499) {
                minDays = 10;
                maxDays = 15;
            } else if (selectedAddonsCount > 1) {
                minDays = 7;
                maxDays = 12;
            }
        } else {
            // Lógica de cálculo no modo Discord
            if (discBasePlan) {
                const isCombo = discBasePlan.value === '1999';
                if (isCombo) {
                    if (discAddonsGroup) discAddonsGroup.style.display = 'none';
                    discAddons.forEach(checkbox => { checkbox.checked = false; });
                } else {
                    if (discAddonsGroup) discAddonsGroup.style.display = 'block';
                }
                total = parseInt(discBasePlan.value);
                discAddons.forEach(checkbox => {
                    if (checkbox.checked) {
                        total += parseInt(checkbox.value);
                        selectedAddonsCount++;
                    }
                });
            }

            // Definição de prazo baseado na complexidade Discord
            if (total >= 1999) {
                minDays = 12;
                maxDays = 18;
            } else if (total >= 600) {
                minDays = 7;
                maxDays = 12;
            } else if (selectedAddonsCount > 1) {
                minDays = 6;
                maxDays = 10;
            }
        }

        // Atualiza a tela com efeito de contagem rápida
        animateNumber(calcProjectPrice, total, "R$ ");
        if (calcProjectTime) {
            calcProjectTime.textContent = `${minDays} a ${maxDays} dias`;
        }

        // Se o usuário selecionou uma opção manual/customizada no formulário, não sobrescreve os dados dele
        if (formInterest && (formInterest.value === "Personalizado / Outro" || formInterest.value === "Assinatura Bot Mensal (Discord)" || formInterest.value === "")) {
            return;
        }

        // Sincroniza em tempo real com o campo de valor estimado do formulário
        if (formBudgetEst) {
            formBudgetEst.value = `R$ ${total.toLocaleString('pt-BR')}`;
        }

        // Sincroniza o dropdown de interesse do formulário
        if (formInterest) {
            let selectedValue = "";
            if (activeMode === 'web') {
                if (webBasePlan) {
                    if (webBasePlan.value === "599") selectedValue = "Landing Page Start (Web) — R$ 599";
                    else if (webBasePlan.value === "1499") selectedValue = "Site Corporativo / E-commerce (Web) — R$ 1499";
                    else if (webBasePlan.value === "1999") selectedValue = "Ecossistema Integrado (Combo) — R$ 1999";
                }
            } else {
                if (discBasePlan) {
                    if (discBasePlan.value === "0") selectedValue = "Apenas Adicionais (Discord)";
                    else if (discBasePlan.value === "300") selectedValue = "Servidor Completo (Discord) — R$ 300";
                    else if (discBasePlan.value === "1999") selectedValue = "Ecossistema Integrado (Combo) — R$ 1999";
                }
            }

            if (selectedValue) {
                formInterest.value = selectedValue;
            }
        }
    }

    function animateNumber(element, target, prefix = "") {
        if (!element) return;
        let current = parseInt(element.textContent.replace(/[^0-9]/g, '')) || 0;
        const step = Math.ceil(Math.abs(target - current) / 8) || 1;
        
        if (current === target) return;

        const interval = setInterval(() => {
            if (current < target) {
                current += step;
                if (current > target) current = target;
            } else {
                current -= step;
                if (current < target) current = target;
            }
            
            element.textContent = `${prefix}${current.toLocaleString('pt-BR')}`;
            
            if (current === target) {
                clearInterval(interval);
            }
        }, 15);
    }

    // Setup Dropdowns Customizados Premium
    const customDropdowns = document.querySelectorAll('.custom-dropdown');
    customDropdowns.forEach(dropdown => {
        const trigger = dropdown.querySelector('.dropdown-trigger');
        const options = dropdown.querySelectorAll('.dropdown-option');
        const hiddenInput = dropdown.querySelector('input[type="hidden"]');
        const selectedText = dropdown.querySelector('.selected-text');

        trigger.addEventListener('click', (e) => {
            e.stopPropagation();
            customDropdowns.forEach(d => {
                if (d !== dropdown) d.classList.remove('open');
            });
            dropdown.classList.toggle('open');
        });

        options.forEach(option => {
            option.addEventListener('click', (e) => {
                e.stopPropagation();
                options.forEach(opt => opt.classList.remove('active'));
                option.classList.add('active');
                
                const val = option.dataset.value;
                selectedText.textContent = option.textContent;
                hiddenInput.value = val;
                
                dropdown.classList.remove('open');
                hiddenInput.dispatchEvent(new Event('change'));
            });
        });
    });

    document.addEventListener('click', () => {
        customDropdowns.forEach(d => d.classList.remove('open'));
    });

    // Vincula listeners para a calculadora
    if (webBasePlan) webBasePlan.addEventListener('change', updateCalculator);
    if (discBasePlan) discBasePlan.addEventListener('change', updateCalculator);
    
    webAddons.forEach(chk => chk.addEventListener('change', updateCalculator));
    discAddons.forEach(chk => chk.addEventListener('change', updateCalculator));

    // Inicializa a calculadora
    updateCalculator();

    /* ==========================================
       8. Aplicação Automática da Configuração no Formulário
       ========================================== */
    if (btnApplyCalculator && formInterest && formBudgetEst) {
        btnApplyCalculator.addEventListener('click', () => {
            const activeMode = bodyElement.dataset.globalMode || 'web';
            let planText = "";

            if (activeMode === 'web') {
                const activeOpt = document.querySelector('#web-base-plan-dropdown .dropdown-option.active');
                planText = activeOpt ? activeOpt.textContent.split(' — ')[0] : "Landing Page Start";
            } else {
                const activeOpt = document.querySelector('#disc-base-plan-dropdown .dropdown-option.active');
                planText = activeOpt ? activeOpt.textContent.split(' — ')[0] : "Configuração: Servidor Start";
            }

            // Seleciona o item correspondente no formulário
            let matched = false;
            if (planText.includes("Já possuo servidor")) {
                for (let i = 0; i < formInterest.options.length; i++) {
                    if (formInterest.options[i].value === "Apenas Adicionais (Discord)") {
                        formInterest.selectedIndex = i;
                        matched = true;
                        break;
                    }
                }
            }
            if (!matched) {
                for (let i = 0; i < formInterest.options.length; i++) {
                    if (formInterest.options[i].text.includes(planText.replace("Web: ", "").replace("Discord: ", "")) || planText.includes(formInterest.options[i].value)) {
                        formInterest.selectedIndex = i;
                        break;
                    }
                }
            }

            // Define o orçamento calculado
            formBudgetEst.value = calcProjectPrice.textContent;
            
            // Rola até o formulário
            document.getElementById('contato').scrollIntoView({ behavior: 'smooth' });
        });
    }

    /* ==========================================
       9. Atalhos de Compra Direta nos Planos
       ========================================== */
    const buyButtons = document.querySelectorAll('.btn-buy-plan');
    const selectServiceBtns = document.querySelectorAll('.btn-select-service');

    function applyDirectPlanSelection(planName) {
        for (let i = 0; i < formInterest.options.length; i++) {
            if (formInterest.options[i].text.includes(planName) || planName.includes(formInterest.options[i].value)) {
                formInterest.selectedIndex = i;
                break;
            }
        }
        
        // Extrai o preço da opção selecionada para preencher o valor estimado
        let basePriceText = "";
        const selectedOpt = formInterest.options[formInterest.selectedIndex];
        if (selectedOpt) {
            const matches = selectedOpt.text.match(/R\$\s*([0-9.]+)/);
            if (matches && matches[1]) {
                basePriceText = `R$ ${matches[1]}`;
            }
        }
        formBudgetEst.value = basePriceText || "";
        
        // Rola até o contato
        document.getElementById('contato').scrollIntoView({ behavior: 'smooth' });
    }

    buyButtons.forEach(btn => {
        btn.addEventListener('click', (e) => {
            e.preventDefault();
            const plan = btn.dataset.plan;
            applyDirectPlanSelection(plan);
        });
    });

    selectServiceBtns.forEach(btn => {
        btn.addEventListener('click', (e) => {
            e.preventDefault();
            const service = btn.dataset.service;
            applyDirectPlanSelection(service);
        });
    });

    // Sincronização reversa (do formulário de contato para a calculadora)
    if (formInterest) {
        formInterest.addEventListener('change', () => {
            const val = formInterest.value;
            let mode = "";
            let targetPlanValue = "";
            let isBotIa = false;
            
            if (val === "Personalizado / Outro") {
                if (formBudgetEst) formBudgetEst.value = "A combinar / Sob consulta";
            } else if (val === "Assinatura Bot Mensal (Discord)") {
                if (formBudgetEst) formBudgetEst.value = "Sob consulta";
            } else if (val === "") {
                if (formBudgetEst) formBudgetEst.value = "";
            }
            
            if (val.includes("(Web)")) {
                mode = "web";
                if (val.includes("599")) targetPlanValue = "599";
                else if (val.includes("1499")) targetPlanValue = "1499";
            } else if (val.includes("(Discord)")) {
                mode = "discord";
                if (val.includes("300")) targetPlanValue = "300";
                else if (val.includes("Apenas Adicionais")) targetPlanValue = "0";
                else if (val.includes("Bot IA")) {
                    targetPlanValue = "0";
                    isBotIa = true;
                }
            } else if (val.includes("(Combo)")) {
                const currentMode = bodyElement.dataset.globalMode || 'web';
                mode = currentMode;
                targetPlanValue = "1999";
            }

            if (mode) {
                bodyElement.dataset.globalMode = mode;
                modePillBtns.forEach(btn => {
                    btn.classList.remove('active');
                    if (btn.dataset.mode === mode) btn.classList.add('active');
                });
            }

            if (mode === 'web' && targetPlanValue) {
                const webBase = document.getElementById('web-base-plan');
                if (webBase) {
                    webBase.value = targetPlanValue;
                    const trigText = document.querySelector('#web-base-plan-dropdown .selected-text');
                    if (trigText) {
                        const opt = document.querySelector(`#web-base-plan-dropdown .dropdown-option[data-value="${targetPlanValue}"]`);
                        if (opt) trigText.textContent = opt.textContent;
                    }
                    const options = document.querySelectorAll('#web-base-plan-dropdown .dropdown-option');
                    options.forEach(opt => {
                        opt.classList.remove('active');
                        if (opt.dataset.value === targetPlanValue) opt.classList.add('active');
                    });
                }
            } else if (mode === 'discord' && targetPlanValue) {
                const discBase = document.getElementById('disc-base-plan');
                if (discBase) {
                    discBase.value = targetPlanValue;
                    const trigText = document.querySelector('#disc-base-plan-dropdown .selected-text');
                    if (trigText) {
                        const opt = document.querySelector(`#disc-base-plan-dropdown .dropdown-option[data-value="${targetPlanValue}"]`);
                        if (opt) trigText.textContent = opt.textContent;
                    }
                    const options = document.querySelectorAll('#disc-base-plan-dropdown .dropdown-option');
                    options.forEach(opt => {
                        opt.classList.remove('active');
                        if (opt.dataset.value === targetPlanValue) opt.classList.add('active');
                    });
                }

                if (isBotIa) {
                    const currentDiscAddons = document.querySelectorAll('.addon-checkbox-disc');
                    if (currentDiscAddons) {
                        currentDiscAddons.forEach(chk => {
                            chk.checked = (chk.id === "disc-addon-exclusive" || chk.id === "disc-addon-ia-pessoal");
                        });
                    }
                }
            }

            updateCalculator();
        });
    }

    /* ==========================================
       10. Envio do Formulário e Persistência Local
       ========================================== */
    const leadForm = document.getElementById('lead-form');
    const formSuccessMessage = document.getElementById('form-success-message');
    const resetFormBtn = document.getElementById('reset-form-btn');
    const submitBtn = document.getElementById('submit-btn');

    if (leadForm) {
        leadForm.addEventListener('submit', async (e) => {
            e.preventDefault();
            
            const btnText = submitBtn.querySelector('.btn-text');
            const spinner = submitBtn.querySelector('.loader-spinner');
            
            submitBtn.disabled = true;
            btnText.style.display = 'none';
            spinner.style.display = 'inline-block';
            
            const leadData = {
                nome: document.getElementById('form-name').value,
                email: document.getElementById('form-email').value,
                telefone: document.getElementById('form-phone').value,
                servico: formInterest.value,
                status: 'Pendente',
                estimativa: formBudgetEst.value || "Sem simulação de adicionais",
                mensagem: document.getElementById('form-message').value
            };

            try {
                if (window.supabaseClient) {
                    const { error } = await window.supabaseClient
                        .from('leads')
                        .insert([leadData]);
                    if (error) throw error;
                } else {
                    let savedLeads = JSON.parse(localStorage.getItem('devcord_leads') || '[]');
                    savedLeads.push({
                        ...leadData,
                        estimativaCalculadora: leadData.estimativa,
                        timestamp: new Date().toISOString()
                    });
                    localStorage.setItem('devcord_leads', JSON.stringify(savedLeads));
                }
            } catch (err) {
                console.error("Erro no Supabase, salvando localmente:", err);
                let savedLeads = JSON.parse(localStorage.getItem('devcord_leads') || '[]');
                savedLeads.push({
                    ...leadData,
                    estimativaCalculadora: leadData.estimativa,
                    timestamp: new Date().toISOString()
                });
                localStorage.setItem('devcord_leads', JSON.stringify(savedLeads));
            }

            leadForm.style.display = 'none';
            formSuccessMessage.style.display = 'flex';
            
            submitBtn.disabled = false;
            btnText.style.display = 'inline-block';
            spinner.style.display = 'none';
            
            leadForm.reset();
            if (typeof updateCalculator === 'function') {
                updateCalculator();
            }
        });
    }

    if (resetFormBtn && leadForm && formSuccessMessage) {
        resetFormBtn.addEventListener('click', () => {
            formSuccessMessage.style.display = 'none';
            leadForm.style.display = 'flex';
            if (typeof updateCalculator === 'function') {
                updateCalculator();
            }
        });
    }

    /* ==========================================
       11. Lógica do Quiz Recomendador de Planos Web
       ========================================== */
    const quizStepBtns = document.querySelectorAll('.quiz-opt-btn');
    const quizSteps = document.querySelectorAll('.quiz-step');
    const quizResult = document.getElementById('quiz-result');
    const quizResultTitle = document.getElementById('quiz-result-title');
    const quizResultDesc = document.getElementById('quiz-result-desc');
    const quizResultFeatures = document.getElementById('quiz-result-features');
    const btnSelectQuizPlan = document.getElementById('btn-select-quiz-plan');
    const btnRestartQuiz = document.getElementById('btn-restart-quiz');
    
    // Elementos de blueprint visual
    const bpPages = document.getElementById('bp-pages');
    const bpEcommerce = document.getElementById('bp-ecommerce');
    const bpAdmin = document.getElementById('bp-admin');
    let quizAnswers = { q1: null, q2: null, q3: null };
    let recommendedPlanGlobal = "";
    let finalEstimatedBudget = 0;

    function handleQuizRecommendation() {
        // Calcular pontuações
        const lpVotes = (quizAnswers.q1 === 'lp' ? 1 : 0) + (quizAnswers.q2 === 'lp' ? 1 : 0) + (quizAnswers.q3 === 'lp' ? 1 : 0);
        const corpVotes = (quizAnswers.q1 === 'corp' ? 1 : 0) + (quizAnswers.q2 === 'corp' ? 1 : 0) + (quizAnswers.q3 === 'corp' ? 1 : 0);
        
        // Define o plano vencedor
        if (corpVotes >= 2) {
            recommendedPlanGlobal = "corp";
            quizResultTitle.textContent = "Corporativo / E-commerce";
            quizResultDesc.textContent = "Seu projeto necessita de uma estrutura mais completa e autônoma. O plano Corporativo é ideal para marcas que buscam credibilidade sólida, catálogo de produtos expansível, checkout ou múltiplos serviços organizados, além da liberdade total de editar dados pelo Painel Administrativo sem custos adicionais de suporte.";
            quizResultFeatures.innerHTML = `
                <li><strong>Múltiplas páginas estruturadas</strong> (Sobre Nós, Galeria, Serviços, FAQ)</li>
                <li><strong>Painel Administrativo completo</strong> para gerenciar fotos, banners e textos</li>
                <li><strong>Integração de Catálogo</strong> com opção de carrinho de compras</li>
                <li>Hospedagem VPS de alto nível configurada por 1 ano</li>
            `;
            
            // Ativa o brilho neon nos blocos avançados do Blueprint
            if (bpPages) bpPages.className = 'blueprint-block glow';
            if (bpEcommerce) bpEcommerce.className = 'blueprint-block glow';
            if (bpAdmin) bpAdmin.className = 'blueprint-block glow';
        } else {
            recommendedPlanGlobal = "lp";
            quizResultTitle.textContent = "Landing Page Start";
            quizResultDesc.textContent = "Para seus objetivos atuais, a Landing Page Start é perfeita! Ela remove distrações e foca em uma página de rolagem única focada 100% em capturar o tráfego que vem de anúncios diretos (Facebook/Instagram/Marketplace) com velocidade máxima de carregamento.";
            quizResultFeatures.innerHTML = `
                <li><strong>Foco exclusivo em conversão</strong> rápida de clientes</li>
                <li><strong>Velocidade de carregamento extrema</strong> no celular</li>
                <li>Formulários de captação de leads otimizados</li>
                <li>Design de conversão focado em contatos</li>
            `;
            
            // Mantém os blocos avançados travados / cinzas no Blueprint
            if (bpPages) bpPages.className = 'blueprint-block locked';
            if (bpEcommerce) bpEcommerce.className = 'blueprint-block locked';
            if (bpAdmin) bpAdmin.className = 'blueprint-block locked';
        }

        // --- CÁLCULO DINÂMICO DE ORÇAMENTO BASEADO NAS ESCOLHAS DO QUIZ ---
        let basePrice = (quizAnswers.q1 === 'lp') ? 599 : 1499;
        let finalPrice = basePrice;
        
        // Pergunta 2 (Painel Admin)
        if (quizAnswers.q2 === 'corp') {
            finalPrice += 500; // Painel Admin
        }
        
        // Pergunta 3 (Tráfego Pago vs SEO)
        if (quizAnswers.q3 === 'corp') {
            finalPrice += 300; // SEO Avançado
        }

        finalEstimatedBudget = finalPrice;

        // Exibe o preço calculado no quiz
        const quizPriceEl = document.getElementById('quiz-calculated-price');
        if (quizPriceEl) {
            quizPriceEl.textContent = `R$ ${finalPrice.toLocaleString('pt-BR')}`;
        }

        // Exibe o painel de resultados
        quizResult.style.display = 'flex';
    }

    quizStepBtns.forEach(btn => {
        btn.addEventListener('click', () => {
            const currentStep = btn.closest('.quiz-step');
            const stepNum = currentStep.dataset.step;
            const val = btn.dataset.value;
            
            // Grava a resposta da pergunta atual
            quizAnswers['q' + stepNum] = val;

            const nextStepNum = btn.dataset.next;

            if (currentStep) {
                currentStep.style.display = 'none';
            }

            if (nextStepNum) {
                // Vai para a próxima pergunta
                const nextStep = document.querySelector(`.quiz-step[data-step="${nextStepNum}"]`);
                if (nextStep) nextStep.style.display = 'block';
            } else if (btn.dataset.finish === "true") {
                // Concluiu o Quiz
                handleQuizRecommendation();
            }
        });
    });

    if (btnRestartQuiz) {
        btnRestartQuiz.addEventListener('click', () => {
            quizAnswers = { q1: null, q2: null, q3: null };
            recommendedPlanGlobal = "";
            finalEstimatedBudget = 0;
            
            // Esconde resultados
            if (quizResult) quizResult.style.display = 'none';
            
            // Reseta blueprint para o padrão bloqueado nas seções avançadas
            if (bpPages) bpPages.className = 'blueprint-block locked';
            if (bpEcommerce) bpEcommerce.className = 'blueprint-block locked';
            if (bpAdmin) bpAdmin.className = 'blueprint-block locked';

            // Mostra o passo 1
            quizSteps.forEach(step => {
                if (step.dataset.step === "1") {
                    step.style.display = 'block';
                } else {
                    step.style.display = 'none';
                }
            });
        });
    }

    if (btnSelectQuizPlan) {
        btnSelectQuizPlan.addEventListener('click', () => {
            // Sincroniza a base de planos na calculadora
            const baseValue = (quizAnswers.q1 === 'lp') ? "599" : "1499";
            const baseTitle = (quizAnswers.q1 === 'lp') ? "Landing Page Start — R$ 599" : "Site Corporativo / E-commerce — R$ 1.499";
            
            const webBase = document.getElementById('web-base-plan');
            if (webBase) {
                webBase.value = baseValue;
            }
            
            const trigText = document.querySelector('#web-base-plan-dropdown .selected-text');
            if (trigText) {
                trigText.textContent = baseTitle;
            }
            
            const options = document.querySelectorAll('#web-base-plan-dropdown .dropdown-option');
            options.forEach(opt => {
                opt.classList.remove('active');
                if (opt.dataset.value === baseValue) opt.classList.add('active');
            });

            // Sincroniza os adicionais selecionados no quiz com os checkboxes da calculadora
            const seoChk = document.getElementById('web-addon-seo');
            const painelChk = document.getElementById('web-addon-painel');

            if (seoChk) seoChk.checked = (quizAnswers.q3 === 'corp');
            if (painelChk) painelChk.checked = (quizAnswers.q2 === 'corp');

            // Dispara recálculo e sincroniza calculadora visual
            if (webBase) {
                webBase.dispatchEvent(new Event('change'));
            }

            // Seleciona o serviço adequado no formulário de contato
            const planFormName = (quizAnswers.q1 === 'lp') ? "Landing Page Start (Web)" : "Site Corporativo / E-commerce (Web)";
            applyDirectPlanSelection(planFormName);

            // Grava o orçamento exato calculado pelo quiz no formulário de contato
            if (formBudgetEst) {
                formBudgetEst.value = `R$ ${finalEstimatedBudget.toLocaleString('pt-BR')}`;
            }
        });
    }

    /* ==========================================
       18. Pizzeria Interactive Cart Logic (Smartphone Mini-Site)
       ========================================== */
    const cart = {}; // key: productID, value: { name, price, qty }
    const cartBar = document.getElementById('phone-cart-bar');
    const cartCount = document.getElementById('phone-cart-count');
    const cartTotal = document.getElementById('phone-cart-total');
    
    const checkoutModal = document.getElementById('phone-checkout-modal');
    const closeCheckoutBtn = document.getElementById('close-checkout-btn');
    const checkoutItemsList = document.getElementById('checkout-items-list');
    
    const summarySubtotal = document.getElementById('summary-subtotal');
    const summaryTotal = document.getElementById('summary-total');
    
    const submitOrderBtn = document.getElementById('submit-order-btn');
    const successScreen = document.getElementById('phone-success-screen');
    const restartPhoneDemoBtn = document.getElementById('restart-phone-demo-btn');

    // Inicializa todos os wrappers de botoes
    const wrappers = document.querySelectorAll('.cart-control-wrapper');
    wrappers.forEach(wrapper => {
        updateWrapperUI(wrapper);
    });

    // Make entire cards clickable to add to cart
    document.querySelectorAll('.pizza-card, .highlight-card').forEach(card => {
        card.addEventListener('click', (e) => {
            // Prevent triggering if user clicked an inner button directly
            if (e.target.closest('button')) return;
            
            let id, name, price;
            if (card.classList.contains('highlight-card')) {
                id = card.dataset.id;
                name = card.dataset.name;
                price = parseFloat(card.dataset.price);
            } else {
                const wrapper = card.querySelector('.cart-control-wrapper');
                if (!wrapper) return;
                id = wrapper.dataset.id;
                name = wrapper.dataset.name;
                price = parseFloat(wrapper.dataset.price);
            }
            if (id && name && !isNaN(price)) {
                addToCart(id, name, price);
                
                // Add a small bounce animation to the card
                card.style.transform = 'scale(0.95)';
                setTimeout(() => card.style.transform = '', 150);
            }
        });
    });

    function updateWrapperUI(wrapper) {
        const id = wrapper.dataset.id;
        const name = wrapper.dataset.name;
        const price = parseFloat(wrapper.dataset.price);
        const qty = cart[id] ? cart[id].qty : 0;

        if (qty === 0) {
            wrapper.innerHTML = `
                <button class="add-to-cart-btn add-btn"><svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="3" stroke-linecap="round"><line x1="12" y1="5" x2="12" y2="19"/><line x1="5" y1="12" x2="19" y2="12"/></svg></button>
            `;
            const btn = wrapper.querySelector('.add-to-cart-btn');
            btn.addEventListener('click', (e) => {
                e.stopPropagation();
                addToCart(id, name, price);
            });
        } else {
            wrapper.innerHTML = `
                <div style="display: flex; align-items: center; background: rgba(0,0,0,0.5); border-radius: 50px; border: 1px solid rgba(255,255,255,0.1); width: 75px; justify-content: space-between; box-sizing: border-box; padding: 2px;">
                    <button class="qty-minus" style="background: rgba(255,255,255,0.1); border-radius: 50%; border: none; color: #fff; font-size: 0.8rem; font-weight: 900; cursor: pointer; width: 24px; height: 24px; display: flex; align-items: center; justify-content: center; line-height: 1;">-</button>
                    <span class="qty-val" style="color: #fff; font-size: 0.75rem; font-weight: 900;">${qty}</span>
                    <button class="qty-plus" style="background: #dc2626; border-radius: 50%; border: none; color: #fff; font-size: 0.8rem; font-weight: 900; cursor: pointer; width: 24px; height: 24px; display: flex; align-items: center; justify-content: center; line-height: 1;">+</button>
                </div>
            `;
            wrapper.querySelector('.qty-plus').addEventListener('click', (e) => {
                e.stopPropagation();
                addToCart(id, name, price);
            });
            wrapper.querySelector('.qty-minus').addEventListener('click', (e) => {
                e.stopPropagation();
                removeFromCart(id);
            });
        }
    }

    function addToCart(id, name, price) {
        if (!cart[id]) {
            cart[id] = { name: name, price: price, qty: 1 };
        } else {
            cart[id].qty++;
        }
        updateCartState();
    }

    function removeFromCart(id) {
        if (cart[id]) {
            cart[id].qty--;
            if (cart[id].qty <= 0) {
                delete cart[id];
            }
        }
        updateCartState();
    }

    function updateCartState() {
        let totalItems = 0;
        let totalPrice = 0;

        for (const id in cart) {
            totalItems += cart[id].qty;
            totalPrice += cart[id].qty * cart[id].price;
        }

        wrappers.forEach(wrapper => {
            updateWrapperUI(wrapper);
        });

        if (totalItems > 0) {
            cartCount.textContent = totalItems === 1 ? '1 item' : `${totalItems} itens`;
            cartTotal.textContent = `R$ ${totalPrice.toFixed(2).replace('.', ',')}`;
            
            cartBar.style.opacity = '1';
            cartBar.style.transform = 'translateY(0)';
            cartBar.style.pointerEvents = 'auto';
        } else {
            cartBar.style.opacity = '0';
            cartBar.style.transform = 'translateY(15px)';
            cartBar.style.pointerEvents = 'none';
        }

        updateCheckoutModal();
    }

    function updateCheckoutModal() {
        let totalItems = 0;
        let totalPrice = 0;
        checkoutItemsList.innerHTML = '';

        for (const id in cart) {
            const item = cart[id];
            totalItems += item.qty;
            totalPrice += item.qty * item.price;

            const itemRow = document.createElement('div');
            itemRow.style.cssText = 'display: flex; justify-content: space-between; align-items: center; background: rgba(255,255,255,0.03); border: 1px solid rgba(255,255,255,0.05); border-radius: 10px; padding: 8px 12px; font-size: 0.8rem; box-sizing: border-box; margin-bottom: 6px;';
            itemRow.innerHTML = `
                <div style="text-align: left; flex: 1; min-width: 0; padding-right: 8px;">
                    <div style="font-weight: 800; color: #ffffff; overflow: hidden; text-overflow: ellipsis; white-space: nowrap; font-size: 0.85rem;">${item.name}</div>
                    <div style="color: #94a3b8; font-size: 0.7rem;">R$ ${item.price.toFixed(2).replace('.', ',')} cada</div>
                </div>
                <div style="display: flex; align-items: center; gap: 10px; flex-shrink: 0;">
                    <div style="display: flex; align-items: center; background: rgba(0,0,0,0.5); border-radius: 50px; border: 1px solid rgba(255,255,255,0.1); padding: 2px;">
                        <button class="modal-qty-minus" data-id="${id}" style="background: rgba(255,255,255,0.1); border-radius: 50%; border: none; color: #fff; font-size: 0.8rem; font-weight: 900; cursor: pointer; width: 22px; height: 22px; display: flex; align-items: center; justify-content: center; line-height: 1;">-</button>
                        <span style="font-weight: 900; color: #fff; padding: 0 8px; font-size: 0.75rem;">${item.qty}</span>
                        <button class="modal-qty-plus" data-id="${id}" style="background: #dc2626; border-radius: 50%; border: none; color: #fff; font-size: 0.8rem; font-weight: 900; cursor: pointer; width: 22px; height: 22px; display: flex; align-items: center; justify-content: center; line-height: 1;">+</button>
                    </div>
                    <span style="font-weight: 900; color: #4ade80; min-width: 65px; text-align: right; font-size: 0.85rem;">R$ ${(item.qty * item.price).toFixed(2).replace('.', ',')}</span>
                </div>
            `;
            checkoutItemsList.appendChild(itemRow);
        }

        checkoutItemsList.querySelectorAll('.modal-qty-plus').forEach(btn => {
            btn.addEventListener('click', () => {
                const id = btn.dataset.id;
                addToCart(id, cart[id].name, cart[id].price);
            });
        });
        checkoutItemsList.querySelectorAll('.modal-qty-minus').forEach(btn => {
            btn.addEventListener('click', () => {
                const id = btn.dataset.id;
                removeFromCart(id);
            });
        });

        const subtotalStr = `R$ ${totalPrice.toFixed(2).replace('.', ',')}`;
        summarySubtotal.textContent = subtotalStr;

        // Taxa de entrega dinâmica: grátis acima de R$ 50,00
        const deliveryFeeElement = document.getElementById('summary-delivery-fee');
        let deliveryFee = 5.0;
        if (totalPrice >= 50.0 || totalPrice === 0) {
            deliveryFee = 0.0;
            if (deliveryFeeElement) {
                deliveryFeeElement.textContent = 'Grátis';
                deliveryFeeElement.style.color = '#16a34a';
                deliveryFeeElement.style.fontWeight = 'bold';
            }
        } else {
            if (deliveryFeeElement) {
                deliveryFeeElement.textContent = 'R$ 5,00';
                deliveryFeeElement.style.color = '#64748b';
                deliveryFeeElement.style.fontWeight = 'normal';
            }
        }

        const finalTotal = totalPrice + deliveryFee;
        const totalStr = `R$ ${finalTotal.toFixed(2).replace('.', ',')}`;
        summaryTotal.textContent = totalStr;

        if (totalItems === 0) {
            closeCheckout();
        }
    }

    if (cartBar) {
        cartBar.addEventListener('click', () => {
            openCheckout();
        });
    }
    
    if (closeCheckoutBtn) {
        closeCheckoutBtn.addEventListener('click', () => {
            closeCheckout();
        });
    }

    function openCheckout() {
        if (checkoutModal) {
            checkoutModal.style.transform = 'translateY(0)';
        }
    }

    function closeCheckout() {
        if (checkoutModal) {
            checkoutModal.style.transform = 'translateY(100%)';
        }
    }

    if (submitOrderBtn) {
        submitOrderBtn.addEventListener('click', () => {
            submitOrderBtn.disabled = true;
            submitOrderBtn.textContent = 'Enviando... ⏳';

            setTimeout(() => {
                if (successScreen) {
                    successScreen.style.opacity = '1';
                    successScreen.style.pointerEvents = 'auto';
                    successScreen.style.transform = 'scale(1)';
                }
                submitOrderBtn.disabled = false;
                submitOrderBtn.textContent = 'Enviar Pedido p/ Cozinha 🍕';
                closeCheckout();
            }, 800);
        });
    }

    if (restartPhoneDemoBtn) {
        restartPhoneDemoBtn.addEventListener('click', () => {
            for (const id in cart) {
                delete cart[id];
            }
            updateCartState();

            if (successScreen) {
                successScreen.style.opacity = '0';
                successScreen.style.pointerEvents = 'none';
                successScreen.style.transform = 'scale(0.95)';
            }
        });
    }

    /* ==========================================
       10. Controle do Modal de Prévia dos Mockups Web
       ========================================== */
    const previewModal = document.getElementById('preview-modal');
    const modalTitle = document.getElementById('modal-project-title');
    const modalTags = document.getElementById('modal-project-tags');
    const modalBrowserUrl = document.getElementById('modal-browser-url');
    const modalIframe = document.getElementById('modal-project-iframe');
    const modalDesc = document.getElementById('modal-project-desc');
    const btnPrev = document.getElementById('modal-btn-prev');
    const btnNext = document.getElementById('modal-btn-next');

    let currentProjectIndex = 0;

    const projectsData = [
        {
            title: "Dashboard de Alta Performance",
            url: "https://analise.devbytelabs.com.br/dashboard",
            iframeUrl: "portfolio-dashboard.html",
            desc: "Painel de controle corporativo de alta performance integrado a APIs em tempo real, bancos de dados relotados e métricas interativas.",
            tags: ["React", "Node.js", "Chart.js", "PostgreSQL"],
            tagColors: ["rgba(0, 242, 254, 0.15)", "rgba(59, 130, 246, 0.15)", "rgba(168, 85, 247, 0.15)", "rgba(16, 185, 129, 0.15)"],
            tagTextColors: ["var(--secondary)", "#93c5fd", "#d8b4fe", "#34d399"]
        },
        {
            title: "Lojas Virtuais & E-commerce",
            url: "https://aeterna.devbytelabs.com.br/headphone-orbital",
            iframeUrl: "portfolio-ecommerce.html",
            desc: "Plataforma de e-commerce otimizada para conversão, carrinho reativo, catálogo de alta velocidade e checkout integrado com Pix/Cartão.",
            tags: ["Next.js", "TailwindCSS", "Stripe API", "Vercel"],
            tagColors: ["rgba(255, 255, 255, 0.08)", "rgba(59, 130, 246, 0.15)", "rgba(239, 68, 68, 0.15)", "rgba(16, 185, 129, 0.15)"],
            tagTextColors: ["#fff", "#93c5fd", "#fca5a5", "#34d399"]
        },
        {
            title: "Landing Pages & Sites de Conversão",
            url: "https://nexus.devbytelabs.com.br/scale-your-stack",
            iframeUrl: "portfolio-landing.html",
            desc: "Página de conversão moderna de alta velocidade focada em tráfego pago, SEO local e design visual premium para capturar leads de vendas.",
            tags: ["HTML5", "Vanilla CSS", "JavaScript", "SEO Local"],
            tagColors: ["rgba(249, 115, 22, 0.15)", "rgba(59, 130, 246, 0.15)", "rgba(234, 179, 8, 0.15)", "rgba(168, 85, 247, 0.15)"],
            tagTextColors: ["#fdba74", "#93c5fd", "#fde047", "#d8b4fe"]
        }
    ];

    window.openPreviewModal = function(index) {
        currentProjectIndex = index - 1;
        updateModalContent();
        
        if (previewModal) {
            previewModal.style.display = 'flex';
            previewModal.offsetHeight; // Force reflow
            previewModal.style.opacity = '1';
            previewModal.querySelector('.preview-modal-content').style.transform = 'scale(1)';
        }
        document.body.style.overflow = 'hidden';
    };

    window.closePreviewModal = function() {
        if (previewModal) {
            previewModal.style.opacity = '0';
            previewModal.querySelector('.preview-modal-content').style.transform = 'scale(0.95)';
            setTimeout(() => {
                previewModal.style.display = 'none';
            }, 300);
        }
        document.body.style.overflow = '';
    };

    function updateModalContent() {
        const project = projectsData[currentProjectIndex];
        if (!project) return;

        modalTitle.textContent = project.title;
        modalBrowserUrl.textContent = project.url;
        modalIframe.src = project.iframeUrl;
        modalDesc.textContent = project.desc;

        modalTags.innerHTML = '';
        project.tags.forEach((tag, idx) => {
            const span = document.createElement('span');
            span.textContent = tag;
            span.style.padding = '4px 10px';
            span.style.borderRadius = '5px';
            span.style.fontSize = '0.65rem';
            span.style.fontWeight = 'bold';
            span.style.fontFamily = 'monospace';
            span.style.background = project.tagColors[idx] || 'rgba(255,255,255,0.08)';
            span.style.color = project.tagTextColors[idx] || '#fff';
            modalTags.appendChild(span);
        });

        const browserScrollContainer = modalIframe.parentElement;
        if (browserScrollContainer) {
            browserScrollContainer.scrollTop = 0;
        }
    }

    if (btnPrev && btnNext) {
        btnPrev.addEventListener('click', (e) => {
            e.stopPropagation();
            currentProjectIndex = (currentProjectIndex - 1 + projectsData.length) % projectsData.length;
            updateModalContent();
        });

        btnNext.addEventListener('click', (e) => {
            e.stopPropagation();
            currentProjectIndex = (currentProjectIndex + 1) % projectsData.length;
            updateModalContent();
        });
    }

    if (previewModal) {
        previewModal.addEventListener('click', (e) => {
            if (e.target === previewModal) {
                closePreviewModal();
            }
        });
    }

    // Suporte a teclas ESC, seta esquerda e seta direita
    document.addEventListener('keydown', (e) => {
        if (previewModal && previewModal.style.display === 'flex') {
            if (e.key === 'Escape') {
                closePreviewModal();
            } else if (e.key === 'ArrowLeft') {
                btnPrev.click();
            } else if (e.key === 'ArrowRight') {
                btnNext.click();
            }
        }
    });

    /* ==========================================
       10. Feature Showcase — Bot Capabilities
       ========================================== */

    const featureData = {
        'antiraid': {
            tag: 'PROTEÇÃO',
            title: 'Anti-Raid',
            desc: 'Detecta e bloqueia automaticamente ataques coordenados de invasão. Quando vários usuários entram ao mesmo tempo ou spam é detectado, o bot entra em modo de segurança e bloqueia entradas temporariamente.',
            bullets: ['Detecção de entrada em massa em poucos segundos', 'Bloqueio automático de novos membros em modo raid', 'Notificação imediata para administradores', 'Reativação automática após período de segurança'],
            service: 'Bot Profissional com Anti-Raid'
        },
        'ia': {
            tag: 'INTELIGÊNCIA ARTIFICIAL',
            title: 'IA Integrada',
            desc: 'O bot responde perguntas dos membros exclusivamente sobre os serviços do seu servidor Discord — preços, planos, como contratar e informações da sua empresa. Nada além disso.',
            bullets: ['Responde somente sobre os serviços do seu servidor', 'Configurado com as informações do seu negócio', 'Integração com a API Gemini do Google', 'Ativo 24/7 no seu servidor'],
            service: 'Bot com IA Gemini Integrada'
        },
        'tickets': {
            tag: 'ATENDIMENTO',
            title: 'Sistema de Tickets',
            desc: 'Organiza o suporte e atendimento do servidor. Membros abrem chamados com um clique e recebem um canal privado exclusivo com a equipe.',
            bullets: ['Botão de abertura em painel fixo no canal', 'Canal privado criado automaticamente', 'Notificação para a equipe de suporte', 'Fechamento e arquivamento com transcript'],
            service: 'Configuração de Servidor + Tickets'
        },
        'boas-vindas': {
            tag: 'EXPERIÊNCIA DO MEMBRO',
            title: 'Boas-vindas Automático',
            desc: 'Toda vez que um novo membro entra, o bot envia automaticamente uma mensagem de boas-vindas personalizada no canal e/ou em DM, com as informações essenciais do servidor.',
            bullets: ['Mensagem com nome e número do membro', 'Enviado no canal público e por DM', 'Embed personalizável com cores e logo', 'Direcionamento automático para regras e canais'],
            service: 'Configuração Completa de Servidor'
        },
        'antispam': {
            tag: 'MODERAÇÃO',
            title: 'Anti-Spam',
            desc: 'Monitora mensagens em todos os canais e age automaticamente contra spam, links suspeitos e flood de mensagens, sem precisar de moderadores humanos.',
            bullets: ['Detecção de mensagens idênticas em sequência', 'Silenciamento e ban automático configurável', 'Deletação imediata de links suspeitos', 'Log de todas as punições aplicadas'],
            service: 'Bot com Moderação Automática'
        },
        'logs': {
            tag: 'AUDITORIA',
            title: 'Logs de Auditoria',
            desc: 'Canal dedicado a registrar todas as ações importantes do servidor em tempo real — entradas, saídas, bans, edições de mensagens e alterações de cargos.',
            bullets: ['Registro de entradas e saídas de membros', 'Log de mensagens editadas e deletadas', 'Histórico de bans, kicks e punições', 'Alterações de cargos e permissões'],
            service: 'Servidor Completo com Logs'
        }
    };

    const fsPills = document.querySelectorAll('.fs-pill');
    const fsTag = document.getElementById('fs-tag');
    const fsTitle = document.getElementById('fs-title');
    const fsDesc = document.getElementById('fs-desc');
    const fsBullets = document.getElementById('fs-bullets');
    const fsCtaBtn = document.querySelector('#feature-showcase .btn-select-service');

    function switchFeature(feature) {
        // Hide all scenes
        document.querySelectorAll('.fs-scene').forEach(s => s.classList.remove('active'));
        // Show target scene
        const scene = document.getElementById(`fs-scene-${feature}`);
        if (scene) scene.classList.add('active');

        // Update info panel
        const d = featureData[feature];
        if (!d) return;
        if (fsTag) fsTag.textContent = d.tag;
        if (fsTitle) fsTitle.textContent = d.title;
        if (fsDesc) fsDesc.textContent = d.desc;
        if (fsBullets) {
            fsBullets.innerHTML = d.bullets.map(b => `<li>${b}</li>`).join('');
        }
        if (fsCtaBtn) {
            fsCtaBtn.dataset.service = d.service;
        }

        // Run feature-specific animations
        if (feature === 'ia') runIAAnimation();
        if (feature === 'boas-vindas') runBVAnimation();
        if (feature === 'logs') runLogsAnimation();
    }

    fsPills.forEach(pill => {
        pill.addEventListener('click', () => {
            fsPills.forEach(p => p.classList.remove('active'));
            pill.classList.add('active');
            switchFeature(pill.dataset.feature);
        });
    });

    // IA typewriter animation
    function runIAAnimation() {
        const el = document.getElementById('ia-response-text');
        const latEl = document.getElementById('ia-latency');
        if (!el) return;
        el.textContent = '';
        const response = 'Olá! Posso te ajudar com informações sobre os serviços do servidor — planos, preços e como contratar. Para outras dúvidas, entre em contato com a equipe!';
        const latency = Math.floor(Math.random() * 200) + 180;
        if (latEl) latEl.textContent = latency;
        let i = 0;
        const type = () => {
            if (i < response.length) {
                el.textContent += response[i++];
                setTimeout(type, 22);
            }
        };
        setTimeout(type, 600);
    }

    // Boas-vindas counter animation
    function runBVAnimation() {
        const countEl = document.getElementById('bv-count');
        if (!countEl) return;
        let n = 0;
        const target = Math.floor(Math.random() * 400) + 800;
        const step = Math.ceil(target / 40);
        const t = setInterval(() => {
            n = Math.min(n + step, target);
            countEl.textContent = n.toLocaleString('pt-BR');
            if (n >= target) clearInterval(t);
        }, 20);
    }

    // Logs live timestamp
    function runLogsAnimation() {
        const el = document.getElementById('logs-live-time');
        if (!el) return;
        const now = new Date();
        el.textContent = `${String(now.getHours()).padStart(2,'0')}:${String(now.getMinutes()).padStart(2,'0')}`;
    }

    // Init anti-raid on load
    switchFeature('antiraid');

    /* ==========================================
       11. Mouse-tracking 3D tilt for Bot Showcase
       ========================================== */
    const tiltArea = document.querySelector('.bot-tilt-area');
    const tiltInner = document.querySelector('.bot-tilt-inner');

    if (tiltArea && tiltInner) {
        const maxTilt = 12; // max degrees of rotation

        tiltArea.addEventListener('mousemove', (e) => {
            const rect = tiltArea.getBoundingClientRect();
            const x = (e.clientX - rect.left) / rect.width;  // 0 to 1
            const y = (e.clientY - rect.top) / rect.height;   // 0 to 1

            const rotateY = (x - 0.5) * maxTilt * 2;  // -maxTilt to +maxTilt
            const rotateX = (0.5 - y) * maxTilt * 2;   // inverted for natural feel

            tiltInner.style.transform = `perspective(900px) rotateX(${rotateX}deg) rotateY(${rotateY}deg)`;
        });

        tiltArea.addEventListener('mouseleave', () => {
            tiltInner.style.transform = 'perspective(900px) rotateX(0deg) rotateY(0deg)';
        });
    }

});
