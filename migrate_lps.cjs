
const axios = require('axios');

const PROJECT_ID = "phdonassolo-site-d2024";
const BASE_URL = `https://firestore.googleapis.com/v1/projects/${PROJECT_ID}/databases/(default)/documents`;

async function addDoc(collection, id, data) {
    const url = `${BASE_URL}/${collection}/${id}`;

    // Convert data to Firestore REST format
    const fields = {};
    for (const [key, value] of Object.entries(data)) {
        if (typeof value === 'string') {
            fields[key] = { stringValue: value };
        } else if (typeof value === 'number') {
            fields[key] = { doubleValue: value };
        } else if (typeof value === 'boolean') {
            fields[key] = { booleanValue: value };
        } else if (Array.isArray(value)) {
            fields[key] = { arrayValue: { values: value.map(v => ({ stringValue: v })) } };
        }
    }

    try {
        console.log(`Migrando LP: ${id}...`);
        // Use PATCH to create or update
        await axios.patch(url, { fields });
        console.log(`✓ LP ${id} salva com sucesso!`);
    } catch (error) {
        console.error(`✗ Erro ao salvar LP ${id}:`, error.response?.data || error.message);
    }
}

const lps = [
    {
        lpName: 'simulador-roi-vendas',
        materialId: 'simulador-roi',
        pageTitle: 'Simulador de ROI em Vendas | Prof. Paulo H. Donassolo',
        metaDesc: 'Acesse gratuitamente o Simulador de ROI em Vendas. Calcule o retorno dos seus investimentos em equipes comerciais.',
        badge: 'Ferramenta Gratuita',
        titleLine1: 'Simulador de',
        titleLine2: 'ROI em Vendas',
        heroDesc: 'Calcule o retorno sobre investimento da sua equipe de vendas. Descubra se seus investimentos em gestão comercial estão gerando resultados.',
        beneficios: ['Cálculos precisos', 'Relatório detalhado', 'Acesso imediato'],
        formTitle: 'Acesse o simulador agora',
        formSubtitle: 'Cadastre-se para acessar a ferramenta',
        buttonText: 'Acessar simulador grátis',
        labelNome: 'Nome Completo',
        labelEmail: 'Email Profissional',
        placeholderNome: 'Ex: João Silva Santos',
        placeholderEmail: 'Ex: joao@empresa.com.br',
        bgColor: '#fbfbfd',
        primaryColor: '#3b82f6',
        textColor: '#1d1d1f',
        buttonBgColor: '#3b82f6',
        buttonTextColor: '#ffffff',
        buttonRadius: '24px',
        fontFamily: 'Inter, sans-serif',
        titleSize: 'text-6xl',
        titleWeight: 'font-bold',
        buttonSize: 'w-full py-5 text-lg',
        redirectUrl: 'https://phdonassolo.com/simulador',
        webAppUrl: 'https://script.google.com/macros/s/AKfycbwAz17lsqIudknZuxeWf8OG5wJhEAf_UTJ1_H0yiSGyjleipJ9gRu68dx9hNrWYimtL/exec',
        gaId: 'G-QLJ9N5BYTD',
        termsText: 'Li e concordo com a Política de Privacidade. Meus dados serão usados exclusivamente para acesso ao simulador.',
        showTerms: true
    },
    {
        lpName: 'ebook-vendas-alto-impacto',
        materialId: 'ebook-vendas',
        pageTitle: 'eBook Grátis: Gestão de Vendas de Alto Impacto | Prof. Paulo H. Donassolo',
        metaDesc: 'Baixe gratuitamente o eBook Gestão de Vendas de Alto Impacto. Estratégias práticas para gestores comerciais e profissionais de vendas no Brasil.',
        badge: 'eBook Gratuito',
        titleLine1: 'Gestão de Vendas de',
        titleLine2: 'Alto Impacto',
        heroDesc: 'Estratégias comprovadas para aumentar performance, motivar equipes e atingir metas com consistência no mercado brasileiro.',
        beneficios: ['PDF de 50 páginas', 'Casos práticos do mercado brasileiro', 'Ferramentas aplicáveis'],
        formTitle: 'Receba o eBook grátis',
        formSubtitle: 'Preencha os dados abaixo para receber no seu email',
        buttonText: 'Quero receber o eBook grátis',
        labelNome: 'Nome Completo',
        labelEmail: 'Email Profissional',
        placeholderNome: 'Ex: João Silva Santos',
        placeholderEmail: 'Ex: joao@empresa.com.br',
        bgColor: '#fbfbfd',
        primaryColor: '#3b82f6',
        textColor: '#1d1d1f',
        buttonBgColor: '#3b82f6',
        buttonTextColor: '#ffffff',
        buttonRadius: '24px',
        fontFamily: 'Inter, sans-serif',
        titleSize: 'text-6xl',
        titleWeight: 'font-bold',
        buttonSize: 'w-full py-5 text-lg',
        redirectUrl: '',
        webAppUrl: 'https://script.google.com/macros/s/AKfycbwAz17lsqIudknZuxeWf8OG5wJhEAf_UTJ1_H0yiSGyjleipJ9gRu68dx9hNrWYimtL/exec',
        gaId: 'G-QLJ9N5BYTD',
        termsText: 'Li e concordo com a Política de Privacidade. Meus dados serão usados exclusivamente para envio do eBook.',
        showTerms: true
    },
    {
        lpName: 'ebook-custo-entrega-gas',
        materialId: 'ebook-custo-entrega',
        pageTitle: 'Material Gratuito | Prof. Paulo',
        metaDesc: 'ebook Cálculo do Custo de Entrega do Gás',
        badge: 'Material Gratuito',
        titleLine1: 'Cálculo do Custo de Entrega do Gás',
        titleLine2: 'ebook completo',
        heroDesc: 'Um guia para calcular o Custo das Suas Entregas para evitar os erros que muitos cometem.',
        beneficios: ['Prático', 'Real', 'Aplicável'],
        formTitle: 'Baixe aqui. Grátis!',
        formSubtitle: 'Preencha os dados para receber',
        buttonText: 'Receber Grátis',
        labelNome: 'Nome Completo',
        labelEmail: 'Email Profissional',
        placeholderNome: 'Ex: João Silva Santos',
        placeholderEmail: 'Ex: joao@empresa.com.br',
        bgColor: '#fbfbfd',
        primaryColor: '#053e99',
        textColor: '#1d1d1f',
        buttonBgColor: '#3b82f6',
        buttonTextColor: '#ffffff',
        buttonRadius: '16px',
        fontFamily: 'Inter, sans-serif',
        titleSize: 'text-6xl',
        titleWeight: 'font-bold',
        buttonSize: 'px-10 py-4 text-lg w-full',
        redirectUrl: '',
        webAppUrl: 'https://script.google.com/macros/s/AKfycbwAz17lsqIudknZuxeWf8OG5wJhEAf_UTJ1_H0yiSGyjleipJ9gRu68dx9hNrWYimtL/exec',
        gaId: 'G-QLJ9N5BYTD',
        termsText: 'Concordo em receber comunicações do Prof. Paulo H. Donassolo e estou ciente da Política de Privacidade.',
        showTerms: true
    }
];

async function run() {
    for (const lp of lps) {
        await addDoc('landing_pages', lp.lpName, lp);
    }
}

run();
