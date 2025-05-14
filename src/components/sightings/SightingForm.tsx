
import { useState } from "react";
import { useForm } from "react-hook-form";
import { Button } from "@/components/ui/button";
import { Calendar } from "@/components/ui/calendar";
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { Textarea } from "@/components/ui/textarea";
import { BirdInfo } from "../bird-identification/BirdResult";
import { format } from "date-fns";
import { Calendar as CalendarIcon } from "lucide-react";
import { cn } from "@/lib/utils";

export interface SightingData {
  id: string;
  birdInfo: BirdInfo;
  date: Date;
  location: string;
  notes: string;
}

interface SightingFormProps {
  birdInfo: BirdInfo;
  onSubmit: (data: SightingData) => void;
  onCancel: () => void;
}

export function SightingForm({ birdInfo, onSubmit, onCancel }: SightingFormProps) {
  const [date, setDate] = useState<Date>(new Date());
  
  const form = useForm({
    defaultValues: {
      location: "",
      notes: "",
    },
  });

  const handleSubmit = form.handleSubmit((data) => {
    onSubmit({
      id: Date.now().toString(),
      birdInfo,
      date,
      ...data,
    });
  });

  return (
    <Form {...form}>
      <form onSubmit={handleSubmit} className="space-y-4">
        <div className="mb-4">
          <h3 className="text-lg font-semibold mb-1">{birdInfo.name}</h3>
          <p className="text-sm text-muted-foreground italic">{birdInfo.scientificName}</p>
        </div>

        <FormField
          control={form.control}
          name="location"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Location</FormLabel>
              <FormControl>
                <Input placeholder="Enter location" {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        <FormItem className="flex flex-col">
          <FormLabel>Date</FormLabel>
          <Popover>
            <PopoverTrigger asChild>
              <Button
                variant={"outline"}
                className={cn(
                  "w-full justify-start text-left font-normal",
                  !date && "text-muted-foreground"
                )}
              >
                <CalendarIcon className="mr-2 h-4 w-4" />
                {date ? format(date, "PPP") : <span>Pick a date</span>}
              </Button>
            </PopoverTrigger>
            <PopoverContent className="w-auto p-0">
              <Calendar
                mode="single"
                selected={date}
                onSelect={(date) => date && setDate(date)}
                initialFocus
              />
            </PopoverContent>
          </Popover>
        </FormItem>

        <FormField
          control={form.control}
          name="notes"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Notes</FormLabel>
              <FormControl>
                <Textarea
                  placeholder="Add any notes about this sighting..."
                  className="resize-none"
                  {...field}
                />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        <div className="flex justify-end space-x-2 pt-2">
          <Button variant="outline" type="button" onClick={onCancel}>
            Cancel
          </Button>
          <Button type="submit">Save Sighting</Button>
        </div>
      </form>
    </Form>
  );
}
