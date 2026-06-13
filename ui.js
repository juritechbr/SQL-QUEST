// ============================================================
// SQL QUEST — Interface do Jogo
// ============================================================

class SQLQuestUI {
  constructor() {
    this.telaAtual = 'mapa';
    this.faseAtual = null;
    this.missaoIdx = 0;
    this.dicaMostrada = false;
    this.tentativas = 0;
  }

  // ─── Renderizar telas ────────────────────────────────────
  mostrarMapa() {
    this.telaAtual = 'mapa';
    const app = document.getElementById('app');
    app.innerHTML = `
      <div class="tela-mapa">
        ${this.renderizarHeader()}
        <div class="mapa-titulo">
          <h2>🗺️ Mapa do Reino de Dataria</h2>
          <p>Complete as fases para desbloquear novos poderes SQL</p>
        </div>
        <div class="fases-grid">
          ${FASES.map(f => this.renderizarCartaoFase(f)).join('')}
        </div>
        ${this.renderizarRodape()}
      </div>
    `;
    this.bindMapaEventos();
  }

  renderizarHeader() {
    const p = engine.progresso;
    const xpInfo = engine.getXPProximoNivel();
    const pctNivel = Math.round(((xpInfo.atual - xpInfo.base) / (xpInfo.proximo - xpInfo.base)) * 100);
    return `
      <header class="game-header">
        <div class="header-logo">
          <span class="logo-icone">⚡</span>
          <span class="logo-texto">SQL Quest</span>
        </div>
        <div class="header-stats">
          <div class="stat-xp">
            <div class="stat-titulo">
              <span class="titulo-jogador">${p.titulo}</span>
              <span class="xp-valor">⭐ ${p.xp} XP</span>
            </div>
            <div class="xp-bar-bg">
              <div class="xp-bar-fill" style="width:${Math.min(pctNivel,100)}%"></div>
            </div>
          </div>
          <button class="btn-reset" onclick="ui.confirmarReset()" title="Reiniciar progresso">↺</button>
        </div>
      </header>
    `;
  }

  renderizarCartaoFase(fase) {
    const desbloqueada = engine.getFaseDesbloqueada(fase.id);
    const concluida = engine.getFaseConcluida(fase.id);
    const prog = engine.getProgressoFase(fase);
    const cls = concluida ? 'fase-card concluida' : desbloqueada ? 'fase-card desbloqueada' : 'fase-card bloqueada';

    if (!desbloqueada) {
      return `
        <div class="${cls}">
          <div class="fase-lock">🔒</div>
          <div class="fase-num">Fase ${fase.id}</div>
          <div class="fase-titulo-locked">${fase.titulo}</div>
          <p class="fase-dica-lock">Complete a fase anterior para desbloquear</p>
        </div>
      `;
    }

    return `
      <div class="${cls}" style="--fase-cor:${fase.cor}" data-fase="${fase.id}">
        <div class="fase-header">
          <span class="fase-icone">${fase.icone}</span>
          <div class="fase-info">
            <div class="fase-num">Fase ${fase.id}</div>
            <div class="fase-titulo">${fase.titulo}</div>
          </div>
          ${concluida ? '<span class="fase-badge-ok">✓</span>' : ''}
        </div>
        <p class="fase-desc">${fase.subtitulo}</p>
        <div class="fase-progresso">
          <div class="prog-bar-bg">
            <div class="prog-bar-fill" style="width:${prog.pct}%;background:${fase.cor}"></div>
          </div>
          <span class="prog-texto">${prog.completas}/${prog.total} missões</span>
        </div>
        <div class="fase-footer">
          <span class="fase-xp">+${fase.xp} XP</span>
          <button class="btn-jogar" onclick="ui.abrirFase(${fase.id})">
            ${concluida ? 'Revisar' : prog.completas > 0 ? 'Continuar →' : 'Começar →'}
          </button>
        </div>
      </div>
    `;
  }

  renderizarRodape() {
    const total = FASES.reduce((a, f) => a + f.missoes.length, 0);
    const completas = engine.progresso.missoesCompletas.length;
    return `
      <div class="rodape-progresso">
        <span>Progresso total: <strong>${completas}/${total}</strong> missões</span>
        <span>Nível ${engine.progresso.nivel} — ${engine.progresso.titulo}</span>
      </div>
    `;
  }

  bindMapaEventos() {}

  // ─── Tela de Fase ────────────────────────────────────────
  abrirFase(faseId) {
    this.faseAtual = FASES.find(f => f.id === faseId);
    // Encontrar primeira missão não concluída
    const idx = this.faseAtual.missoes.findIndex(m => !engine.getMissaoConcluida(m.id));
    this.missaoIdx = idx === -1 ? 0 : idx;
    this.mostrarMissao();
  }

  mostrarMissao() {
    this.telaAtual = 'missao';
    this.dicaMostrada = false;
    this.tentativas = 0;
    const missao = this.faseAtual.missoes[this.missaoIdx];
    const concluida = engine.getMissaoConcluida(missao.id);

    const app = document.getElementById('app');
    app.innerHTML = `
      <div class="tela-missao" style="--fase-cor:${this.faseAtual.cor}">
        ${this.renderizarHeaderMissao()}
        <div class="missao-corpo">
          <div class="missao-esquerda">
            ${this.renderizarContextoMissao(missao, concluida)}
            ${this.renderizarTabelaRef(missao)}
          </div>
          <div class="missao-direita">
            ${this.renderizarEditor(missao, concluida)}
          </div>
        </div>
      </div>
    `;
    this.bindMissaoEventos(missao);
    // Auto-scroll e foco
    setTimeout(() => {
      const ed = document.getElementById('sql-editor');
      if (ed) ed.focus();
    }, 100);
  }

  renderizarHeaderMissao() {
    const fase = this.faseAtual;
    const prog = engine.getProgressoFase(fase);
    return `
      <div class="missao-header">
        <button class="btn-voltar" onclick="ui.mostrarMapa()">← Mapa</button>
        <div class="missao-fase-info">
          <span class="missao-fase-icone">${fase.icone}</span>
          <div>
            <div class="missao-fase-nome">Fase ${fase.id}: ${fase.titulo}</div>
            <div class="missao-fase-prog">${prog.completas}/${prog.total} missões</div>
          </div>
        </div>
        <div class="missao-numeracao">
          ${fase.missoes.map((_, i) => `
            <div class="missao-dot ${i === this.missaoIdx ? 'ativo' : ''} ${engine.getMissaoConcluida(fase.missoes[i].id) ? 'ok' : ''}"
                 onclick="ui.irParaMissao(${i})" title="Missão ${i+1}">
              ${engine.getMissaoConcluida(fase.missoes[i].id) ? '✓' : i+1}
            </div>
          `).join('')}
        </div>
      </div>
    `;
  }

  renderizarContextoMissao(missao, concluida) {
    return `
      <div class="missao-contexto">
        <div class="missao-badge-tipo">${this.tipoLabel(missao.tipo)}</div>
        <h2 class="missao-titulo">${missao.titulo}</h2>
        <div class="missao-historia">
          <span class="historia-icone">📜</span>
          <p>${missao.historia}</p>
        </div>
        <div class="missao-instrucao">
          <strong>Missão:</strong> ${missao.instrucao}
        </div>
        ${concluida ? `
          <div class="missao-ja-concluida">
            ✅ Missão já concluída! Você pode revisar ou avançar.
          </div>
        ` : ''}
      </div>
    `;
  }

  renderizarTabelaRef(missao) {
    const tabela = missao.tabela_principal;
    const resultado = engine.executarSQL(`SELECT * FROM ${tabela} LIMIT 4`);
    return `
      <div class="ref-tabela">
        <div class="ref-titulo">📋 Prévia: <code>${tabela}</code></div>
        ${this.renderizarTabela(resultado, true)}
        <div class="ref-dica-tabelas">
          Tabelas disponíveis: <code>herois</code> · <code>guildas</code> · <code>missoes</code> · <code>itens</code> · <code>batalhas</code>
        </div>
      </div>
    `;
  }

  renderizarEditor(missao, concluida) {
    return `
      <div class="editor-container">
        <div class="editor-topo">
          <span class="editor-label">📝 Seu comando SQL</span>
          <span class="editor-xp">+${missao.xp} XP</span>
        </div>
        <div class="editor-wrap">
          <div class="editor-prompt">SELECT</div>
          <textarea id="sql-editor"
            placeholder="* FROM herois"
            spellcheck="false"
            autocorrect="off"
            autocapitalize="off"
          ></textarea>
        </div>
        <div class="editor-acoes">
          <button class="btn-dica" onclick="ui.mostrarDica()" id="btn-dica">
            💡 Dica ${this.dicaMostrada ? '(−10 XP)' : '(-10 XP)'}
          </button>
          <button class="btn-executar" onclick="ui.executar()">
            ▶ Executar
          </button>
        </div>
        <div id="feedback-area"></div>
        <div id="resultado-area"></div>
        <div class="editor-nav">
          ${this.missaoIdx > 0 ? `<button class="btn-nav" onclick="ui.irParaMissao(${this.missaoIdx - 1})">← Anterior</button>` : '<span></span>'}
          ${this.missaoIdx < this.faseAtual.missoes.length - 1
            ? `<button class="btn-nav btn-prox" onclick="ui.irParaMissao(${this.missaoIdx + 1})">Próxima →</button>`
            : `<button class="btn-nav btn-prox" onclick="ui.finalizarFase()">Concluir fase 🏁</button>`
          }
        </div>
      </div>
    `;
  }

  renderizarTabela(resultado, preview = false) {
    if (!resultado.sucesso) {
      return `<div class="erro-sql">❌ ${resultado.erro}</div>`;
    }
    if (resultado.colunas.length === 0) {
      return `<div class="resultado-vazio">Nenhum resultado retornado.</div>`;
    }
    const linhasVisiveis = preview ? resultado.linhas.slice(0, 4) : resultado.linhas;
    const maisLinhas = preview && resultado.linhas.length > 4;
    return `
      <div class="tabela-scroll">
        <table class="resultado-tabela">
          <thead>
            <tr>${resultado.colunas.map(c => `<th>${c}</th>`).join('')}</tr>
          </thead>
          <tbody>
            ${linhasVisiveis.map(linha => `
              <tr>${linha.map(v => `<td>${v === null ? '<em>NULL</em>' : v}</td>`).join('')}</tr>
            `).join('')}
          </tbody>
        </table>
        ${maisLinhas ? `<div class="tabela-mais">… e mais ${resultado.linhas.length - 4} linha(s)</div>` : ''}
        ${!preview ? `<div class="tabela-total">${resultado.total} linha(s) retornada(s)</div>` : ''}
      </div>
    `;
  }

  tipoLabel(tipo) {
    const map = { leitura: '📖 Leitura', completar: '✏️ Completar', livre: '⌨️ Livre', desafio: '⚔️ Desafio' };
    return map[tipo] || tipo;
  }

  // ─── Ações do Editor ─────────────────────────────────────
  bindMissaoEventos(missao) {
    const editor = document.getElementById('sql-editor');
    if (!editor) return;
    editor.addEventListener('keydown', e => {
      if (e.key === 'Enter' && (e.ctrlKey || e.metaKey)) {
        e.preventDefault();
        this.executar();
      }
      if (e.key === 'Tab') {
        e.preventDefault();
        const s = editor.selectionStart, en = editor.selectionEnd;
        editor.value = editor.value.substring(0, s) + '  ' + editor.value.substring(en);
        editor.selectionStart = editor.selectionEnd = s + 2;
      }
    });
  }

  getSQLEditor() {
    const editor = document.getElementById('sql-editor');
    const val = (editor?.value || '').trim();
    // Se o usuário não digitou SELECT, adiciona automaticamente
    if (!val.toLowerCase().startsWith('select')) {
      return 'SELECT ' + val;
    }
    return val;
  }

  executar() {
    const missao = this.faseAtual.missoes[this.missaoIdx];
    const sql = this.getSQLEditor();
    if (!sql || sql === 'SELECT') {
      this.mostrarFeedback('warning', '✏️ Digite seu comando SQL antes de executar!');
      return;
    }

    this.tentativas++;
    const { correto, resultado } = engine.verificarResposta(sql, missao);

    // Mostrar resultado da query
    const resArea = document.getElementById('resultado-area');
    if (resArea && resultado) {
      resArea.innerHTML = resultado.sucesso
        ? `<div class="resultado-header">Resultado da consulta</div>${this.renderizarTabela(resultado)}`
        : `<div class="erro-sql">❌ ${resultado.erro}</div>`;
    }

    if (!resultado?.sucesso) {
      this.mostrarFeedback('erro', `❌ Erro SQL: ${resultado?.erro || 'Verifique a sintaxe!'}`);
      return;
    }

    if (correto) {
      const jaFoi = engine.getMissaoConcluida(missao.id);
      const xpGanho = jaFoi ? 0 : (this.dicaMostrada ? Math.max(5, missao.xp - 10) : missao.xp);
      if (!jaFoi) {
        engine.completarMissao(missao.id, xpGanho);
        engine.verificarConclusaoFase(this.faseAtual);
      }

      this.mostrarFeedback('sucesso', `
        ✅ <strong>Correto!</strong> ${jaFoi ? 'Missão já concluída.' : `+${xpGanho} XP ganhos!`}
        <div style="margin-top:8px;font-size:13px;opacity:.8">
          ${resultado.total} linha(s) retornada(s)
        </div>
      `);
      this.renderizarHeaderMissao && this.atualizarDots();
    } else {
      const msgs = [
        'Hmm, o resultado não está certo. Revise sua query!',
        'Quase lá! Verifique as colunas e condições.',
        'Tente com calma — leia a instrução novamente.',
        'Dica: use o botão 💡 para uma ajuda!'
      ];
      const msg = msgs[Math.min(this.tentativas - 1, msgs.length - 1)];
      this.mostrarFeedback('erro', `⚠️ ${msg}`);
    }
  }

  atualizarDots() {
    const fase = this.faseAtual;
    fase.missoes.forEach((m, i) => {
      const dot = document.querySelectorAll('.missao-dot')[i];
      if (dot && engine.getMissaoConcluida(m.id)) {
        dot.classList.add('ok');
        dot.textContent = '✓';
      }
    });
    // Atualizar XP no header
    const xpEl = document.querySelector('.xp-valor');
    if (xpEl) xpEl.textContent = `⭐ ${engine.progresso.xp} XP`;
  }

  mostrarFeedback(tipo, html) {
    const area = document.getElementById('feedback-area');
    if (!area) return;
    const cls = { sucesso: 'feedback-ok', erro: 'feedback-erro', warning: 'feedback-aviso' };
    area.innerHTML = `<div class="${cls[tipo] || 'feedback-erro'}">${html}</div>`;
  }

  mostrarDica() {
    const missao = this.faseAtual.missoes[this.missaoIdx];
    this.dicaMostrada = true;
    const btn = document.getElementById('btn-dica');
    if (btn) btn.disabled = true;
    this.mostrarFeedback('warning', `💡 <strong>Dica:</strong> ${missao.dica}`);
  }

  irParaMissao(idx) {
    this.missaoIdx = idx;
    this.mostrarMissao();
  }

  finalizarFase() {
    const fase = this.faseAtual;
    const prog = engine.getProgressoFase(fase);
    engine.verificarConclusaoFase(fase);

    const app = document.getElementById('app');
    app.innerHTML = `
      <div class="tela-conclusao">
        ${this.renderizarHeader()}
        <div class="conclusao-card">
          <div class="conclusao-icone">${fase.icone}</div>
          <h2>Fase ${fase.id} concluída!</h2>
          <h3>${fase.titulo}</h3>
          <div class="conclusao-stats">
            <div class="cstat">
              <div class="cstat-val">${prog.completas}/${prog.total}</div>
              <div class="cstat-label">Missões</div>
            </div>
            <div class="cstat">
              <div class="cstat-val">⭐ ${engine.progresso.xp}</div>
              <div class="cstat-label">XP total</div>
            </div>
            <div class="cstat">
              <div class="cstat-val">Nv. ${engine.progresso.nivel}</div>
              <div class="cstat-label">${engine.progresso.titulo}</div>
            </div>
          </div>
          ${fase.id < FASES.length ? `
            <p class="conclusao-msg">🔓 Próxima fase desbloqueada: <strong>${FASES[fase.id].titulo}</strong></p>
          ` : `
            <p class="conclusao-msg">🏆 Você completou todas as fases! Parabéns, Arquimago!</p>
          `}
          <div class="conclusao-acoes">
            <button class="btn-voltar-mapa" onclick="ui.mostrarMapa()">← Voltar ao mapa</button>
            ${fase.id < FASES.length ? `<button class="btn-proxima-fase" onclick="ui.abrirFase(${fase.id + 1})">Próxima fase →</button>` : ''}
          </div>
        </div>
      </div>
    `;
  }

  confirmarReset() {
    if (confirm('⚠️ Reiniciar todo o progresso? Esta ação não pode ser desfeita.')) {
      engine.resetarProgresso();
      this.mostrarMapa();
    }
  }
}

const ui = new SQLQuestUI();
