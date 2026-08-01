const ITEMS = [
  "LÍDERES EM MANUTENÇÃO",
  "ATENDIMENTO RÁPIDO",
  "PARANAVAÍ E REGIÃO NOROESTE",
  "HIDROJATEAMENTO",
  "LIMPEZA DE CAIXA D'ÁGUA",
  "DESENTUPIMENTO",
  "5 ANOS DE EXPERIÊNCIA",
];

export const Marquee = () => {
  const row = [...ITEMS, ...ITEMS];
  return (
    <div
      data-testid="marquee"
      className="relative overflow-hidden bg-primary py-5 border-y border-white/10"
    >
      <div className="flex w-max animate-marquee whitespace-nowrap">
        {row.map((item, i) => (
          <div key={i} className="flex items-center">
            <span className="px-8 text-sm font-semibold uppercase tracking-[0.2em] text-white/90">
              {item}
            </span>
            <span className="text-accent">◆</span>
          </div>
        ))}
      </div>
    </div>
  );
};
