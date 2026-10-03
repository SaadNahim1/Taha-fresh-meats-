import React, { useState } from 'react';
import { ChevronDown, ShieldCheck, Truck, CreditCard, Scale, HelpCircle } from 'lucide-react';

const FAQS = [
  {
    q: 'Como funciona a pesagem das carnes por quilo?',
    a: 'No catálogo escolhe a estimativa em quilos (ex: 1 kg, 1.5 kg, 2 kg). Como cada peça de carne fresca varia ligeiramente, o talho pesa o corte exato no momento da preparação e confirma o peso e valor final consigo no WhatsApp antes do envio.',
    icon: Scale,
  },
  {
    q: 'A carne é realmente 100% Halal?',
    a: 'Sim, garantimos conformidade rigorosa. Todo o nosso gado e aves são abatidos e manuseados de acordo com os princípios islâmicos (Halal), com certificado e higiene total.',
    icon: ShieldCheck,
  },
  {
    q: 'Onde fazem entregas e quais são os horários?',
    a: 'Fazemos entregas em toda a cidade de Maputo (Polana, Sommerschield, Central, Costa do Sol, Triunfo) e Matola. Entregamos de Segunda a Sábado das 08h00 às 18h30 e Domingo das 08h00 às 13h00.',
    icon: Truck,
  },
  {
    q: 'Quais são as formas de pagamento aceites?',
    a: 'Aceitamos M-Pesa, e-Mola, pagamento por POS/Cartão bancário, dinheiro no momento da entrega e transferência bancária imediata (BIM, BCI, Standard Bank).',
    icon: CreditCard,
  },
];

export const StoreFaq: React.FC = () => {
  const [openIndex, setOpenIndex] = useState<number | null>(null);

  const toggle = (index: number) => {
    setOpenIndex(openIndex === index ? null : index);
  };

  return (
    <section className="bg-white rounded-2xl border border-stone-200/90 p-5 sm:p-6 shadow-xs">
      <div className="flex items-center gap-2 mb-4">
        <div className="w-8 h-8 rounded-lg bg-amber-100 text-amber-900 flex items-center justify-center">
          <HelpCircle className="w-4 h-4" />
        </div>
        <div>
          <h2 className="text-base font-bold text-stone-900">
            Perguntas Frequentes & Como Comprar
          </h2>
          <p className="text-xs text-stone-500">
            Tudo o que precisa de saber sobre as nossas carnes frescas e encomendas
          </p>
        </div>
      </div>

      <div className="divide-y divide-stone-100">
        {FAQS.map((faq, index) => {
          const isOpen = openIndex === index;
          const Icon = faq.icon;
          return (
            <div key={index} className="py-3">
              <button
                onClick={() => toggle(index)}
                className="w-full flex items-center justify-between gap-3 text-left font-semibold text-xs sm:text-sm text-stone-800 hover:text-[#8b1e1e] transition cursor-pointer"
              >
                <span className="flex items-center gap-2.5">
                  <Icon className="w-4 h-4 text-[#8b1e1e] flex-none" />
                  <span>{faq.q}</span>
                </span>
                <ChevronDown
                  className={`w-4 h-4 text-stone-400 transition-transform ${
                    isOpen ? 'rotate-180 text-[#8b1e1e]' : ''
                  }`}
                />
              </button>

              {isOpen && (
                <div className="mt-2.5 pl-6 pr-2 text-xs text-stone-600 leading-relaxed animate-in fade-in duration-150">
                  {faq.a}
                </div>
              )}
            </div>
          );
        })}
      </div>
    </section>
  );
};
