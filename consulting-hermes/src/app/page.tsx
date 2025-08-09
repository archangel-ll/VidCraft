import Link from "next/link";
import { Button } from "@/components/ui/button";

export default function Home() {
  return (
    <div>
      <section className="relative overflow-hidden bg-gradient-to-br from-slate-900 to-sky-700 text-white">
        <div className="mx-auto max-w-6xl px-4 py-20">
          <h1 className="text-4xl md:text-5xl font-bold max-w-3xl">AI-Powered 8-Second VSLs That Convert in Seconds.</h1>
          <p className="mt-4 text-lg max-w-2xl text-sky-100">Transform your offer into a scroll-stopping sales video. One credit, one VSL — ready in minutes.</p>
          <div className="mt-6 flex flex-wrap gap-3">
            <Link href="/signup"><Button className="bg-sky-400 hover:bg-sky-500">Start Free — No Card Required</Button></Link>
            <Link href="/pricing"><Button variant="outline" className="bg-white/10 border-white text-white hover:bg-white/20">View Pricing</Button></Link>
          </div>
        </div>
      </section>

      <section className="mx-auto max-w-6xl px-4 py-12">
        <h2 className="text-2xl font-semibold">How it works</h2>
        <div className="mt-6 grid gap-6 sm:grid-cols-2 lg:grid-cols-4 text-sm">
          {["Describe your offer", "Pick tone & brand color", "AI generates your 8s VSL", "Download & share"].map((step, i) => (
            <div key={i} className="rounded-lg border border-slate-200 p-4">
              <div className="h-8 w-8 rounded-full bg-sky-100 text-sky-700 flex items-center justify-center font-semibold">{i + 1}</div>
              <div className="mt-3 font-medium">{step}</div>
            </div>
          ))}
        </div>
      </section>

      <section className="bg-white">
        <div className="mx-auto max-w-6xl px-4 py-12 grid gap-6 md:grid-cols-3">
          {[
            { title: "Speed", desc: "Generate in minutes with realistic progress simulation." },
            { title: "AI-enhanced", desc: "Smart tone and benefit framing for conversions." },
            { title: "On-brand", desc: "Choose brand color and keep it consistent." },
          ].map((b) => (
            <div key={b.title} className="rounded-lg border border-slate-200 p-6">
              <div className="text-lg font-semibold">{b.title}</div>
              <div className="mt-2 text-slate-600">{b.desc}</div>
            </div>
          ))}
        </div>
      </section>

      <section className="mx-auto max-w-6xl px-4 py-12">
        <h2 className="text-2xl font-semibold">Results our users love</h2>
        <div className="mt-6 grid gap-6 md:grid-cols-3">
          {[1,2,3].map((i) => (
            <div key={i} className="rounded-lg border border-slate-200 p-4">
              <div className="aspect-video w-full rounded bg-slate-100"></div>
              <div className="mt-3 text-sm text-slate-700">Case study {i}: +43% CTR lift in 2 weeks.</div>
            </div>
          ))}
        </div>
      </section>

      <section className="mx-auto max-w-6xl px-4 py-12">
        <h2 className="text-2xl font-semibold">FAQ</h2>
        <div className="mt-4 space-y-3 text-sm text-slate-700">
          <details className="rounded border border-slate-200 p-3"><summary className="font-medium">What counts as a credit?</summary>Each generated VSL uses 1 credit.</details>
          <details className="rounded border border-slate-200 p-3"><summary className="font-medium">Do credits expire?</summary>No, credits never expire.</details>
          <details className="rounded border border-slate-200 p-3"><summary className="font-medium">How real is the video?</summary>We provide a downloadable MP4 placeholder in this MVP.</details>
        </div>
      </section>
    </div>
  );
}
