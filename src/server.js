const quizData = {
    1: {
        question: "Qual é a primeira etapa fundamental do Ciclo de Machine Learning?",
        options: ["Treinamento do Modelo", "Coleta de Dados", "Deployment"],
        correct: 1, 
        explanation: "Exato! Sem dados (matéria-prima), não há aprendizado."
    },
    2: {
        question: "Qual componente biológico inspirou as Redes Neurais Artificiais?",
        options: ["O DNA", "O Neurônio", "O Coração"],
        correct: 1,
        explanation: "Correto! Elas imitam as conexões sinápticas do cérebro."
    },
    3: {
        question: "Como o modelo aprende durante o treinamento?",
        options: ["Decorando todas as respostas", "Ajustando os pesos (parâmetros) para minimizar o erro", "Pesquisando no Google"],
        correct: 1,
        explanation: "Perfeito! O aprendizado é a otimização matemática dos pesos."
    },
    4: {
        question: "O que permite ao Transformer entender o contexto global de uma frase?",
        options: ["Mecanismo de Atenção", "Processamento sequencial", "Dicionário embutido"],
        correct: 0,
        explanation: "Isso mesmo! O mecanismo de 'Attention' avalia a relação de todas as palavras de uma só vez."
    },
    5: {
        question: "O que um LLM como o ChatGPT realmente faz?",
        options: ["Pensa como um humano", "Prevê a próxima palavra mais provável", "Consulta um banco de dados de verdades"],
        correct: 1,
        explanation: "Exato! É um 'Next Token Predictor' baseado em estatística."
    },
    6: {
        question: "O que acontece se aumentarmos demais a complexidade do modelo (parâmetros)?",
        options: ["Ele fica mais lento e caro", "Ele consome menos energia", "Ele fica menos inteligente"],
        correct: 0,
        explanation: "Correto. Modelos maiores exigem muito mais computação (GPUs)."
    },
    7: {
        question: "O que acontece com a temperatura alta (ex: 0.9)?",
        options: ["A IA fica mais criativa e imprevisível", "A IA fica mais precisa e factual", "A IA para de responder"],
        correct: 0,
        explanation: "Isso! Alta temperatura aumenta a aleatoriedade (criatividade)."
    },
    8: {
        question: "Qual hardware é essencial para treinar IA moderna?",
        options: ["CPU (Processador comum)", "GPU (Placa de Vídeo)", "SSD (Armazenamento)"],
        correct: 1,
        explanation: "Exato! As GPUs processam cálculos paralelos muito melhor."
    },
    9: {
        question: "Para que serve o RLHF?",
        options: ["Para aumentar a velocidade da IA", "Para alinhar a IA aos valores humanos e segurança", "Para conectar a IA na internet"],
        correct: 1,
        explanation: "Perfeito! RLHF garante que a IA seja útil e inofensiva."
    },
    10: {
        question: "Qual foi o marco de 2017 que mudou tudo?",
        options: ["O lançamento do iPhone", "O artigo 'Attention is All You Need' (Transformer)", "A vitória do DeepBlue"],
        correct: 1,
        explanation: "Correto! O Transformer é a base de todas as IAs generativas atuais."
    },
    11: {
        question: "Por que a IA alucina?",
        options: ["Ela prioriza a fluidez do texto sobre a verdade factual", "Ela quer enganar o usuário", "Ela está com vírus"],
        correct: 0,
        explanation: "Exato! Ela preenche lacunas estatisticamente para manter a frase coerente."
    },
    12: {
        question: "O que acontece quando a Janela de Contexto enche?",
        options: ["A IA explode", "A IA esquece o início da conversa", "A IA arquiva a conversa no HD"],
        correct: 1,
        explanation: "Isso mesmo! Informações antigas são descartadas da 'memória de curto prazo'."
    },
    13: {
        question: "Qual a principal vantagem do RAG?",
        options: ["Permite que a IA consulte seus dados privados/atualizados", "Faz a IA responder mais rápido", "Diminui o custo da GPU"],
        correct: 0,
        explanation: "Perfeito! RAG conecta o 'cérebro' da IA à sua 'biblioteca' de documentos."
    },
    14: {
        question: "Qual prompt deve gerar melhor resultado?",
        options: ["'Escreva um texto'", "'Aja como um especialista, escreva um texto curto e formal sobre IA.'", "'Me fale algo'"],
        correct: 1,
        explanation: "Correto! Contexto, Persona e Especificidade são chaves."
    },
    15: {
        question: "Quem é responsável por evitar o viés na IA?",
        options: ["A IA se autocorrige", "Apenas os robôs", "Os humanos que desenvolvem e usam a IA"],
        correct: 2,
        explanation: "Exato! A ética deve vir do design e supervisão humana."
    }
};

document.addEventListener('DOMContentLoaded', () => {
    const quizContainer = document.getElementById('quiz-container');
    if (!quizContainer) return;

    // Detect Page ID from URL (e.g. /infografico/1 -> 1)
    let path = window.location.pathname;
    let pageId = path.split('/').pop().replace('.page.html','').replace('infografico/', '');
    
    // For local dev where url might be ending in number
    if (pageId === '') pageId = path.split('/').slice(-2)[0]; // simplistic fallback
    if (!isNaN(path.split('/').pop())) pageId = path.split('/').pop();

    const data = quizData[parseInt(pageId)];

    if (!data) return;

    quizContainer.innerHTML = `
        <div class="bg-gray-50 border-2 border-dashed border-gray-300 p-6 rounded-xl text-center max-w-2xl mx-auto shadow-sm">
            <h3 class="font-display font-bold text-piGreen text-xl mb-2">
                <i class="fas fa-clipboard-check mr-2"></i>Checkpoint de Conhecimento
            </h3>
            <p class="mb-6 text-gray-700 font-medium text-lg">${data.question}</p>
            <div class="grid gap-3 max-w-lg mx-auto">
                ${data.options.map((opt, i) => `
                    <button onclick="checkAnswer(${i}, ${data.correct}, this, '${data.explanation.replace(/'/g, "\\'")}')" 
                        class="quiz-btn bg-white border-2 border-gray-200 text-gray-700 py-3 px-4 rounded-lg hover:border-piBlue hover:bg-blue-50 transition-all font-semibold text-left">
                        ${opt}
                    </button>
                `).join('')}
            </div>
            <div id="quiz-feedback" class="mt-6 p-4 rounded-lg hidden animate-fade-in-up"></div>
        </div>
    `;
});

window.checkAnswer = function(selected, correct, btn, explanation) {
    const feedback = document.getElementById('quiz-feedback');
    const container = btn.parentElement;
    const buttons = container.querySelectorAll('button');
    
    // Disable all buttons
    buttons.forEach(b => {
        b.disabled = true;
        b.classList.add('opacity-70', 'cursor-not-allowed');
    });

    // Remove hover effects
    btn.classList.remove('hover:border-piBlue', 'hover:bg-blue-50');

    if (selected === correct) {
        btn.classList.remove('border-gray-200', 'bg-white', 'text-gray-700');
        btn.classList.add('bg-green-100', 'border-green-500', 'text-green-800');
        
        feedback.innerHTML = `<i class="fas fa-check-circle text-2xl mb-2 text-green-600 block"></i><span class="font-bold text-green-700">Correto!</span><p class="text-sm text-green-800 mt-1">${explanation}</p>`;
        feedback.className = "mt-6 p-4 rounded-lg bg-green-50 border border-green-200 block animate-fade-in-up";
    } else {
        btn.classList.remove('border-gray-200', 'bg-white', 'text-gray-700');
        btn.classList.add('bg-red-100', 'border-red-500', 'text-red-800');
        
        // Highlight correct one
        const correctBtn = buttons[correct];
        correctBtn.classList.remove('border-gray-200', 'bg-white', 'text-gray-700', 'opacity-70');
        correctBtn.classList.add('bg-green-50', 'border-green-400', 'text-green-800', 'border-2');

        feedback.innerHTML = `<i class="fas fa-times-circle text-2xl mb-2 text-red-600 block"></i><span class="font-bold text-red-700">Incorreto.</span><p class="text-sm text-gray-700 mt-1">${explanation}</p>`;
        feedback.className = "mt-6 p-4 rounded-lg bg-red-50 border border-red-200 block animate-fade-in-up";
    }
}
