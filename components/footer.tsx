export function Footer() {
  return (
    <footer className="border-t border-white/[0.08] bg-[#080b10]">
      <div className="mx-auto flex max-w-7xl flex-col gap-4 px-4 py-7 sm:flex-row sm:items-center sm:justify-between sm:px-6 lg:px-8">
        <a href="/" className="w-fit text-base font-black tracking-tight text-white">
          Painel <span className="text-emerald-400">Social</span>
        </a>
        <p className="text-xs leading-5 text-slate-500">
          Plataforma de serviços digitais. Confira os detalhes de cada serviço antes de enviar um pedido.
        </p>
        <a href="/login" className="w-fit text-sm font-semibold text-slate-400 transition hover:text-emerald-300">
          Acessar conta
        </a>
      </div>
    </footer>
  )
}
