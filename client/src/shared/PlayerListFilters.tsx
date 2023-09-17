import { Button, Flex } from "@radix-ui/themes";

interface PlayerListFiltersProps {
  allFilters: Record<string, string[]>;
  selectedFilter: string;
  setSelectedFilter: (filter: string) => void;
}

export function PlayerListFilters({
  allFilters,
  selectedFilter,
  setSelectedFilter,
}: PlayerListFiltersProps) {
  return (
    <Flex gap="1" wrap="wrap-reverse">
      {Object.entries(allFilters).map(([filter, players]) => (
        <Button
          key={filter}
          size="1"
          onClick={() => {
            setSelectedFilter(filter);
          }}
          className="min-w-fit flex-1 capitalize"
          variant={filter === selectedFilter ? "solid" : "surface"}
        >
          {filter}({players.length})
        </Button>
      ))}
    </Flex>
  );
}
