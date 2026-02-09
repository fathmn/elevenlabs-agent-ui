import { ConversationWidget } from "@/app/components/ConversationWidget"

export default function Home() {
  return (
    <div className="bg-background text-foreground min-h-dvh">
      <main className="mx-auto flex min-h-dvh w-full max-w-xl flex-col gap-4 p-4">
        <ConversationWidget />
      </main>
    </div>
  );
}
