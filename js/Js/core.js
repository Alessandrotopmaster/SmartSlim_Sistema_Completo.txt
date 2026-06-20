/**
 * SmartSystem - Core
 */
const SmartSystem = {
    version: '3.0.0',
    api: '/api',
    
    async fetch(endpoint, options = {}) {
        try {
            const response = await fetch(`${this.api}${endpoint}`, {
                headers: { 'Content-Type': 'application/json' },
                ...options
            });
            return await response.json();
        } catch (error) {
            console.error('Erro API:', error);
            return { error: error.message };
        }
    },
    
    formatarMoeda(valor) {
        return new Intl.NumberFormat('pt-BR', {
            style: 'currency',
            currency: 'BRL'
        }).format(valor);
    },
    
    formatarData(data) {
        return new Date(data).toLocaleDateString('pt-BR');
    },
    
    salvarLocal(chave, dados) {
        localStorage.setItem(chave, JSON.stringify(dados));
    },
    
    carregarLocal(chave) {
        const dados = localStorage.getItem(chave);
        return dados ? JSON.parse(dados) : null;
    },
    
    toast(mensagem, tipo = 'info') {
        const toast = document.createElement('div');
        toast.style.cssText = `
            position: fixed;
            bottom: 20px;
            left: 50%;
            transform: translateX(-50%);
            background: ${tipo === 'success' ? '#2A9D8F' : tipo === 'error' ? '#E63946' : '#0A2463'};
            color: white;
            padding: 12px 24px;
            border-radius: 25px;
            z-index: 9999;
            font-weight: bold;
        `;
        toast.textContent = mensagem;
        document.body.appendChild(toast);
        setTimeout(() => toast.remove(), 3000);
    }
};

console.log('🚀 SmartSystem Core carregado');
