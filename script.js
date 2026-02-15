
    function replicarDadosCliente() {
      const campos = {
        nomeCompleto: document.getElementById('global_nomeCompleto').value.toUpperCase(),
        cpfCnpj: document.getElementById('global_cpfCnpj').value.toUpperCase(),
        endereco: document.getElementById('global_endereco').value.toUpperCase(),
        bairro: document.getElementById('global_bairro').value.toUpperCase(),
        cep: document.getElementById('global_cep').value.toUpperCase(),
        cidade: document.getElementById('global_cidade').value.toUpperCase(),
        estado: document.getElementById('global_estado').value.toUpperCase()
      };

      // Mapeamento de campos globais para campos locais
      const mapa = {
        'acordo_nomeCompleto': campos.nomeCompleto, 'acordo_cpfCnpj': campos.cpfCnpj, 'acordo_endereco': campos.endereco, 'acordo_bairro': campos.bairro, 'acordo_cep': campos.cep, 'acordo_cidade': campos.cidade, 'acordo_estado': campos.estado,
        'rec_nomeCompleto': campos.nomeCompleto, 'rec_cpfCnpj': campos.cpfCnpj, 'rec_endereco': campos.endereco, 'rec_bairro': campos.bairro, 'rec_cidade': campos.cidade, 'rec_estado': campos.estado,
        'quit_nomeCompleto': campos.nomeCompleto, 'quit_cpfCnpj': campos.cpfCnpj, 'quit_cidade': campos.cidade,
        'res_nomeCompleto': campos.nomeCompleto, 'res_cpfCnpj': campos.cpfCnpj, 'res_endereco': campos.endereco, 'res_bairro': campos.bairro, 'res_cidade': campos.cidade, 'res_estado': campos.estado,
        'dep_nomeCompleto': campos.nomeCompleto, 'dep_cpfCnpj': campos.cpfCnpj, 'dep_cidade': campos.cidade,
        'inst_nomeCompleto': campos.nomeCompleto, 'inst_cpfCnpj': campos.cpfCnpj, 'inst_cidade': campos.cidade,
        'orc_proprietario': campos.nomeCompleto, 'orc_cpfCnpj': campos.cpfCnpj
      };

      for (let id in mapa) {
        const el = document.getElementById(id);
        if (el) el.value = mapa[id];
      }
    }

    /* =========================
       UI CONTROLS & STATE
       ========================= */
    const root = document.documentElement;
    const shell = document.getElementById("shell");
    const pageTitle = document.getElementById("pageTitle");
    const pageSubtitle = document.getElementById("page subtitle");
    // Sidebar
    const LS_SIDEBAR = "central_sidebar_collapsed";

    const savedCollapsed = localStorage.getItem(LS_SIDEBAR);
    if (savedCollapsed === "1") shell.classList.add("collapsed");

    document.getElementById("btnSidebar").addEventListener("click", () => {
      if (window.innerWidth <= 900) {
        shell.classList.toggle("mobile-open");
      } else {
        shell.classList.toggle("collapsed");
        localStorage.setItem(LS_SIDEBAR, shell.classList.contains("collapsed") ? "1" : "0");
      }
    });

    document.getElementById("sidebar-overlay").addEventListener("click", () => {
      shell.classList.remove("mobile-open");
    });

    /* =========================
       SUBTITLES MAP
       ========================= */
    const subtitles = {
      "gerador": "clique nos links abaixo para confeccionar o documento desejado, os dados do cliente você não precisa preencher em todos os documentos, apenas uma vez",
      "": "",
      "bancos": "clique nos botões abaixo para acessar a financeira desejada",
      "certidoes": "clique nos botões abaixo para emitir a certidão desejada",
      "venda-direta": "",
      "plataformas": "",
      "cartas": "",
      "seminovos": "",
      "pos-vendas": "",
      "rh-dp": "",
      "lojas": "",
      "gestor": "clique nos botões abaixo para acessar as ferramentas de apoio ao gestor",
      "acessorios": "clique nos botões abaixo para visualizar o catálogo desejado",
      "links": ""
    };

    /* =========================
        (alternarSecao)
       ========================= */
    function alternarSecao(secao) {
      // 1. Esconder tudo
      const secoes = ['secao-gerador', 'doc-calculadora', 'doc-contrato', 'doc-links', 'secao-bancos',
        'secao-certidoes', 'secao-venda-direta', 'secao-plataformas', 'secao-cartas',
        'secao-seminovos', 'secao-gestor', 'secao-pos-vendas', 'secao-rh-dp', 'secao-lojas', 'secao-acessorios', 'dados-cliente-global'];
      secoes.forEach(id => {
        const el = document.getElementById(id);
        if (el) el.classList.add('hidden');
      });

      // 2. Esconder documentos específicos e dados globais (limpar tela)
      const specificDocs = document.querySelectorAll('#docArea .doc-card, #dados-cliente-global');
      specificDocs.forEach(c => c.classList.add('hidden'));

      // 2. Atualizar Navegação (Sidebar)
      const navLinks = document.querySelectorAll('.nav a');
      navLinks.forEach(a => a.classList.remove('active'));

      const targetLink = document.getElementById('btn-' + secao);
      if (targetLink) targetLink.classList.add('active');

      // 3. Atualizar Títulos da Main
      if (pageTitle && targetLink) {
        pageTitle.textContent = targetLink.querySelector('span').textContent;
      }
      if (pageSubtitle) {
        pageSubtitle.textContent = subtitles[secao] || "";
      }

      // 4. Mostrar Seção Alvo
      if (secao === 'gerador') {
        document.getElementById('secao-gerador').classList.remove('hidden');
      } else if (secao === 'calculadora') {
        document.getElementById('doc-calculadora').classList.remove('hidden');
      } else if (secao === 'links') {
        document.getElementById('doc-links').classList.remove('hidden');
      } else {
        const el = document.getElementById('secao-' + secao);
        if (el) el.classList.remove('hidden');
      }

      window.scrollTo({ top: 0, behavior: 'smooth' });

      // Fechar menu mobile se estiver aberto
      shell.classList.remove("mobile-open");

      // Reset de busca ao trocar de seção
      if (typeof filterContent === 'function') {
        const searchContainer = document.getElementById('searchContainer');
        const btnSearch = document.getElementById('btnSearch');
        const globalSearchInput = document.getElementById('globalSearchInput');

        if (searchContainer && searchContainer.classList.contains('active')) {
          searchContainer.classList.remove('active');
          btnSearch.classList.remove('search-active');
          globalSearchInput.value = '';
          filterContent('');
        }
      }
    }

    /* =========================
        BUSCA / FILTRO
       ========================= */
    const btnSearch = document.getElementById('btnSearch');
    const searchContainer = document.getElementById('searchContainer');
    const globalSearchInput = document.getElementById('globalSearchInput');

    if (btnSearch && searchContainer && globalSearchInput) {
      btnSearch.addEventListener('click', () => {
        searchContainer.classList.toggle('active');
        btnSearch.classList.toggle('search-active');
        if (searchContainer.classList.contains('active')) {
          globalSearchInput.focus();
        } else {
          globalSearchInput.value = '';
          filterContent('');
        }
      });

      globalSearchInput.addEventListener('input', (e) => {
        filterContent(e.target.value);
      });
    }

    function removeAcentos(str) {
      if (!str) return '';
      return str.normalize('NFD').replace(/[\u0300-\u036f]/g, "");
    }

    function filterContent(query) {
      const q = removeAcentos(query.toLowerCase().trim());

      // Se a busca estiver vazia, volta para o estado normal (apenas a seção ativa)
      if (q === '') {
        const activeLink = document.querySelector('.nav a.active');
        if (activeLink) {
          const secaoId = activeLink.getAttribute('onclick').match(/'([^']+)'/)[1];
          alternarSecao(secaoId);
        }
        return;
      }

      // 1. Mostrar todos os contêineres que podem ter resultados
      const containers = document.querySelectorAll('.cover, .doc-card, .link-section, .grid-tiles');
      containers.forEach(c => c.classList.remove('hidden'));

      // 2. Ocultar todos os botões de ação e links secundários que NÃO são alvos de pesquisa
      const actionBtns = document.querySelectorAll('.btn, .card, .link-section a');
      actionBtns.forEach(item => {
        if (!item.classList.contains('cover-btn')) {
          item.style.display = "none";
          item.classList.add('hidden-by-search');
        }
      });

      // 3. Filtrar apenas botões de navegação (Sidebar e Submenus)
      const targets = document.querySelectorAll('.nav a, .cover-btn');
      let foundAny = false;

      targets.forEach(item => {
        const text = removeAcentos(item.innerText.toLowerCase());
        if (text.includes(q)) {
          item.style.display = "";
          item.classList.remove('hidden-by-search');
          foundAny = true;

          // Se for um botão de documento dentro do gerador, garantir que os dados do cliente apareçam (mas vazios/ocultos se não clicar)
          if (item.closest('#secao-gerador')) {
            // Não mostramos o formulário completo, apenas o card de botões da seção
            document.getElementById('secao-gerador').classList.remove('hidden');
          }
        } else {
          item.style.display = "none";
          item.classList.add('hidden-by-search');
        }
      });

      // 4. Esconder seções/cards que não têm nenhum botão de NAVEGAÇÃO visível
      const parents = document.querySelectorAll('.cover, .doc-card:not(#dados-cliente-global), .link-section');
      parents.forEach(p => {
        // Verifica se existe algum botão de navegaçao visível (.nav a ou .cover-btn)
        const hasVisibleNav = p.querySelector('.nav a:not([style*="display: none"]), .cover-btn:not([style*="display: none"])');

        if (!hasVisibleNav) {
          p.classList.add('hidden');
        } else {
          p.classList.remove('hidden');
        }
      });

      // 5. Garantir que o card de dados globais só apareça se estivermos no gerador e houver resultados lá
      const geradorTemResultado = document.querySelector('#secao-gerador:not(.hidden)');
      if (!geradorTemResultado) {
        document.getElementById('dados-cliente-global').classList.add('hidden');
      }
    }


    /* =========================
       FAVORITOS (Placeholder)
       ========================= */


    async function copiarLink(url) {
      try {
        await navigator.clipboard.writeText(url);
        showToast('Link copiado para o WhatsApp!', 'success');
      } catch (err) {
        showToast('Erro ao copiar link.', 'error');
      }
    }

    function abrirDocumento(docId) {
      // 1. Remove classe ACTIVE de todos os botões da capa
      const coverBtns = document.querySelectorAll('.cover-btn');
      coverBtns.forEach(btn => btn.classList.remove('active'));

      // 2. Adiciona classe ACTIVE no botão correspondente
      const btnIdMap = {
        'doc-recebimento': 'btn-doc-recebimento',
        'doc-acordo': 'btn-doc-acordo',
        'doc-instrumento': 'btn-doc-instrumento',
        'doc-quitacao': 'btn-doc-quitacao',
        'doc-residencia': 'btn-doc-residencia',
        'doc-deposito': 'btn-doc-deposito',
        'doc-orcamento': 'btn-doc-orcamento',
        'doc-contrato': 'btn-doc-contrato'
      };

      if (btnIdMap[docId]) {
        const btn = document.getElementById(btnIdMap[docId]);
        if (btn) btn.classList.add('active');
      }

      // Esconder apenas os cards de documentos
      // Esconder apenas os cards de documentos (formulários e dados globais)
      // Mas NÃO esconder o card que contém os botões de seleção no topo
      const cards = document.querySelectorAll('.doc-card');
      cards.forEach(c => {
        // Se o card não tiver ID (é o card de botões) ou for calculadora/links, não esconde
        if (c.id && c.id !== 'doc-calculadora' && c.id !== 'doc-links') {
          c.classList.add('hidden');
        }
      });

      const el = document.getElementById(docId);
      if (el) {
        el.classList.remove('hidden');
        // Mostrar dados do cliente se for um documento do gerador
        const geradorDocs = ['doc-recebimento', 'doc-acordo', 'doc-instrumento', 'doc-quitacao', 'doc-residencia', 'doc-deposito', 'doc-orcamento'];
        if (geradorDocs.includes(docId)) {
          document.getElementById('dados-cliente-global').classList.remove('hidden');
          document.getElementById('dados-cliente-global').style.marginTop = "30px";
        }

        // Scroll suave para o início do formulário, mantendo um pouco dos botões visíveis
        const topOffset = el.getBoundingClientRect().top + window.pageYOffset - 150;
        window.scrollTo({ top: topOffset, behavior: 'smooth' });

        // No mobile, fechar o menu ao abrir um documento (caso tenha sido navegação via busca ou atalho)
        shell.classList.remove("mobile-open");
      }

      // Se abrir o card de contrato, inicializar com o texto tradicional
      if (docId === 'doc-contrato') {
        selecionarModalidade('tradicional');
      }
    }

    /* =========================
       TEXTO CONTRATUAL
       ========================= */
    const textoOutlet = `Declaro estar ciente de que o veículo adquirido se encontra enquadrado na Modalidade de Venda OUTLET, a qual se caracteriza por condições comerciais diferenciadas com o veículo podendo incluir características estéticas visíveis nas peças de lataria e pneus, desgaste natural compatível com o tempo de uso e demais particularidades previamente informadas e disponíveis para vistoria.

Em razão da natureza desta modalidade de venda OUTLET, declaro estar ciente que a garantia aplicável ao veículo objeto deste contrato será restrita única e exclusivamente aos componentes de MOTOR e CAIXA DE CÂMBIO, pelo prazo legal de 90 (noventa) dias, conforme previsto no artigo 26, inciso II, do Código de Defesa do Consumidor.

Declaro estar ciente que nenhuma outra garantia está inclusa, sendo excluída qualquer cobertura relativa a itens de desgaste natural, peças elétricas, eletrônicas, suspensão, freios, lataria, pintura, sistemas de entretenimento, acessórios, vibrações, avarias decorrentes de uso inadequado ou qualquer outro componente que não seja relacionado a motor e caixa de câmbio.

Declaro que tive oportunidade de vistoriar o veículo antes da compra e que concordo com as condições descritas acima referente a modalidade de venda OUTLET.`;

    const textoTradicional = `O Código de Defesa do Consumidor, em seu artigo 26, inciso II, estabelece que o consumidor tem direito a 90 dias de garantia na compra de um veículo seminovo. A San Marino, por meio da campanha GARANTIA EM DOBRO, oferece a você, nosso cliente, 90 dias adicionais, totalizando 180 dias de garantia para o veículo objeto deste contrato. Esta garantia estendida, do dia 91 até o dia 180, abrange única e exclusivamente defeitos no motor e na caixa de câmbio.`;

    function selecionarModalidade(modalidade) {
      const tabTradicional = document.getElementById('tab-tradicional');
      const tabOutlet = document.getElementById('tab-outlet');
      const textarea = document.getElementById('texto-contratual');

      if (modalidade === 'tradicional') {
        tabTradicional.classList.add('active');
        tabOutlet.classList.remove('active');
        textarea.value = textoTradicional;
      } else {
        tabOutlet.classList.add('active');
        tabTradicional.classList.remove('active');
        textarea.value = textoOutlet;
      }
    }

    async function copiarTextoContratual() {
      const textarea = document.getElementById('texto-contratual');
      try {
        await navigator.clipboard.writeText(textarea.value);
        showToast('Texto copiado com sucesso!', 'success');
      } catch (err) {
        showToast('Erro ao copiar texto. Tente novamente.', 'error');
      }
    }

    /* =========================
       UI
       ========================= */
    // Toast Notification System
    function showToast(message, type = 'success') {
      const container = document.getElementById('toast-container');
      if (!container) return;

      const toast = document.createElement('div');
      toast.className = `toast ${type}`;

      let icon = '';
      if (type === 'success') icon = '<i class="fa-solid fa-circle-check"></i>';
      else if (type === 'error') icon = '<i class="fa-solid fa-circle-exclamation"></i>';
      else if (type === 'info') icon = '<i class="fa-solid fa-circle-info"></i>';

      toast.innerHTML = `
        ${icon}
        <span style="flex: 1;">${message}</span>
        <i class="fa-solid fa-xmark" style="font-size: 14px; opacity: 0.5; cursor: pointer;"></i>
      `;

      container.appendChild(toast);

      const removeToast = () => {
        toast.classList.add('toast-exiting');
        setTimeout(() => toast.remove(), 400);
      };

      const autoRemove = setTimeout(removeToast, 5000);

      toast.onclick = () => {
        clearTimeout(autoRemove);
        removeToast();
      };
    }

    /* =========================
       Máscaras (DATA e HORA)
       ========================= */
    function applyDateMask(el) {
      if (!el) return;
      el.addEventListener('input', () => {
        let v = (el.value || '').replace(/\D/g, '').slice(0, 8); // ddmmyyyy
        if (v.length >= 5) {
          el.value = v.slice(0, 2) + '/' + v.slice(2, 4) + '/' + v.slice(4);
        } else if (v.length >= 3) {
          el.value = v.slice(0, 2) + '/' + v.slice(2);
        } else {
          el.value = v;
        }
      });
    }

    function applyTimeMask(el) {
      if (!el) return;
      el.addEventListener('input', () => {
        let v = (el.value || '').replace(/\D/g, '').slice(0, 4); // hhmm
        if (v.length >= 3) {
          el.value = v.slice(0, 2) + ':' + v.slice(2);
        } else {
          el.value = v;
        }
      });
    }


    /* =========================
       Máscara ANO/MODELO (AAAA/AAAA)
       ========================= */
    function applyAnoModeloMask(el) {
      if (!el) return;
      el.addEventListener('input', () => {
        // Mantém somente números e limita em 8 dígitos (AAAAMMMM)
        let v = (el.value || '').replace(/\D/g, '').slice(0, 8);

        // Insere a barra após o 4º dígito
        if (v.length >= 5) {
          el.value = v.slice(0, 4) + '/' + v.slice(4);
        } else {
          el.value = v;
        }
      });
    }

    /* =========================
       Formatação moeda BRL
       ========================= */
    function normalizeToAscii(str) {
      if (!str) return '';
      return str.normalize('NFD').replace(/[\u0300-\u036f]/g, '');
    }

    function parseCurrencyToNumberBR(value) {
      const v = (value || '').toString().trim();
      if (!v) return NaN;

      let s = v.replace(/R\$\s?/gi, '').replace(/\s/g, '');
      s = s.replace(/\./g, '').replace(',', '.');
      const n = Number(s);
      return Number.isFinite(n) ? n : NaN;
    }

    function formatBRL(n) {
      if (!Number.isFinite(n)) return '';
      const formatted = new Intl.NumberFormat('pt-BR', { style: 'currency', currency: 'BRL' }).format(n);
      return formatted.replace(/\u00A0/g, ' ');
    }

    function attachCurrencyBehavior(el) {
      if (!el) return;
      el.addEventListener('blur', () => {
        const value = el.innerText !== undefined ? el.innerText : el.value;
        const n = parseCurrencyToNumberBR(value);
        if (Number.isFinite(n)) {
          const formatted = formatBRL(n);
          if (el.innerText !== undefined) el.innerText = formatted;
          else el.value = formatted;
        }
      });
    }

    /* =========================
       Helpers de dados
       ========================= */
    function formatarAnoModelo(s) {
      if (!s) return s;
      if (!s.includes('/')) return s;
      const [a1, a2] = s.split('/');
      return (a1.trim().length === 2 ? '20' + a1.trim() : a1.trim()) + '/' + (a2.trim().length === 2 ? '20' + a2.trim() : a2.trim());
    }

    function upperOr(v, fallback) {
      const t = (v || '').trim();
      return t ? t.toUpperCase() : (fallback || '');
    }

    function sanitizeForFilename(str) {
      const s = normalizeToAscii((str || '').trim()).toUpperCase();
      const cleaned = s.replace(/[^A-Z0-9]+/g, '_').replace(/_+/g, '_').replace(/^_+|_+$/g, '');
      return cleaned || 'SEM_DADO';
    }

    function nomeCurtoParaArquivo(nomeCompleto) {
      const n = normalizeToAscii((nomeCompleto || '').trim());
      if (!n) return 'CLIENTE';
      const parts = n.split(/\s+/).filter(Boolean);
      if (parts.length === 1) return parts[0];
      return parts[0] + '_' + parts[parts.length - 1];
    }

    function buildFilename(prefix, placa, nomeCompleto) {
      const p = sanitizeForFilename(placa || 'SEM_PLACA');
      const n = sanitizeForFilename(nomeCurtoParaArquivo(nomeCompleto));
      const pre = sanitizeForFilename(prefix);
      return `${pre}_${p}_${n}.pdf`;
    }

    /* =========================
       Coleta de dados (INDIVIDUAL)
       ========================= */
    function obterDadosAcordo() {
      return {
        nomeCompleto: document.getElementById('acordo_nomeCompleto').value.trim(),
        cpfCnpj: document.getElementById('acordo_cpfCnpj').value.trim(),
        endereco: document.getElementById('acordo_endereco').value.trim(),
        bairro: document.getElementById('acordo_bairro').value.trim(),
        cep: document.getElementById('acordo_cep').value.trim(),
        cidade: document.getElementById('acordo_cidade').value.trim(),
        estado: document.getElementById('acordo_estado').value.trim(),

        modelo: document.getElementById('acordo_modelo').value.trim(),
        placa: document.getElementById('acordo_placa').value.trim(),
        anoModelo: document.getElementById('acordo_anoModelo').value.trim(),
        chassi: document.getElementById('acordo_chassi').value.trim(),
        renavam: document.getElementById('acordo_renavam').value.trim(),
        cor: document.getElementById('acordo_cor').value.trim()
      };
    }

    function obterDadosRecebimento() {
      return {
        nomeCompleto: document.getElementById('rec_nomeCompleto').value.trim(),
        cpfCnpj: document.getElementById('rec_cpfCnpj').value.trim(),
        endereco: document.getElementById('rec_endereco').value.trim(),
        bairro: document.getElementById('rec_bairro').value.trim(),
        cidade: document.getElementById('rec_cidade').value.trim(),
        estado: document.getElementById('rec_estado').value.trim(),

        modelo: document.getElementById('rec_modelo').value.trim(),
        placa: document.getElementById('rec_placa').value.trim(),
        anoModelo: document.getElementById('rec_anoModelo').value.trim(),
        chassi: document.getElementById('rec_chassi').value.trim(),
        cor: document.getElementById('rec_cor').value.trim()
      };
    }

    function obterDadosResidencia() {
      return {
        nomeCompleto: document.getElementById('res_nomeCompleto').value.trim(),
        cpfCnpj: document.getElementById('res_cpfCnpj').value.trim(),
        endereco: document.getElementById('res_endereco').value.trim(),
        bairro: document.getElementById('res_bairro').value.trim(),
        cidade: document.getElementById('res_cidade').value.trim(),
        estado: document.getElementById('res_estado').value.trim()
      };
    }

    function obterDadosDepositoTerceiros() {
      return {
        nomeCompleto: document.getElementById('dep_nomeCompleto').value.trim(),
        cpfCnpj: document.getElementById('dep_cpfCnpj').value.trim(),
        rg: (document.getElementById('dep_rg')?.value || '').trim(),

        valor: document.getElementById('dep_valor').value.trim(),
        valorExtenso: document.getElementById('dep_valorExtenso').value.trim(),
        dataDeposito: document.getElementById('dep_dataDeposito').value.trim(),

        banco: document.getElementById('dep_banco').value.trim(),
        agencia: document.getElementById('dep_agencia').value.trim(),
        conta: document.getElementById('dep_conta').value.trim(),

        chassiPlaca: document.getElementById('dep_chassiPlaca').value.trim(),
        faturadoNome: document.getElementById('dep_faturadoNome').value.trim(),
        faturadoCpfCnpj: document.getElementById('dep_faturadoCpfCnpj').value.trim(),

        cidade: document.getElementById('dep_cidade').value.trim(),
        dia: document.getElementById('dep_dia').value.trim(),
        mesExtenso: document.getElementById('dep_mesExtenso').value.trim(),
        ano: document.getElementById('dep_ano').value.trim()
      };
    }

    function obterDadosInstrumento() {
      return {
        nomeCompleto: document.getElementById('inst_nomeCompleto').value.trim(),
        cpfCnpj: document.getElementById('inst_cpfCnpj').value.trim(),
        cidade: document.getElementById('inst_cidade').value.trim(),
        placa: document.getElementById('inst_placa').value.trim(),

        modelo: document.getElementById('inst_modelo').value.trim(),
        chassi: document.getElementById('inst_chassi').value.trim(),

        dataEntrega: document.getElementById('inst_dataEntrega').value.trim(),
        horaEntrega: document.getElementById('inst_horaEntrega').value.trim()
      };
    }

    function obterDadosQuitacao() {
      return {
        nomeCompleto: document.getElementById('quit_nomeCompleto').value.trim(),
        cpfCnpj: document.getElementById('quit_cpfCnpj').value.trim(),
        cidade: document.getElementById('quit_cidade').value.trim(),

        modelo: document.getElementById('quit_modelo').value.trim(),
        anoModelo: document.getElementById('quit_anoModelo').value.trim(),
        placa: document.getElementById('quit_placa').value.trim(),
        chassi: document.getElementById('quit_chassi').value.trim(),
        cor: document.getElementById('quit_cor').value.trim(),

        cedenteNome: document.getElementById('quit_cedenteNome').value.trim(),
        cedenteCpfCnpj: document.getElementById('quit_cedenteCpfCnpj').value.trim(),
        cedenteEndereco: document.getElementById('quit_cedenteEndereco').value.trim(),
        cedenteNumero: document.getElementById('quit_cedenteNumero').value.trim(),

        veiculoAdquiridoModelo: document.getElementById('quit_veiculoAdquiridoModelo').value.trim(),
        veiculoAdquiridoAnoModelo: document.getElementById('quit_veiculoAdquiridoAnoModelo').value.trim(),
        veiculoAdquiridoCor: document.getElementById('quit_veiculoAdquiridoCor').value.trim(),
        veiculoAdquiridoChassi: document.getElementById('quit_veiculoAdquiridoChassi').value.trim(),
        contratoNumero: document.getElementById('quit_contratoNumero').value.trim(),
        valorQuitacao: document.getElementById('quit_valorQuitacao').value.trim()
      };
    }

    /* =========================
       Padronização do PDF (A4)
       ========================= */
    const PDF_LAYOUT = {
      pageWidth: 210,
      pageHeight: 297,
      marginLeft: 25,
      marginRight: 25,
      marginTop: 65,
      marginBottom: 25,
      firstLineIndent: 10,
      paragraphGap: 6
    };

    // ==============================
    // Logomarca da San Marino
    //
    // Esta constante armazena a imagem da logo em formato
    // base64 (data URI). Ela é utilizada para adicionar a logo
    // no canto superior esquerdo de todos os PDFs gerados.
    // A imagem original foi redimensionada para reduzir o
    // tamanho do arquivo incorporado.
    const SAN_MARINO_LOGO = 'data:image/jpeg;base64,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';

    function createDocA4() {
      const { jsPDF } = window.jspdf;
      const doc = new jsPDF({ unit: 'mm', format: 'a4' });
      doc.setFont('times', 'normal');
      doc.setFontSize(12);
      doc.setLineHeightFactor(1.6);
      // Insere a logomarca da San Marino no canto superior esquerdo
      // Aumentado para 60mm de largura e 43mm de altura
      doc.addImage(SAN_MARINO_LOGO, 'JPEG', PDF_LAYOUT.marginLeft, 5, 60, 43);
      return doc;
    }

    function contentWidth() {
      return PDF_LAYOUT.pageWidth - PDF_LAYOUT.marginLeft - PDF_LAYOUT.marginRight;
    }

    function ensureSpace(doc, y, needed) {
      const bottomLimit = PDF_LAYOUT.pageHeight - PDF_LAYOUT.marginBottom;
      if (y + needed > bottomLimit) {
        doc.addPage();
        doc.setFont('times', 'normal');
        doc.setFontSize(12);
        doc.setLineHeightFactor(1.6);
        return PDF_LAYOUT.marginTop;
      }
      return y;
    }

    function addTitle(doc, title, subtitle, opts) {
      const options = opts || {};
      const titleSize = options.titleSize || 14;
      const subtitleSize = options.subtitleSize || 12;
      const gapAfter = options.gapAfter ?? 10;

      let y = PDF_LAYOUT.marginTop;
      const centerX = PDF_LAYOUT.pageWidth / 2;

      doc.setFont('times', 'bold');
      doc.setFontSize(titleSize);
      doc.text(String(title || '').toUpperCase(), centerX, y, { align: 'center' });
      y += 7;

      if (subtitle) {
        doc.setFontSize(subtitleSize);
        const sub = String(subtitle || '').toUpperCase();
        const lines = doc.splitTextToSize(sub, contentWidth());
        doc.text(lines, centerX, y, { align: 'center' });
        y += (lines.length * 6) + 4;
      } else {
        y += 6;
      }

      doc.setFont('times', 'normal');
      doc.setFontSize(12);
      doc.setLineHeightFactor(1.6);

      return y + gapAfter;
    }

    function addLocalDataLinha(doc, y, cidade) {
      y = ensureSpace(doc, y, 18);
      doc.setFont('times', 'normal');
      doc.setFontSize(12);
      doc.text(`${upperOr(cidade, '____________________')}, ____ de ____________________ de ________.`, PDF_LAYOUT.pageWidth / 2, y, { align: 'center' });
      return y + 15;
    }

    function addAssinaturaSimples(doc, y, label) {
      y = ensureSpace(doc, y, 28);
      const center = PDF_LAYOUT.pageWidth / 2;
      doc.line(center - 55, y, center + 55, y);
      y += 6;
      doc.setFont('times', 'normal');
      doc.setFontSize(10);
      doc.text(label || 'Assinatura', center, y, { align: 'center' });
      return y + 8;
    }

    function addAssinaturasDuplas(doc, y, leftLabel, rightLabel) {
      y = ensureSpace(doc, y, 35);
      doc.line(PDF_LAYOUT.marginLeft, y, PDF_LAYOUT.marginLeft + 70, y);
      doc.line(PDF_LAYOUT.pageWidth - PDF_LAYOUT.marginRight - 70, y, PDF_LAYOUT.pageWidth - PDF_LAYOUT.marginRight, y);
      y += 6;
      doc.setFont('times', 'normal');
      doc.setFontSize(10);
      doc.text(leftLabel || 'Assinatura', PDF_LAYOUT.marginLeft + 35, y, { align: 'center' });
      doc.text(rightLabel || 'Assinatura', PDF_LAYOUT.pageWidth - PDF_LAYOUT.marginRight - 35, y, { align: 'center' });
      return y + 10;
    }

    /* =========================
       Texto justificado (normal)
       ========================= */
    function drawJustifiedParagraph(doc, text, x, y, maxWidth, indentFirstLineMm) {
      const raw = (text || '').replace(/\s+/g, ' ').trim();
      if (!raw) return y;

      const indent = Math.max(0, indentFirstLineMm || 0);

      const words = raw.split(' ').filter(Boolean).map(t => ({ text: t }));
      const baseSpaceWidth = doc.getTextWidth(' ');
      const lineHeight = doc.getTextDimensions('Mg').h * doc.getLineHeightFactor();

      function buildLines(targetWidthFirst, targetWidthOther) {
        const lines = [];
        let current = [];
        let isFirstLine = true;

        function lineWidth(ws) {
          let total = 0;
          for (let i = 0; i < ws.length; i++) {
            total += doc.getTextWidth(ws[i].text);
            if (i < ws.length - 1) total += baseSpaceWidth;
          }
          return total;
        }

        for (const w of words) {
          const targetW = isFirstLine ? targetWidthFirst : targetWidthOther;

          if (current.length === 0) {
            current.push(w);
            continue;
          }

          const tentative = current.concat([w]);
          const total = lineWidth(tentative);

          if (total > targetW) {
            lines.push({ words: current, isFirstLine });
            current = [w];
            isFirstLine = false;
          } else {
            current = tentative;
          }
        }
        if (current.length) lines.push({ words: current, isFirstLine });
        return lines;
      }

      const lines = buildLines(maxWidth - indent, maxWidth);

      for (let li = 0; li < lines.length; li++) {
        const { words: lineWords, isFirstLine } = lines[li];
        const isLastLine = (li === lines.length - 1);

        const targetW = isFirstLine ? (maxWidth - indent) : maxWidth;
        const startX = isFirstLine ? (x + indent) : x;

        let wordsOnlyWidth = 0;
        for (const w of lineWords) wordsOnlyWidth += doc.getTextWidth(w.text);

        const numSpaces = Math.max(0, lineWords.length - 1);

        let extraPerSpace = 0;
        if (!isLastLine && numSpaces > 0) {
          const baseLineWidth = wordsOnlyWidth + (numSpaces * baseSpaceWidth);
          const extra = targetW - baseLineWidth;
          extraPerSpace = extra > 0 ? (extra / numSpaces) : 0;
        }

        let cx = startX;
        for (let wi = 0; wi < lineWords.length; wi++) {
          const w = lineWords[wi];
          doc.text(w.text, cx, y);
          cx += doc.getTextWidth(w.text);
          if (wi < lineWords.length - 1) cx += baseSpaceWidth + extraPerSpace;
        }

        y += lineHeight;
        y = ensureSpace(doc, y, lineHeight + 2);
      }

      return y;
    }

    /* =========================
       Texto justificado com negrito (segmentos)
       ========================= */
    function desenharParagrafoJustificadoComNegrito(doc, segments, x, y, maxWidth, indentFirstLineMm) {
      const indent = Math.max(0, indentFirstLineMm || 0);

      const words = [];
      for (const seg of segments) {
        const style = seg.style === 'bold' ? 'bold' : 'normal';
        const parts = (seg.text || '').trim().split(/\s+/).filter(Boolean);
        for (const p of parts) words.push({ text: p, style });
      }

      const baseSpaceWidth = doc.getTextWidth(' ');
      const lineHeight = doc.getTextDimensions('Mg').h * doc.getLineHeightFactor();

      function wordWidth(w) {
        doc.setFont('times', w.style);
        return doc.getTextWidth(w.text);
      }

      function lineWidth(ws) {
        let total = 0;
        for (let i = 0; i < ws.length; i++) {
          total += ws[i]._w;
          if (i < ws.length - 1) total += baseSpaceWidth;
        }
        return total;
      }

      const lines = [];
      let current = [];
      let isFirstLine = true;

      for (const w of words) {
        const wW = wordWidth(w);
        const ww = { ...w, _w: wW };
        const targetW = isFirstLine ? (maxWidth - indent) : maxWidth;

        if (current.length === 0) {
          current.push(ww);
          continue;
        }

        const tentative = current.concat([ww]);
        const total = lineWidth(tentative);

        if (total > targetW) {
          lines.push({ words: current, isFirstLine });
          current = [ww];
          isFirstLine = false;
        } else {
          current = tentative;
        }
      }
      if (current.length) lines.push({ words: current, isFirstLine });

      for (let li = 0; li < lines.length; li++) {
        const { words: lineWords, isFirstLine } = lines[li];
        const isLastLine = (li === lines.length - 1);

        const targetW = isFirstLine ? (maxWidth - indent) : maxWidth;
        const startX = isFirstLine ? (x + indent) : x;

        let wordsOnlyWidth = 0;
        for (const w of lineWords) wordsOnlyWidth += w._w;

        const numSpaces = Math.max(0, lineWords.length - 1);

        let extraPerSpace = 0;
        if (!isLastLine && numSpaces > 0) {
          const baseLineWidth = wordsOnlyWidth + (numSpaces * baseSpaceWidth);
          const extra = targetW - baseLineWidth;
          extraPerSpace = extra > 0 ? (extra / numSpaces) : 0;
        }

        let cx = startX;
        for (let wi = 0; wi < lineWords.length; wi++) {
          const w = lineWords[wi];
          doc.setFont('times', w.style);
          doc.text(w.text, cx, y);
          cx += w._w;
          if (wi < lineWords.length - 1) cx += baseSpaceWidth + extraPerSpace;
        }

        doc.setFont('times', 'normal');

        y += lineHeight;
        y = ensureSpace(doc, y, lineHeight + 2);
      }

      return y;
    }

    /* =========================
       Documentos
       ========================= */
    function gerarProcuracaoAcordo() {
      const dados = obterDadosAcordo();

      if (!dados.nomeCompleto || !dados.cpfCnpj || !dados.placa) {
        showToast('Para a Procuração de Acordo, preencha pelo menos o nome completo, CPF/CNPJ e placa do veículo.', 'error');
        return;
      }

      if (dados.chassi && dados.chassi.length !== 17) {
        validations['acordo_chassi']();
        showToast('O campo Chassi deve ter exatamente 17 caracteres.', 'error');
        return;
      }

      if (dados.renavam && dados.renavam.length !== 11) {
        validations['acordo_renavam']();
        showToast('O campo Renavam deve ter exatamente 11 caracteres.', 'error');
        return;
      }

      const doc = createDocA4();
      const x = PDF_LAYOUT.marginLeft;
      const w = contentWidth();

      let {
        nomeCompleto, cpfCnpj, endereco, bairro, cep, cidade, estado,
        modelo, placa, anoModelo, chassi, renavam, cor
      } = dados;

      anoModelo = formatarAnoModelo(anoModelo);

      let y = addTitle(doc, 'Procuração', null);

      // Ajuste para caber em uma página: fonte 11 e espaçamento menor entre linhas
      doc.setFontSize(11);
      doc.setLineHeightFactor(1.35);

      const p1 = `Por este instrumento particular de procuração, ${upperOr(nomeCompleto, '')}, CPF/CNPJ: ${cpfCnpj}, ENDEREÇO: ${upperOr(endereco, 'NÃO INFORMADO')}, BAIRRO: ${upperOr(bairro, 'NÃO INFORMADO')}, CEP: ${cep || 'NÃO INFORMADO'}, CIDADE: ${upperOr(cidade, 'NÃO INFORMADO')}, ESTADO: ${upperOr(estado, 'NÃO INFORMADO')}.`;
      y = drawJustifiedParagraph(doc, p1, x, y, w, PDF_LAYOUT.firstLineIndent);
      y += PDF_LAYOUT.paragraphGap;

      const segmentosT2 = [
        { style: 'normal', text: 'Dados pelos quais responsabilizo-me civil e criminalmente, nomeio e constituo meu bastante procurador:' },
        { style: 'bold', text: 'Rafael Pickrodt de Castro' },
        { style: 'normal', text: ', portador do CPF: 030.571.800-27 e RG: 2090921905, domiciliado na Rua Alexio Fagherazzi Nº37, na cidade de Porto Alegre; e/ou' },
        { style: 'bold', text: 'Ramiro Ilha' },
        { style: 'normal', text: ', portador do CPF: 375.722.450-72 e RG: 9021949971, domiciliado na Rua Dr. Voltaire Pires, 430 / 1, na cidade de Porto Alegre; e/ou' },
        { style: 'bold', text: 'Alessandra de Souza Santos' },
        { style: 'normal', text: ', portadora do CPF: 971.624.000-78 e RG: 1077846771, domiciliada na Rua Eloema de Oliveira Barcelos, 446, na cidade de Porto Alegre; para os fins específicos de “assinar a GRT – Guia de Responsabilidade Técnica” e também o “de acordo” na compra do veículo descrito abaixo, bem como assinar outros requerimentos, junto ao DETRAN/RS, com a finalidade de proceder com a realização de emplacamento/transferência do veículo objeto deste documento:' }
      ];

      y = ensureSpace(doc, y, 12);
      y = desenharParagrafoJustificadoComNegrito(doc, segmentosT2, x, y, w, PDF_LAYOUT.firstLineIndent);
      y += PDF_LAYOUT.paragraphGap + 2;

      y = ensureSpace(doc, y, 50);
      doc.setFont('times', 'bold');
      doc.text(`MODELO DO VEÍCULO: ${upperOr(modelo, 'NÃO INFORMADO')}`, x, y); y += 6;
      doc.text(`PLACA: ${upperOr(placa, 'SEM PLACA')}`, x, y); y += 6;
      doc.text(`ANO/MODELO: ${anoModelo || 'NÃO INFORMADO'}`, x, y); y += 6;
      doc.text(`CHASSI: ${upperOr(chassi, 'NÃO INFORMADO')}`, x, y); y += 6;
      doc.text(`RENAVAM: ${renavam || 'NÃO INFORMADO'}`, x, y); y += 6;
      doc.text(`COR: ${upperOr(cor, 'NÃO INFORMADO')}`, x, y); y += 25;
      doc.setFont('times', 'normal');

      y = addLocalDataLinha(doc, y, cidade);
      y = addAssinaturaSimples(doc, y, '(Assinatura reconhecida por autenticidade)');

      doc.save(buildFilename('PROCURACAO_ACORDO', placa, nomeCompleto));
      showToast('PDF da Procuração de Acordo gerado com sucesso!', 'success');
    }

    function gerarProcuracaoRecebimento() {
      const dados = obterDadosRecebimento();

      if (!dados.nomeCompleto || !dados.placa) {
        showToast('Para a Procuração de Recebimento, preencha pelo menos o nome do cliente e a placa do veículo.', 'error');
        return;
      }

      if (dados.chassi && dados.chassi.length !== 17) {
        validations['rec_chassi']();
        showToast('O campo Chassi deve ter exatamente 17 caracteres.', 'error');
        return;
      }

      // ======== FORMATAÇÃO (COPIADA DO ANTIGO) PARA CABER EM 1 PÁGINA ========
      const doc = createDocA4();

      let {
        nomeCompleto, cpfCnpj, endereco, bairro, cidade, estado,
        modelo, placa, anoModelo, chassi, cor
      } = dados;

      anoModelo = formatarAnoModelo(anoModelo);

      // Título
      doc.setFont('times', 'bold');
      doc.setFontSize(14);
      doc.text('PROCURAÇÃO DE RECEBIMENTO DO USADO', PDF_LAYOUT.pageWidth / 2, PDF_LAYOUT.marginTop - 15, { align: 'center' });

      // Corpo (compacto)
      doc.setFont('times', 'normal');
      doc.setFontSize(10);
      doc.setLineHeightFactor(1.3);

      const m = 20, w = 170;
      let y = PDF_LAYOUT.marginTop + 10;

      // Outorgante
      const outorgante = `Outorgante: ${upperOr(nomeCompleto, 'NÃO INFORMADO')} inscrito no CPF/CNPJ sob o nº ${cpfCnpj || 'NÃO INFORMADO'} com endereço: ${upperOr(endereco, 'NÃO INFORMADO')} Bairro: ${upperOr(bairro, 'NÃO INFORMADO')} na cidade de ${upperOr(cidade, 'NÃO INFORMADO')} Estado: ${upperOr(estado, 'NÃO INFORMADO')}.`;
      doc.text(outorgante, m, y, { maxWidth: w, align: 'justify' });
      y += doc.getTextDimensions(outorgante, { maxWidth: w }).h + 4;

      // Outorgado
      const outorgado = 'Outorgado: San Marino Veículos Ltda., situada na Av. Ipiranga, 7110, Bairro Jardim Botânico, na cidade Porto Alegre, Estado Rio Grande do Sul, inscrita no CNPJ sob n.º 90.446.618/0001-72 e inscrição estadual n.º 0960799613.';
      doc.text(outorgado, m, y, { maxWidth: w, align: 'justify' });
      y += doc.getTextDimensions(outorgado, { maxWidth: w }).h + 6;

      // Objeto
      doc.text('Objeto: O objeto desta procuração é o veículo abaixo descrito:', m, y);
      y += 9;

      // Dados do veículo
      doc.setFont('times', 'bold');
      doc.text(`MODELO DO VEÍCULO: ${upperOr(modelo, 'NÃO INFORMADO')}`, m, y); y += 6;
      doc.text(`PLACA: ${upperOr(placa, 'SEM PLACA')}`, m, y); y += 6;
      doc.text(`ANO/MODELO: ${anoModelo || 'NÃO INFORMADO'}`, m, y); y += 6;
      doc.text(`CHASSI: ${upperOr(chassi, 'NÃO INFORMADO')}`, m, y); y += 6;
      doc.text(`COR: ${upperOr(cor, 'NÃO INFORMADO')}`, m, y); y += 10;

      doc.setFont('times', 'normal');

      // Poderes
      const poderes = 'Poderes: O Outorgante, nomeia e constitui seu procurador, o OUTORGADO, para o fim especial de:';
      doc.text(poderes, m, y, { maxWidth: w });
      y += doc.getTextDimensions(poderes, { maxWidth: w }).h + 6;

      const itens = [
        'a) permutar, vender sem prestar contas e a quem melhor interessar, fazer dação em pagamento, aceitar e instituir cláusulas seguidas das demais formalidades relativas a venda do veículo de propriedade do outorgante, acima descrito;',
        'b) receber valores, no todo ou em parcelas, dar e receber quitação, ceder e transigir, desistir, firmar acordo ou compromisso;',
        'c) requerer documentos e/ou informações perante repartições e registros públicos;',
        'd) efetuar qualquer espécie de procedimento ou de processo administrativo relativo ao veículo junto à Divisão de Trânsito;',
        'e) proceder a liquidação das despesas do mesmo no que se refere às multas, transferência de propriedade tanto para terceiro quanto em favor do outorgado;',
        'f) o outorgante, nos casos em que o veículo estiver pendente de quitação na modalidade de leasing junto a instituição financeira, concede os poderes especiais para o outorgado assinar e representa-lo como comprador perante a esta instituição financeira e ao Detran e, posteriormente, na qualidade de vendedor a quem ao outorgado interessar;',
        'g) solicitar e retirar segunda via de CRV e CRLV junto à Divisão de Trânsito;',
        'h) em relação as multas e/ou outras pendências que envolvam valores anteriores à data da venda do veículo para o outorgado, o outorgado resguarda-se o direito de efetuar os devidos pagamentos e proceder com a cobrança em relação ao outorgante, de forma administrativa e/ou judicial;',
        'i) para os atos posteriores e de interesse exclusivo do outorgado, o mesmo compromete-se a assumir todos os encargos daí decorrentes;',
        'j) por fim, o outorgado poderá praticar os atos, por mais especiais que sejam, que se façam necessários ou úteis ao fiel desempenho deste mandato.'
      ];

      // Itens (mais compactos, como no ANTIGO)
      doc.setFontSize(9);
      for (const item of itens) {
        doc.text(item, m, y, { maxWidth: w, align: 'justify' });
        y += doc.getTextDimensions(item, { maxWidth: w }).h + 2;
      }

      // Local/Data + assinatura (sem quebra de página)
      y += 8;
      doc.setFontSize(10);
      doc.text('CIDADE: ____________________, ESTADO: ____, ____ de __________ de ________.', PDF_LAYOUT.pageWidth / 2, y, { align: 'center' });
      y += 22;

      doc.line(70, y, 140, y);
      y += 5;
      doc.text('Outorgante', PDF_LAYOUT.pageWidth / 2, y, { align: 'center' });

      doc.save(buildFilename('PROCURACAO_RECEBIMENTO', placa, nomeCompleto));
      showToast('PDF da Procuração de Recebimento gerado com sucesso!', 'success');
    }

    function gerarDeclaracaoResidencia() {
      const dados = obterDadosResidencia();

      if (!dados.nomeCompleto || !dados.cpfCnpj || !dados.endereco) {
        showToast('Para a Declaração de Residência, preencha pelo menos o nome completo, CPF e endereço.', 'error');
        return;
      }

      const doc = createDocA4();
      const x = PDF_LAYOUT.marginLeft;
      const w = contentWidth();

      let { nomeCompleto, cpfCnpj, endereco, bairro, cidade, estado } = dados;

      let y = addTitle(doc, 'Declaração de Residência', null);

      const p1 = `Eu, ${upperOr(nomeCompleto, '')}, CPF: ${cpfCnpj}, declaro sob as penas da lei que resido à ${upperOr(endereco, '')}, Bairro: ${upperOr(bairro, 'NÃO INFORMADO')}, Cidade: ${upperOr(cidade, 'NÃO INFORMADO')}, Estado: ${upperOr(estado, 'NÃO INFORMADO')}.`;
      y = drawJustifiedParagraph(doc, p1, x, y, w, PDF_LAYOUT.firstLineIndent);
      y += PDF_LAYOUT.paragraphGap;

      const p2 = 'Declaro-me ainda, Civil e Criminalmente responsável pela veracidade da declaração prestada.';
      y = drawJustifiedParagraph(doc, p2, x, y, w, PDF_LAYOUT.firstLineIndent);
      y += 12;

      y = ensureSpace(doc, y, 18);
      doc.text(`${upperOr(cidade, '____________________')}, ______ DE ____________________ 20_______`, PDF_LAYOUT.pageWidth / 2, y, { align: 'center' });
      y += 20;

      y = addAssinaturaSimples(doc, y, 'Assinatura conforme documento apresentado');

      doc.save(buildFilename('DECLARACAO_RESIDENCIA', '', nomeCompleto));
      showToast('PDF da Declaração de Residência gerado com sucesso!', 'success');
    }

    function gerarDeclaracaoDepositoTerceiros() {
      const dados = obterDadosDepositoTerceiros();

      if (!dados.nomeCompleto || !dados.cpfCnpj || !dados.valor) {
        showToast('Para a Declaração de Depósito, preencha pelo menos: nome completo, CPF/CNPJ e valor do depósito.', 'error');
        return;
      }

      const doc = createDocA4();
      const x = PDF_LAYOUT.marginLeft;
      const w = contentWidth();

      const nomeCompleto = dados.nomeCompleto;
      const cpfCnpj = dados.cpfCnpj;
      // const rg = dados.rg || '_______________';

      const nValor = parseCurrencyToNumberBR(dados.valor);
      const valorFmt = Number.isFinite(nValor) ? formatBRL(nValor) : (dados.valor || '________________');
      const valorExt = dados.valorExtenso ? dados.valorExtenso : '________________';

      const banco = upperOr(dados.banco, 'ITAU');
      const agencia = dados.agencia || '0280';
      const conta = dados.conta || '00110-8';
      const dataDeposito = (dados.dataDeposito && dados.dataDeposito.includes('/')) ? dados.dataDeposito : (dados.dataDeposito || '____/____/________');

      const chassiPlaca = dados.chassiPlaca ? dados.chassiPlaca : '______________________________';
      const faturadoNome = dados.faturadoNome ? dados.faturadoNome : '______________________________________';
      const faturadoCpfCnpj = dados.faturadoCpfCnpj ? dados.faturadoCpfCnpj : '____________________________';

      const cidadeLinha = upperOr(dados.cidade, 'Porto Alegre');
      const diaLinha = dados.dia ? dados.dia : '_______';
      const mesLinha = dados.mesExtenso ? dados.mesExtenso : '________________________';
      const anoLinha = dados.ano ? dados.ano : '2025';

      let y = addTitle(doc, 'Declaração de Depósito', 'Para Terceiros');

      // Linha local/data (modelo do arquivo ODT)
      y = ensureSpace(doc, y, 12);
      doc.setFont('times', 'normal');
      doc.setFontSize(12);
      doc.text(`${cidadeLinha}, ${diaLinha} de ${mesLinha} de ${anoLinha}.`, x, y);
      y += 14;

      const texto = `Eu, ${upperOr(nomeCompleto, '')}, portador (a) do CPF/CNPJ.: ${cpfCnpj || '___________________'}, declaro que fiz um depósito no valor de ${valorFmt} (${valorExt}) na conta da San Marino Veículos Ltda no banco ${banco}, AGÊNCIA: ${agencia} CONTA CORRENTE: ${conta} em ${dataDeposito} para pagamento parcial ou total de um veículo chassi/placa.: ${chassiPlaca} que está sendo faturado em nome de ${faturadoNome}, CPF/CNPJ.: ${faturadoCpfCnpj}.`;

      y = drawJustifiedParagraph(doc, texto, x, y, w, PDF_LAYOUT.firstLineIndent);
      y += 18;

      y = addAssinaturaSimples(doc, y, 'Assinatura');

      // usa chassi/placa no nome do arquivo (se informado)
      const placaParaNome = dados.chassiPlaca || '';
      doc.save(buildFilename('DECLARACAO_DEPOSITO_TERCEIROS', placaParaNome, nomeCompleto));
      showToast('PDF da Declaração de Depósito para Terceiros gerado com sucesso!', 'success');
    }

    function gerarInstrumentoResponsabilidade() {
      const dados = obterDadosInstrumento();

      if (!dados.nomeCompleto || !dados.cpfCnpj || !dados.chassi || !dados.modelo) {
        showToast('Para o Instrumento de Responsabilidade, preencha pelo menos: nome, CPF/CNPJ, modelo e chassi do veículo.', 'error');
        return;
      }

      if (dados.chassi && dados.chassi.length !== 17) {
        validations['inst_chassi']();
        showToast('O campo Chassi deve ter exatamente 17 caracteres.', 'error');
        return;
      }

      const doc = createDocA4();
      const x = PDF_LAYOUT.marginLeft;
      const w = contentWidth();

      let { nomeCompleto, cpfCnpj, cidade, modelo, chassi, dataEntrega, horaEntrega, placa } = dados;

      let y = addTitle(doc, 'Instrumento Particular de Responsabilidade', 'Civil e Criminal por Entrega de Veículo');

      const dataTxt = (dataEntrega && dataEntrega.includes('/')) ? dataEntrega : (dataEntrega ? dataEntrega : '____________________');
      const horaTxt = (horaEntrega && horaEntrega.includes(':')) ? horaEntrega : (horaEntrega ? horaEntrega : '____________');

      const p1 = `Declaramos que o veículo ${upperOr(modelo, '')}, chassi ${upperOr(chassi, '')}, de propriedade de ${upperOr(nomeCompleto, '')}, CPF/CNPJ ${cpfCnpj || ''}, foi entregue a este estabelecimento em ${dataTxt}, às ${horaTxt}, ficando a San Marino Veículos Ltda. responsável civil e criminalmente por este veículo a contar desta data.`;
      y = drawJustifiedParagraph(doc, p1, x, y, w, PDF_LAYOUT.firstLineIndent);
      y += 18;

      // Adiciona a linha com cidade e espaços para data.
      y = addLocalDataLinha(doc, y, cidade);
      // Aumenta o espaçamento antes das assinaturas para que fiquem mais abaixo na folha.
      y += 15;
      // Desenha as duas linhas de assinatura (cliente e concessionária).
      y = addAssinaturasDuplas(doc, y, 'Assinatura do cliente', 'Assinatura da concessionária');

      doc.save(buildFilename('RESPONSABILIDADE_ENTREGA', placa, nomeCompleto));
      showToast('PDF do Instrumento de Responsabilidade gerado com sucesso!', 'success');
    }

    function gerarTermoQuitacaoTerceiro() {
      const dados = obterDadosQuitacao();

      if (!dados.nomeCompleto || !dados.cpfCnpj || !dados.modelo || !dados.placa || !dados.chassi) {
        showToast('Para o Termo de Quitação, preencha pelo menos: dados do cliente (nome/CPF) e do veículo entregue (modelo/placa/chassi).', 'error');
        return;
      }

      if (dados.chassi && dados.chassi.length !== 17) {
        validations['quit_chassi']();
        showToast('O campo Chassi deve ter exatamente 17 caracteres.', 'error');
        return;
      }

      if (dados.veiculoAdquiridoChassi && dados.veiculoAdquiridoChassi.length !== 17) {
        validations['quit_veiculoAdquiridoChassi']();
        showToast('O campo Chassi do veículo adquirido deve ter exatamente 17 caracteres.', 'error');
        return;
      }

      const doc = createDocA4();
      const x = PDF_LAYOUT.marginLeft;
      const w = contentWidth();

      let {
        nomeCompleto, cpfCnpj, cidade,
        modelo, anoModelo, placa, chassi, cor,
        cedenteNome, cedenteCpfCnpj, cedenteEndereco, cedenteNumero,
        veiculoAdquiridoModelo, veiculoAdquiridoAnoModelo, veiculoAdquiridoCor, veiculoAdquiridoChassi,
        contratoNumero, valorQuitacao
      } = dados;

      anoModelo = formatarAnoModelo(anoModelo);
      veiculoAdquiridoAnoModelo = formatarAnoModelo(veiculoAdquiridoAnoModelo);

      const cedNome = cedenteNome ? cedenteNome : '_______________________________________________';
      const cedCpf = cedenteCpfCnpj ? cedenteCpfCnpj : '___________________________';
      const cedEnd = cedenteEndereco ? cedenteEndereco : '______________________________________';
      const cedNum = cedenteNumero ? cedenteNumero : '__________';

      const vEntModelo = modelo ? modelo : '______________________________';
      const vEntAno = anoModelo ? anoModelo : '_________';
      const vEntPlaca = placa ? placa.toUpperCase() : '______';
      const vEntChassi = chassi ? chassi.toUpperCase() : '______________________________';
      const vEntCor = cor ? cor.toUpperCase() : '__________________';

      const vAdqModelo = veiculoAdquiridoModelo ? veiculoAdquiridoModelo : '______________________________';
      const vAdqAno = veiculoAdquiridoAnoModelo ? veiculoAdquiridoAnoModelo : '_________';
      const vAdqCor = veiculoAdquiridoCor ? veiculoAdquiridoCor.toUpperCase() : '________';
      const vAdqChassi = veiculoAdquiridoChassi ? veiculoAdquiridoChassi.toUpperCase() : '____________________________';
      const cNum = contratoNumero ? contratoNumero : '___________';

      const nValor = parseCurrencyToNumberBR(valorQuitacao);
      const valQuit = Number.isFinite(nValor) ? formatBRL(nValor) : '________________';

      const anuNome = nomeCompleto ? nomeCompleto : '_______________________________________________';
      const anuCpf = cpfCnpj ? cpfCnpj : '_____________________';
      const anuCidade = cidade ? cidade : '_______';

      let y = addTitle(
        doc,
        'Termo de Quitação',
        'Instrumento particular de quitação de entrega de veículo como parte de pagamento em negócio de terceiros'
      );

      const texto = `Eu, ${cedNome}, CPF/CNPJ ${cedCpf}, residente e domiciliado na Rua ${cedEnd}, nº ${cedNum}, declaro que o veículo ${vEntModelo}, ano/modelo ${vEntAno}, placa ${vEntPlaca}, chassi ${vEntChassi}, cor ${vEntCor}, está livre e desembaraçado de qualquer ônus e através deste instrumento, dou quitação total do pagamento pelo valor de ${valQuit}, que serve como entrada para aquisição do automóvel ${vAdqModelo}, ano/modelo ${vAdqAno}, cor ${vAdqCor}, chassi ${vAdqChassi}, contrato nº ${cNum}, feito na San Marino Veículos Ltda., em nome de ${anuNome}, CPF/CNPJ ${anuCpf}, residente e domiciliado em ${anuCidade}. Assim, declaro não ter mais nada a reconsiderar ou exigir na presente transação.`;

      y = drawJustifiedParagraph(doc, texto, x, y, w, PDF_LAYOUT.firstLineIndent);
      y += 16;

      y = ensureSpace(doc, y, 18);
      doc.text('Porto Alegre, ______ de ____________________ de ________.', PDF_LAYOUT.pageWidth / 2, y, { align: 'center' });
      y += 18;

      y = addAssinaturasDuplas(doc, y, '(Cedente do veículo)', '(Anuente – cliente conforme o Contrato)');

      y = ensureSpace(doc, y, 22);
      doc.setFontSize(10);
      doc.text('Nome: ____________________________', PDF_LAYOUT.marginLeft, y);
      doc.text('Nome: ____________________________', PDF_LAYOUT.pageWidth / 2 + 5, y);
      y += 7;
      doc.text('CPF: _____________________________', PDF_LAYOUT.marginLeft, y);
      doc.text('CPF: _____________________________', PDF_LAYOUT.pageWidth / 2 + 5, y);
      y += 14;

      // Espaçamento extra entre as assinaturas e a seção de testemunhas.
      y += 15;

      y = ensureSpace(doc, y, 26);
      doc.setFontSize(11);
      doc.text('Testemunhas:', PDF_LAYOUT.marginLeft, y);
      y += 9;
      doc.text('1) _______________________________', PDF_LAYOUT.marginLeft, y);
      y += 7;
      doc.text('2) _______________________________', PDF_LAYOUT.marginLeft, y);

      doc.save(buildFilename('TERMO_QUITACAO_TERCEIRO', placa, nomeCompleto));
      showToast('PDF do Termo de Quitação gerado com sucesso!', 'success');
    }

    /* =========================
       ORÇAMENTO DETRAN - Gerar PDF
       ========================= */
    async function gerarOrcamentoDetran() {
      const orcCard = document.getElementById('printable-orcamento');

      if (!orcCard) {
        showToast('Erro ao localizar o orçamento.', 'error');
        return;
      }

      try {


        // Importar html2canvas dinamicamente
        if (typeof html2canvas === 'undefined') {
          const script = document.createElement('script');
          script.src = 'https://cdnjs.cloudflare.com/ajax/libs/html2canvas/1.4.1/html2canvas.min.js';
          document.head.appendChild(script);
          await new Promise(resolve => script.onload = resolve);
        }

        // Capturar o elemento como imagem
        const canvas = await html2canvas(orcCard, {
          scale: 2,
          useCORS: true,
          logging: false,
          backgroundColor: '#ffffff'
        });

        // Criar PDF
        const { jsPDF } = window.jspdf;
        const pdf = new jsPDF('p', 'mm', 'a4');

        const imgData = canvas.toDataURL('image/png');
        const pdfWidth = pdf.internal.pageSize.getWidth();
        const pdfHeight = pdf.internal.pageSize.getHeight();

        // Calcular dimensões mantendo proporção
        const imgWidth = canvas.width;
        const imgHeight = canvas.height;
        const ratio = Math.min(pdfWidth / imgWidth, pdfHeight / imgHeight);

        const imgScaledWidth = imgWidth * ratio;
        const imgScaledHeight = imgHeight * ratio;

        // Centralizar na página
        const x = (pdfWidth - imgScaledWidth) / 2;
        const y = (pdfHeight - imgScaledHeight) / 2;

        pdf.addImage(imgData, 'PNG', x, y, imgScaledWidth, imgScaledHeight);

        // Obter dados para o nome do arquivo
        const proprietario = document.getElementById('orc_proprietario')?.value || 'CLIENTE';
        const placa = document.getElementById('orc_placa')?.value || '';

        pdf.save(buildFilename('ORCAMENTO_DETRAN', placa, proprietario));
        showToast('PDF do Orçamento Detran gerado com sucesso!', 'success');

      } catch (error) {
        console.error('Erro ao gerar PDF:', error);
        showToast('Erro ao gerar PDF. Tente novamente.', 'error');
      }
    }


    /* =========================
       Inicialização
       ========================= */

    /* =========================
       Validações de Chassi e Renavam
       ========================= */
    function setupFieldValidation(id, length) {
      const el = document.getElementById(id);
      const errorEl = document.getElementById('error-' + id);
      if (!el || !errorEl) return null;

      const validate = () => {
        const val = el.value.trim();
        if (val && val.length !== length) {
          el.classList.add('input-error');
          errorEl.style.display = 'block';
          return false;
        } else {
          el.classList.remove('input-error');
          errorEl.style.display = 'none';
          return true;
        }
      };

      el.addEventListener('input', validate);
      el.addEventListener('blur', validate);
      return validate;
    }

    const validations = {};

    window.addEventListener('DOMContentLoaded', () => {
      // Configurar validações individuais
      validations['acordo_chassi'] = setupFieldValidation('acordo_chassi', 17);
      validations['acordo_renavam'] = setupFieldValidation('acordo_renavam', 11);
      validations['rec_chassi'] = setupFieldValidation('rec_chassi', 17);
      validations['quit_chassi'] = setupFieldValidation('quit_chassi', 17);
      validations['quit_veiculoAdquiridoChassi'] = setupFieldValidation('quit_veiculoAdquiridoChassi', 17);
      validations['inst_chassi'] = setupFieldValidation('inst_chassi', 17);

      // Forçar maiúsculas em todos os campos de input
      document.body.addEventListener('input', function (e) {
        // Verifica se é input ou textarea
        if (e.target.tagName === 'INPUT' || e.target.tagName === 'TEXTAREA') {
          // Tenta aplicar uppercase
          const start = e.target.selectionStart;
          const end = e.target.selectionEnd;
          const original = e.target.value;
          const upper = original.toUpperCase();

          if (original !== upper) {
            e.target.value = upper;
            // Restaura cursor se suportado
            try {
              e.target.setSelectionRange(start, end);
            } catch (err) {
              // Alguns tipos de input nâo suportam selection (ex: number, email em alguns browsers), ignora
            }
          }
        }
      });

      // Ocultar seções de dados do cliente individuais que agora são globais
      const labelsToHide = ['Dados do Cliente', 'Dados do Cliente (Anuente)'];
      document.querySelectorAll('.section-title').forEach(el => {
        if (labelsToHide.includes(el.textContent.trim())) {
          el.style.display = 'none';
          if (el.nextElementSibling && el.nextElementSibling.classList.contains('form-grid')) {
            el.nextElementSibling.style.display = 'none';
          }
        }
      });

      applyDateMask(document.getElementById('inst_dataEntrega'));
      applyTimeMask(document.getElementById('inst_horaEntrega'));
      attachCurrencyBehavior(document.getElementById('quit_valorQuitacao'));
      applyDateMask(document.getElementById('dep_dataDeposito'));
      attachCurrencyBehavior(document.getElementById('dep_valor'));

      // Aplicar comportamento de moeda às células editáveis do orçamento
      document.querySelectorAll('.orc-price[contenteditable="true"]').forEach(cell => {
        attachCurrencyBehavior(cell);
      });
    });


    /* =========================
       Inicialização de máscaras
       ========================= */
    document.addEventListener('DOMContentLoaded', () => {
      // Datas/Horas já existentes
      applyDateMask(document.getElementById('inst_dataEntrega'));
      applyTimeMask(document.getElementById('inst_horaEntrega'));
      applyDateMask(document.getElementById('dep_dataDeposito'));

      // Ano/Modelo com barra automática
      applyAnoModeloMask(document.getElementById('acordo_anoModelo'));
      applyAnoModeloMask(document.getElementById('rec_anoModelo'));
      applyAnoModeloMask(document.getElementById('quit_anoModelo'));
      applyAnoModeloMask(document.getElementById('quit_veiculoAdquiridoAnoModelo'));
      applyAnoModeloMask(document.getElementById('dep_ano'));
      applyAnoModeloMask(document.getElementById('orc_anoModeloCor'));

      // Iniciar Orçamento
      setOrcamentoDate();
      updateOrcamentoTotal();
    });

    /* =========================
       Funções Orçamento Detran
       ========================= */
    function setOrcamentoDate() {
      const el = document.getElementById('orc_dataRecibo');
      if (!el) return;
      const today = new Date();
      const d = String(today.getDate()).padStart(2, '0');
      const m = String(today.getMonth() + 1).padStart(2, '0');
      const y = today.getFullYear();
      el.value = `${d}/${m}/${y}`;
    }

    function updateOrcamentoTotal() {
      const rows = document.querySelectorAll('#orc-body tr');
      let total = 0;
      rows.forEach(row => {
        const checkbox = row.querySelector('.orc-check');
        const priceCell = row.querySelector('.orc-price');
        // Pula a linha de desconto no loop inicial de soma (ela será subtraída depois)
        if (priceCell && priceCell.id === 'orc_desconto') return;

        if (!checkbox || checkbox.checked) {
          total += parseCurrencyToNumberBR(priceCell.innerText || priceCell.value || '0');
        }
      });

      // Subtrai o desconto
      const descontoEl = document.getElementById('orc_desconto');
      if (descontoEl) {
        const valorDesconto = parseCurrencyToNumberBR(descontoEl.innerText || descontoEl.value || '0');
        if (Number.isFinite(valorDesconto)) {
          total -= valorDesconto;
        }
      }

      const totalEl = document.getElementById('orc-total');
      if (totalEl) totalEl.innerText = formatBRL(total);
    }

    /* =========================
       CALCULADORA DE JUROS (Cartão) - Inicialização
       ========================= */
    document.addEventListener('DOMContentLoaded', () => {
      const calcBtnBanri = document.getElementById("calc_btnBanri");
      const calcBtnRede = document.getElementById("calc_btnRede");
      const calcEmptyState = document.getElementById("calc_emptyState");
      const calcContent = document.getElementById("calc_content");
      const calcTbody = document.getElementById("calc_tbody");
      const calcBaseInput = document.getElementById("calc_baseValue");

      // Se o card não existir (caso alguém remova), sai sem erro
      if (!calcBtnBanri || !calcBtnRede || !calcEmptyState || !calcContent || !calcTbody || !calcBaseInput) return;

      // Dados (iguais aos da planilha)
      const CALC_BANRI = [
        { label: "Débito", n: 1, taxa: 1.50, fator: 0.985 },
        { label: "1x / 30 dias", n: 1, taxa: 5.80, fator: 0.942 },
        { label: "2x", n: 2, taxa: 7.30, fator: 0.927 },
        { label: "3x", n: 3, taxa: 8.80, fator: 0.912 },
        { label: "4x", n: 4, taxa: 10.30, fator: 0.897 },
      ];

      const CALC_REDE = [
        { label: "1x", n: 1, taxa: 1.55, fator: 0.985 },
        { label: "2x", n: 2, taxa: 3.05, fator: 0.970 },
        { label: "3x", n: 3, taxa: 4.50, fator: 0.954 },
        { label: "4x", n: 4, taxa: 5.38, fator: 0.946 },
        { label: "5x", n: 5, taxa: 6.15, fator: 0.939 },
        { label: "6x", n: 6, taxa: 6.93, fator: 0.931 },
        { label: "7x", n: 7, taxa: 7.90, fator: 0.921 },
        { label: "8x", n: 8, taxa: 8.68, fator: 0.913 },
        { label: "9x", n: 9, taxa: 9.45, fator: 0.906 },
        { label: "10x", n: 10, taxa: 10.23, fator: 0.898 },
      ];

      // Helpers
      const calc_brl = new Intl.NumberFormat("pt-BR", { style: "currency", currency: "BRL" });
      const calc_pct = (v) => (v / 100).toLocaleString("pt-BR", { style: "percent", minimumFractionDigits: 2, maximumFractionDigits: 2 });
      const calc_fator3 = (v) => v.toLocaleString("pt-BR", { minimumFractionDigits: 3, maximumFractionDigits: 3 });

      function calc_parseBRL(str) {
        if (!str) return 0;
        const s = String(str).trim()
          .replace(/\s/g, "")
          .replace(/\./g, "")
          .replace(",", ".")
          .replace(/[^\d.]/g, "");
        const val = Number(s);
        return Number.isFinite(val) ? val : 0;
      }

      function calc_formatBRLInput(el) {
        const v = calc_parseBRL(el.value);
        if (!v) {
          el.value = "";
          return 0;
        }
        el.value = v.toLocaleString("pt-BR", { minimumFractionDigits: 2, maximumFractionDigits: 2 });
        return v;
      }

      function calc_valorCobrar(base, fator) {
        if (!base || !fator) return 0;
        return base / fator;
      }

      function calc_parcela(total, n) {
        if (!total || !n) return 0;
        return total / n;
      }

      let calcModo = null; // "BANRI" ou "REDE"

      function calc_currentData() {
        return calcModo === "BANRI" ? CALC_BANRI : (calcModo === "REDE" ? CALC_REDE : []);
      }

      function calc_render() {
        const base = calc_parseBRL(calcBaseInput.value);
        const data = calc_currentData();

        if (!calcModo) {
          calcTbody.innerHTML = "";
          return;
        }

        calcTbody.innerHTML = data.map(row => {
          const total = base ? calc_valorCobrar(base, row.fator) : 0;
          const parc = base ? calc_parcela(total, row.n) : 0;

          const totalTxt = base ? calc_brl.format(total) : "—";
          const parcTxt = base ? calc_brl.format(parc) : "—";

          return `
            <tr>
              <td>${row.label}</td>
              <td class="center calc-muted">${calc_pct(row.taxa)}</td>
              <td class="center calc-muted">${calc_fator3(row.fator)}</td>
              <td class="center"><span class="calc-money">${totalTxt}</span></td>
              <td class="center calc-highlight calc-sep">${row.n}x</td>
              <td class="center calc-highlight"><span class="calc-money">${parcTxt}</span></td>
            </tr>
          `;
        }).join("");
      }

      function calc_setModo(next) {
        calcModo = next;

        calcBtnBanri.classList.toggle("active", calcModo === "BANRI");
        calcBtnRede.classList.toggle("active", calcModo === "REDE");

        calcEmptyState.classList.toggle("hidden", !!calcModo);
        calcContent.classList.toggle("hidden", !calcModo);

        calc_render();
      }

      // Eventos
      calcBtnBanri.addEventListener("click", () => calc_setModo("BANRI"));
      calcBtnRede.addEventListener("click", () => calc_setModo("REDE"));

      calcBaseInput.addEventListener("input", () => calc_render());
      calcBaseInput.addEventListener("blur", () => { calc_formatBRLInput(calcBaseInput); calc_render(); });



      // Inicial: sem escolha
      calc_setModo(null);

      // Função Limpar
      window.calc_limpar = function () {
        calcBaseInput.value = "";
        calc_setModo(null);
      };

      // Inicializar na seção do Gerador de Documentos
      alternarSecao('gerador');

      // Contador de Visitas
      fetch('https://api.counterapi.dev/v1/albertomateus-sanmarino/visitas/up')
        .then(res => res.json())
        .then(data => {
          const el = document.getElementById('visits-count');
          if (el && data.count) el.innerText = data.count.toLocaleString('pt-BR');
        })
        .catch(() => {
          const el = document.getElementById('visits-count');
          if (el) el.innerText = '0';
        });
    });
