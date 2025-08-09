"use client";

import { useState } from "react";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import { Progress } from "@/components/ui/progress";
import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { useApp } from "@/context/AppContext";
import { canAffordGeneration } from "@/lib/credits";
import type { VslParameters } from "@/lib/types";

export default function DashboardPage() {
  const { currentUser, credits, generateVsl, snapshot, getReferralLink, purchaseTier } = useApp();
  const [params, setParams] = useState<VslParameters>({
    productName: "",
    targetAudience: "",
    tone: "friendly",
    brandColorHex: "#38bdf8",
    primaryBenefit: "",
    callToAction: "",
  });
  const [error, setError] = useState<string | undefined>();
  const [submitting, setSubmitting] = useState(false);

  if (!currentUser) return <div className="mx-auto max-w-3xl px-4 py-10">Please log in.</div>;

  const userJobs = snapshot.vslJobs.filter((j) => j.userId === currentUser.id).sort((a, b) => b.createdAt.localeCompare(a.createdAt));
  const userTx = snapshot.transactions.filter((t) => t.userId === currentUser.id).sort((a, b) => b.createdAt.localeCompare(a.createdAt));
  const refLink = getReferralLink();

  async function onGenerate(e: React.FormEvent) {
    e.preventDefault();
    setError(undefined);
    if (!params.productName || !params.targetAudience || !params.primaryBenefit || !params.callToAction) {
      setError("All fields are required.");
      return;
    }
    if (!canAffordGeneration(credits)) {
      setError("You need at least 1 credit.");
      return;
    }
    setSubmitting(true);
    const res = await generateVsl(params);
    setSubmitting(false);
    if (!res.ok) setError(res.error);
  }

  function onToneChange(e: React.ChangeEvent<HTMLSelectElement>) {
    setParams({ ...params, tone: e.target.value as VslParameters["tone"] });
  }

  return (
    <div>
      <div className="border-b bg-sky-400 text-white">
        <div className="mx-auto max-w-6xl px-4 py-4 flex items-center justify-between">
          <h1 className="text-xl font-semibold">Dashboard</h1>
          <div className="text-sm">Credits: <span className="font-semibold">{credits}</span></div>
        </div>
      </div>
      <div className="mx-auto max-w-6xl px-4 py-6">
        <Tabs defaultValue="generate">
          <TabsList>
            <TabsTrigger value="generate">Generate</TabsTrigger>
            <TabsTrigger value="library">My VSLs</TabsTrigger>
            <TabsTrigger value="referrals">Refer & Earn</TabsTrigger>
            <TabsTrigger value="billing">Billing</TabsTrigger>
          </TabsList>

          <TabsContent value="generate">
            <form className="grid gap-4 sm:grid-cols-2" onSubmit={onGenerate}>
              <div className="sm:col-span-2">
                <Label>Product name</Label>
                <Input value={params.productName} onChange={(e) => setParams({ ...params, productName: e.target.value })} placeholder="e.g., NanoSmooth Hair Serum" />
              </div>
              <div>
                <Label>Target audience</Label>
                <Input value={params.targetAudience} onChange={(e) => setParams({ ...params, targetAudience: e.target.value })} placeholder="e.g., Busy professionals" />
              </div>
              <div>
                <Label>Tone</Label>
                <select className="h-10 w-full rounded-md border border-slate-200 bg-white px-3 text-sm focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-sky-400" value={params.tone} onChange={onToneChange}>
                  <option value="friendly">Friendly</option>
                  <option value="professional">Professional</option>
                  <option value="excited">Excited</option>
                  <option value="urgent">Urgent</option>
                  <option value="casual">Casual</option>
                  <option value="authoritative">Authoritative</option>
                </select>
              </div>
              <div>
                <Label>Brand color</Label>
                <Input type="color" value={params.brandColorHex} onChange={(e) => setParams({ ...params, brandColorHex: e.target.value })} />
              </div>
              <div>
                <Label>Primary benefit</Label>
                <Input value={params.primaryBenefit} onChange={(e) => setParams({ ...params, primaryBenefit: e.target.value })} placeholder="e.g., Visible results in 7 days" />
              </div>
              <div>
                <Label>Call to action</Label>
                <Input value={params.callToAction} onChange={(e) => setParams({ ...params, callToAction: e.target.value })} placeholder="e.g., Shop now and save 20%" />
              </div>
              {error ? <p className="sm:col-span-2 text-sm text-red-600">{error}</p> : null}
              <div className="sm:col-span-2">
                <Button type="submit" disabled={submitting}>Generate 8-second VSL</Button>
              </div>
            </form>
          </TabsContent>

          <TabsContent value="library">
            {userJobs.length === 0 ? (
              <p className="text-sm text-slate-600">No VSLs yet. Generate your first one!</p>
            ) : (
              <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
                {userJobs.map((job) => (
                  <Card key={job.id}>
                    <CardHeader>
                      <div className="text-sm font-medium">{job.parameters.productName}</div>
                      <div className="text-xs text-slate-600">{new Date(job.createdAt).toLocaleString()}</div>
                    </CardHeader>
                    <CardContent>
                      <div className="space-y-2">
                        <div className="text-xs">Status: <span className="font-medium">{job.status}</span></div>
                        {job.status !== "completed" ? <Progress value={job.progressPercent} /> : null}
                        {job.status === "completed" ? (
                          <div className="space-y-2">
                            <div className="aspect-video w-full rounded bg-slate-100 flex items-center justify-center text-slate-500 text-sm">8s MP4</div>
                            <a className="text-sm text-sky-600 hover:underline" href={job.downloadUrl} download={`vsl-${job.id}.mp4`}>Download MP4</a>
                          </div>
                        ) : null}
                      </div>
                    </CardContent>
                  </Card>
                ))}
              </div>
            )}
          </TabsContent>

          <TabsContent value="referrals">
            <Card>
              <CardHeader>
                <h3 className="text-lg font-semibold">Invite friends, get free credits</h3>
              </CardHeader>
              <CardContent>
                <p className="text-sm text-slate-600">Share your unique link. When someone signs up, you both get +3 credits.</p>
                <div className="mt-3 flex items-center gap-2">
                  <input className="flex-1 rounded-md border border-slate-200 px-3 py-2 text-sm" value={refLink ?? ""} readOnly />
                  <Button onClick={() => refLink && navigator.clipboard.writeText(refLink)}>Copy</Button>
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="billing">
            <div className="grid gap-6 lg:grid-cols-2">
              <Card>
                <CardHeader>
                  <h3 className="text-lg font-semibold">Transactions</h3>
                </CardHeader>
                <CardContent>
                  {userTx.length === 0 ? (
                    <p className="text-sm text-slate-600">No transactions yet.</p>
                  ) : (
                    <ul className="space-y-2 text-sm">
                      {userTx.map((t) => (
                        <li key={t.id} className="flex items-center justify-between">
                          <span>{t.description}</span>
                          <span className={t.creditsChange >= 0 ? "text-green-600" : "text-red-600"}>{t.creditsChange > 0 ? "+" : ""}{t.creditsChange} cr</span>
                        </li>
                      ))}
                    </ul>
                  )}
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <h3 className="text-lg font-semibold">Need more credits?</h3>
                </CardHeader>
                <CardContent>
                  <div className="flex flex-wrap gap-2">
                    <Button onClick={() => purchaseTier("starter")}>Buy Starter (10)</Button>
                    <Button onClick={() => purchaseTier("pro")} variant="secondary">Buy Pro (25)</Button>
                    <Button onClick={() => purchaseTier("scale")} variant="outline">Buy Scale (60)</Button>
                  </div>
                </CardContent>
              </Card>
            </div>
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
}