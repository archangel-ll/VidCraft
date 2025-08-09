"use client";

import { useApp } from "@/context/AppContext";
import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { useState } from "react";

export default function AdminPage() {
  const { snapshot } = useApp();
  const current = snapshot.users.find((u) => u.id === snapshot.currentUserId);
  const [selectedUserId, setSelectedUserId] = useState<string | undefined>();

  if (!current || current.role !== "admin") {
    return <div className="mx-auto max-w-3xl px-4 py-10">Access denied.</div>;
  }

  const selectedUser = snapshot.users.find((u) => u.id === selectedUserId);

  return (
    <div className="mx-auto max-w-6xl px-4 py-8 space-y-6">
      <h1 className="text-2xl font-bold">Admin Panel</h1>
      <div className="grid gap-6 md:grid-cols-2">
        <Card>
          <CardHeader>
            <h3 className="text-lg font-semibold">Users</h3>
          </CardHeader>
          <CardContent>
            <ul className="space-y-2 text-sm">
              {snapshot.users.map((u) => (
                <li key={u.id} className="flex items-center justify-between">
                  <button className="text-left hover:underline" onClick={() => setSelectedUserId(u.id)}>
                    {u.email} <span className="text-slate-500">({u.role})</span>
                  </button>
                  <span className="text-slate-600">{u.credits} cr</span>
                </li>
              ))}
            </ul>
          </CardContent>
        </Card>
        <Card>
          <CardHeader>
            <h3 className="text-lg font-semibold">Analytics</h3>
          </CardHeader>
          <CardContent>
            <div className="text-sm grid grid-cols-2 gap-4">
              <div>
                <div className="text-slate-500">Users</div>
                <div className="text-xl font-semibold">{snapshot.users.length}</div>
              </div>
              <div>
                <div className="text-slate-500">VSLs</div>
                <div className="text-xl font-semibold">{snapshot.vslJobs.length}</div>
              </div>
              <div>
                <div className="text-slate-500">Transactions</div>
                <div className="text-xl font-semibold">{snapshot.transactions.length}</div>
              </div>
              <div>
                <div className="text-slate-500">Referrals</div>
                <div className="text-xl font-semibold">{snapshot.referrals.length}</div>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {selectedUser ? (
        <Card>
          <CardHeader>
            <h3 className="text-lg font-semibold">Manage {selectedUser.email}</h3>
          </CardHeader>
          <CardContent>
            <div className="flex items-center gap-2 text-sm">
              <div>Credits: {selectedUser.credits}</div>
              <Button disabled>Adjust (mock)</Button>
            </div>
          </CardContent>
        </Card>
      ) : null}
    </div>
  );
}