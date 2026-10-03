import React, { useState } from 'react';
import { X, Github, Copy, Check, Terminal, ExternalLink, Globe, Shield } from 'lucide-react';

interface GitHubModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export const GitHubModal: React.FC<GitHubModalProps> = ({ isOpen, onClose }) => {
  const [copiedIndex, setCopiedIndex] = useState<number | null>(null);

  if (!isOpen) return null;

  const copyCode = (code: string, index: number) => {
    navigator.clipboard.writeText(code);
    setCopiedIndex(index);
    setTimeout(() => setCopiedIndex(null), 2000);
  };

  const gitCommands = `# 1. Inicializar o repositório git local (se ainda não estiver)
git init

# 2. Adicionar todos os ficheiros do projeto
git add .

# 3. Criar o primeiro commit
git commit -m "feat: Catálogo Taha's Fresh Meat com pedidos WhatsApp"

# 4. Definir a branch principal como main
git branch -M main

# 5. Adicionar o seu repositório GitHub remoto (substitua pelo seu URL)
git remote add origin https://github.com/SEU-UTILIZADOR/tahas-fresh-meat.git

# 6. Enviar para o GitHub
git push -u origin main`;

  return (
    <div
      role="dialog"
      aria-modal="true"
      aria-labelledby="github-modal-title"
      className="fixed inset-0 z-50 flex items-center justify-center bg-black/65 backdrop-blur-xs p-3 sm:p-4"
    >
      <div className="w-full max-w-xl max-h-[90vh] bg-white rounded-2xl shadow-2xl flex flex-col overflow-hidden animate-in fade-in zoom-in-95 duration-150">
        {/* Modal Header */}
        <div className="flex items-center justify-between px-5 py-4 bg-stone-900 text-white">
          <div className="flex items-center gap-2.5">
            <div className="p-2 bg-white/10 rounded-lg">
              <Github className="w-5 h-5 text-white" />
            </div>
            <div>
              <h2 id="github-modal-title" className="text-base sm:text-lg font-bold">
                Conectar este Projeto com o GitHub
              </h2>
              <p className="text-xs text-stone-400">
                Guia passo a passo para guardar e publicar o código do seu cliente
              </p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-1 rounded-full text-stone-400 hover:text-white hover:bg-white/10 transition cursor-pointer"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Modal Body */}
        <div className="flex-1 overflow-y-auto p-4 sm:p-6 space-y-5 text-sm text-stone-700">
          {/* Step 1: Create Repo on GitHub */}
          <div className="space-y-2">
            <div className="flex items-center gap-2 font-bold text-stone-900">
              <span className="w-6 h-6 rounded-full bg-[#8b1e1e] text-white text-xs flex items-center justify-center font-bold">
                1
              </span>
              <span>Criar um novo repositório no GitHub</span>
            </div>
            <p className="text-xs text-stone-600 pl-8 leading-relaxed">
              Aceda a{' '}
              <a
                href="https://github.com/new"
                target="_blank"
                rel="noopener noreferrer"
                className="text-[#8b1e1e] underline font-semibold inline-flex items-center gap-1"
              >
                github.com/new <ExternalLink className="w-3 h-3" />
              </a>{' '}
              e crie um repositório vazio com o nome (por exemplo:{' '}
              <code className="bg-stone-100 text-stone-800 px-1.5 py-0.5 rounded font-mono text-xs">
                tahas-fresh-meat
              </code>
              ). Deixe desmarcada a opção "Add a README file" para não criar conflito.
            </p>
          </div>

          {/* Step 2: Push code */}
          <div className="space-y-2">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2 font-bold text-stone-900">
                <span className="w-6 h-6 rounded-full bg-[#8b1e1e] text-white text-xs flex items-center justify-center font-bold">
                  2
                </span>
                <span>Comandos no Terminal / VS Code</span>
              </div>
              <button
                onClick={() => copyCode(gitCommands, 1)}
                className="text-xs text-[#8b1e1e] hover:text-[#731717] font-semibold flex items-center gap-1 cursor-pointer"
              >
                {copiedIndex === 1 ? (
                  <>
                    <Check className="w-3.5 h-3.5 text-emerald-600" />
                    <span className="text-emerald-600">Copiado!</span>
                  </>
                ) : (
                  <>
                    <Copy className="w-3.5 h-3.5" />
                    <span>Copiar todos</span>
                  </>
                )}
              </button>
            </div>

            <div className="relative pl-8">
              <pre className="bg-stone-950 text-emerald-400 p-3.5 rounded-xl text-xs font-mono overflow-x-auto border border-stone-800 leading-relaxed">
                {gitCommands}
              </pre>
            </div>
          </div>

          {/* Step 3: Deployment recommendations */}
          <div className="space-y-2.5 border-t border-stone-200 pt-4">
            <div className="flex items-center gap-2 font-bold text-stone-900">
              <Globe className="w-4 h-4 text-emerald-600" />
              <span>Onde publicar online para os clientes do seu cliente?</span>
            </div>
            <p className="text-xs text-stone-600 leading-relaxed">
              Uma vez conectado ao GitHub, pode colocar este catálogo no ar gratuitamente em 2 minutos conectando o repositório a:
            </p>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 text-xs">
              <div className="p-3 rounded-lg border border-stone-200 bg-stone-50">
                <strong className="block text-stone-900 mb-0.5">Vercel (Recomendado)</strong>
                <p className="text-stone-500 text-[11px]">
                  Basta importar o repositório GitHub em vercel.com. Dá um link instantâneo tipo <code>tahas-meat.vercel.app</code> e suporta domínio próprio.
                </p>
              </div>
              <div className="p-3 rounded-lg border border-stone-200 bg-stone-50">
                <strong className="block text-stone-900 mb-0.5">Netlify / Cloudflare</strong>
                <p className="text-stone-500 text-[11px]">
                  Totalmente compatível com Vite e React, com SSL gratuito e entrega ultrarrápida em Moçambique e no mundo.
                </p>
              </div>
            </div>
          </div>

          {/* Note on WhatsApp integration */}
          <div className="flex items-start gap-2 p-3 bg-amber-50 rounded-xl border border-amber-200 text-xs text-amber-800">
            <Shield className="w-4 h-4 text-amber-700 flex-none mt-0.5" />
            <span>
              <strong>Dica de segurança:</strong> Os pedidos vão diretamente para o WhatsApp do proprietário sem necessidade de guardar dados de cartões ou servidores externos, tornando a operação 100% segura e direta para o seu cliente.
            </span>
          </div>
        </div>

        {/* Modal Footer */}
        <div className="p-4 bg-stone-50 border-t border-stone-200 flex justify-end">
          <button
            onClick={onClose}
            className="px-5 py-2 rounded-xl bg-stone-900 hover:bg-stone-800 text-white font-semibold text-xs transition cursor-pointer"
          >
            Entendido, fechar
          </button>
        </div>
      </div>
    </div>
  );
};
