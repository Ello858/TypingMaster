import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { useQuery } from "@tanstack/react-query";
import { Code, Book, Quote } from "lucide-react";

interface ThemeSelectorProps {
  value: string;
  onValueChange: (value: string) => void;
}

const themeIcons = {
  code: <Code className="h-4 w-4" />,
  story: <Book className="h-4 w-4" />,
  quote: <Quote className="h-4 w-4" />,
};

export function ThemeSelector({ value, onValueChange }: ThemeSelectorProps) {
  const { data: themes = [] } = useQuery<string[]>({
    queryKey: ["/api/themes"],
  });

  return (
    <Select value={value} onValueChange={onValueChange}>
      <SelectTrigger className="w-[180px]">
        <SelectValue placeholder="Select a theme" />
      </SelectTrigger>
      <SelectContent>
        <SelectItem value="all" className="flex items-center gap-2">
          All Themes
        </SelectItem>
        {themes.map((theme) => (
          <SelectItem key={theme} value={theme} className="flex items-center gap-2">
            {themeIcons[theme as keyof typeof themeIcons]}
            <span className="capitalize">{theme}</span>
          </SelectItem>
        ))}
      </SelectContent>
    </Select>
  );
}