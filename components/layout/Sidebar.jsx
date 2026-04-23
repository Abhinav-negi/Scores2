import SportFilter from './SportFilter';

export default function Sidebar() {
  return (
    <aside className="hidden w-64 flex-col border-r border-brand-secondary bg-background md:flex">
      <div className="flex-1 overflow-y-auto py-4">
        <SportFilter />
        
        <div className="mt-8 px-4">
          <div className="rounded-lg bg-brand-secondary/30 p-4 border border-brand-secondary/50">
            <h4 className="text-sm font-medium text-brand-primary mb-1">Tailored for you</h4>
            <p className="text-xs text-foreground/70 leading-relaxed">
              Your dashboard feed is filtered by the sports selected above.
            </p>
          </div>
        </div>
      </div>
    </aside>
  );
}
