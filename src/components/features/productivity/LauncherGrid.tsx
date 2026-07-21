import { LauncherTile, type LauncherTileProps } from "@/components/features/productivity/LauncherTile";

export interface LauncherGridProps {
  tiles: LauncherTileProps[];
}

export function LauncherGrid({ tiles }: LauncherGridProps) {
  return (
    <div className="grid gap-6 sm:grid-cols-2 xl:grid-cols-3">
      {tiles.map((tile) => (
        <LauncherTile key={tile.label} {...tile} />
      ))}
    </div>
  );
}
