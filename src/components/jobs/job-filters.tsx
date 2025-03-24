import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Menu } from "lucide-react";
import { Input } from "@/components/ui/input";
import { employmentTypeValues, type SearchFilters } from "@/schemas";
import { Checkbox } from "@/components/ui/checkbox";
import { Separator } from "@/components/ui/separator";
import { Label } from "@/components/ui/label";
import { useState } from "react";
import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from "@/components/ui/sheet";

interface JobFiltersProps {
  filters: SearchFilters;
  onUpdateFilters: (updates: Partial<SearchFilters>) => void;
  onClearFilters: () => void;
}

export function JobFilters({
  filters,
  onUpdateFilters,
  onClearFilters,
}: JobFiltersProps) {
  const [isFilterSheetOpen, setIsFilterSheetOpen] = useState(false);

  return (
    <>
      {/* Mobile Filter Toggle */}
      <div className="mb-4 block md:hidden">
        <Sheet open={isFilterSheetOpen} onOpenChange={setIsFilterSheetOpen}>
          <SheetTrigger asChild>
            <Button variant="outline" className="w-full">
              <Menu className="mr-2 h-4 w-4" /> Filter Jobs
            </Button>
          </SheetTrigger>
          <SheetContent side="left" className="w-[300px] overflow-y-auto">
            <SheetHeader>
              <SheetTitle>Job Filters</SheetTitle>
            </SheetHeader>
            <div className="mt-4 space-y-4">
              <Input
                value={filters.search}
                placeholder="Search"
                onChange={(e) => onUpdateFilters({ search: e.target.value })}
              />
              <Separator className="my-4" />
              <div className="flex flex-col gap-4">
                {employmentTypeValues.map((type) => (
                  <div key={type} className="flex items-center space-x-2">
                    <Checkbox
                      id={type}
                      checked={filters.employmentTypes.includes(type)}
                      onCheckedChange={() => {
                        const newTypes = filters.employmentTypes.includes(type)
                          ? filters.employmentTypes.filter((t) => t !== type)
                          : [...filters.employmentTypes, type];
                        onUpdateFilters({ employmentTypes: newTypes });
                      }}
                    />
                    <Label htmlFor={type}>{type}</Label>
                  </div>
                ))}
              </div>
              <div className="mt-4 flex justify-between">
                <Button onClick={onClearFilters} variant="outline">
                  Clear Filters
                </Button>
                <Button onClick={() => setIsFilterSheetOpen(false)}>
                  Apply
                </Button>
              </div>
            </div>
          </SheetContent>
        </Sheet>
      </div>

      {/* Desktop Filters */}
      <Card className="hidden h-fit w-full max-w-[250px] flex-none bg-white/10 md:block">
        <CardHeader>
          <CardTitle>Filters</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="flex-col space-y-4">
            <Input
              value={filters.search}
              placeholder="Search"
              onChange={(e) => onUpdateFilters({ search: e.target.value })}
            />
            <div>
              <Separator className="my-4" />
              <div className="flex flex-col gap-4">
                {employmentTypeValues.map((type) => (
                  <div key={type} className="flex items-center space-x-2">
                    <Checkbox
                      id={type}
                      checked={filters.employmentTypes.includes(type)}
                      onCheckedChange={() => {
                        const newTypes = filters.employmentTypes.includes(type)
                          ? filters.employmentTypes.filter((t) => t !== type)
                          : [...filters.employmentTypes, type];
                        onUpdateFilters({ employmentTypes: newTypes });
                      }}
                    />
                    <Label htmlFor={type}>{type}</Label>
                  </div>
                ))}
              </div>
            </div>
            <Button className="w-full" onClick={onClearFilters}>
              Clear
            </Button>
          </div>
        </CardContent>
      </Card>
    </>
  );
}
