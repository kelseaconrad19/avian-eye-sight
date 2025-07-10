
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
import { Calendar as CalendarIcon, MapPin, Loader2 } from "lucide-react";
import { cn } from "@/lib/utils";
import { useToast } from "@/hooks/use-toast";

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
  const [isGettingLocation, setIsGettingLocation] = useState(false);
  const { toast } = useToast();
  
  const form = useForm({
    defaultValues: {
      location: "",
      notes: "",
    },
  });

  const getCurrentLocation = async () => {
    setIsGettingLocation(true);
    
    try {
      // Check if geolocation is supported
      if (!navigator.geolocation) {
        throw new Error("Geolocation is not supported by this browser");
      }

      // Get current position
      const position = await new Promise<GeolocationPosition>((resolve, reject) => {
        navigator.geolocation.getCurrentPosition(resolve, reject, {
          enableHighAccuracy: true,
          timeout: 10000,
          maximumAge: 60000
        });
      });

      const { latitude, longitude } = position.coords;
      
      // Reverse geocode to get address
      try {
        const response = await fetch(
          `https://api.bigdatacloud.net/data/reverse-geocode-client?latitude=${latitude}&longitude=${longitude}&localityLanguage=en`
        );
        
        if (response.ok) {
          const data = await response.json();
          const location = [
            data.locality || data.city,
            data.principalSubdivision || data.region,
            data.countryName
          ].filter(Boolean).join(", ");
          
          form.setValue("location", location || `${latitude.toFixed(4)}, ${longitude.toFixed(4)}`);
        } else {
          // Fallback to coordinates
          form.setValue("location", `${latitude.toFixed(4)}, ${longitude.toFixed(4)}`);
        }
      } catch (geocodeError) {
        // Fallback to coordinates if reverse geocoding fails
        form.setValue("location", `${latitude.toFixed(4)}, ${longitude.toFixed(4)}`);
      }

      toast({
        title: "Location found!",
        description: "Your current location has been added to the sighting.",
      });
      
    } catch (error) {
      console.error("Error getting location:", error);
      
      let errorMessage = "Could not get your location. ";
      if (error instanceof GeolocationPositionError) {
        switch (error.code) {
          case error.PERMISSION_DENIED:
            errorMessage += "Please allow location access in your browser settings.";
            break;
          case error.POSITION_UNAVAILABLE:
            errorMessage += "Location information is unavailable.";
            break;
          case error.TIMEOUT:
            errorMessage += "Location request timed out.";
            break;
        }
      } else {
        errorMessage += "Please enter your location manually.";
      }
      
      toast({
        title: "Location Error",
        description: errorMessage,
        variant: "destructive",
      });
    } finally {
      setIsGettingLocation(false);
    }
  };

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
              <div className="flex gap-2">
                <FormControl>
                  <Input placeholder="Enter location or use current location" {...field} />
                </FormControl>
                <Button
                  type="button"
                  variant="outline"
                  size="icon"
                  onClick={getCurrentLocation}
                  disabled={isGettingLocation}
                  title="Use current location"
                >
                  {isGettingLocation ? (
                    <Loader2 className="h-4 w-4 animate-spin" />
                  ) : (
                    <MapPin className="h-4 w-4" />
                  )}
                </Button>
              </div>
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
