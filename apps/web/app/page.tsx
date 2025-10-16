import { Button } from "@repo/ui/button";

export default function Home() {
  return (
    <div className="flex flex-col gap-5">
      <div className="bg-tahiti w-full">tailwind test</div>
      <Button appName="web">Click me</Button>
    </div>
  );
}
